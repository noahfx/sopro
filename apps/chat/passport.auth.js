var serverConfig = require('./cfg/servers.js');
var nano = require('nano')(serverConfig.couchdb.url);
var async = require('async');

var db = nano.use(serverConfig.couchdb.db);
var crypto = require('crypto');


module.exports = function(app){
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy;
  passport.use(new LocalStrategy(checkAuthCouchdb));

  // Take a user and turn it into a unique key for the session identifier
  passport.serializeUser(function(user, done) {
    done(null, user.userid);
  });

  // Take the session identifier and turn it into a unique key for a user
  passport.deserializeUser(function(id, done) {
    async.waterfall([
      function(next){
        userById(id, next)
      },
      findRoles,
    ], function(err, userWithRoles){
      if(err){
        return done(err);
      }
      done(null, userWithRoles);
    })
  });

  return passport;
}

function userById(id, callback){
  db.view('soprochat', 'user_by_userid', {key: id}, function(err, body){
    if(err){
      return callback(err)
    };
    if(body.rows.length > 1){
      return callback(new Error('Found more than one user object for id '+id))
    };
    if(body.rows.length == 0){
      return callback('not_found')
    }
    callback(null, body.rows[0].value)
  })
}


function checkAuthCouchdb(username, password, callback){
  async.waterfall([
    function(next){
      next(null, username, password);
    },
    compareHash,
    findUser,
    findRoles,
  ], function (err, user){
    callback(err, user);
  })
}

  function compareHash(username, password, next){
    db.view('soprochat', 'pwdauth', {key: username}, function(err, body){
      if(err){
        console.log(err);
        return next(err, false);
      }
      if(body.rows.length === 0){
        return next(null, false);
      }
      if(body.rows.length > 1){
        return next('multiple users found', false);
      }
      var salt = body.rows[0].value[0];
      var hash = body.rows[0].value[1];
      var userid = body.rows[0].value[2];

      var toHash = password.concat(salt);
      var sha256er = crypto.createHash('sha256');
      sha256er.update(toHash,'utf8');
      var saltedHash = sha256er.digest('hex');

      if(saltedHash == hash) { // password matched
        return next(null, userid)
      } else {
        return next(null, false);
      };

    })
  }

  function findUser(userid, next){
    if(userid === false){
      return next(null, false);
    }
    userById(userid, function(err, user){
      user.salt = undefined;
      user.hash = undefined;
      if(err && err === 'not_found'){
        return next(null, false);
      } else if(err){
        return next(err, false);
      }
      return next(null, user);
    })
  }


  function findRoles(user, next){
    if(user === false){
      return next(null, false);
    }
    db.view('soprochat', 'identities_for_userid', {key: user.userid}, function(err, body){
      if(err){
        return next(err)
      };
      if(body.rows.length == 0){
        return next('no_identities_for_user');
      }
      var identities = [];
      body.rows.forEach(function(row){
        identities.push(row.value);
      })
      user.identities = identities;
      next(null, user)
    })
  };

