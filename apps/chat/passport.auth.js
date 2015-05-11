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
    done(null, user._id);
  });

  // Take the session identifier and turn it into a unique key for a user
  passport.deserializeUser(function(id, done) {
    var opts = {id: id};
    async.waterfall([
      function(next){
        userById(opts, next)
      },
      setIdentities,
      setToken,
    ], function(err, opts){
      if(err){
        console.log(err);
        return done(err);
      }
      done(null, opts.user);
    })
  });

  return passport;
}

function userById(opts, callback){
  db.view('soprochat', 'user_by__id', {key: opts.id}, function(err, body){
    if(err){
      return callback(err)
    };
    if(body.rows.length > 1){
      return callback(new Error('Found more than one user object for id '+opts.id))
    };
    if(body.rows.length == 0){
      return callback('session_user_not_found')
    }
    opts.user = body.rows[0].value;
    callback(null, opts);
  })
}


function checkAuthCouchdb(username, password, callback){
  var opts = {
    username: username,
    password: password,
  }
  async.waterfall([
    function(next){
      next(null, opts);
    },
    findUser,
    checkHash,
    setIdentities,
    setToken,
  ], function (err, opts){
    if(err){
      if(typeof err === 'string'){
        if(/user_not_found/.test(err)){
          return callback(null, false);
        }
      }
      console.log(JSON.stringify(err));
      return callback(null, false);
    }
    callback(null, opts.user);
  })
}
  function findUser(opts, next){
    db.view('soprochat', 'user_by_name_email', {key: opts.username}, function(err, body){
      if(err){
        return next(err);
      }
      if(body.rows.length !== 1){
        return next('passport.auth:checkAuthCouchdb: user_not_found');
      }
      opts.user = body.rows[0].value;
      next(null, opts);
    });
  }

  function checkHash(opts, next){
    db.view('soprochat', 'pwdcred_by_for_userid', {key: opts.user._id}, function(err, body){
      if(err){
        console.log(err);
        return next(err, false);
      }
      if(body.rows.length === 0){
        return next('passport.auth:checkHash: credentials_not_found');
      }
      if(body.rows.length > 1){
        return next('passport.auth:checkHash: multiple_credentials_found');
      }
      var doc = body.rows[0].value;
      var salt = doc.salt;
      var hash = doc.hash;

      var toHash = opts.password.concat(salt);
      var sha256er = crypto.createHash('sha256');
      sha256er.update(toHash,'utf8');
      var saltedHash = sha256er.digest('hex');

      if(saltedHash == hash) { // password matched
        return next(null, opts)
      } else {
        return next('passport.auth:checkHash: password_mismatch');
      };

    })
  }


  function setIdentities(opts, next){
    if(opts.user === false){
      return next('passport.auth:setIdentities: identy_without_user');
    }
    db.view('soprochat', 'identity_by_for_userid', {key: opts.user._id}, function(err, body){
      if(err){
        return next(err)
      };
      if(body.rows.length == 0){
        return next('passport.auth:setIdentities: no_identities_for_user');
      }
      var identities = [];
      body.rows.forEach(function(row){
        identities.push(row.value);
      })
      opts.user.identities = identities;
      opts.user.currentIdentity = identities[0];
      next(null, opts)
    })
  };
//TODO feature Standard edition should have apiToken for all identities
  function setToken(opts, next){
    if(opts.user === false){
      return next('passport.auth:setToken: token_without_user');
    }
    db.view('soprochat', 'apiToken_by_for_identityid', {key: opts.user.currentIdentity._id}, function(err, body){
      if(err){
        return next(err)
      };
      if(body.rows.length == 0){
        return next('passport.auth:setToken: no_token_for_user');
      }
      opts.user.apiToken = body.rows[0].value.token;
      next(null, opts)
    });
  };
