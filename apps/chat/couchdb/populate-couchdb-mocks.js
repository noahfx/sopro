// This script wipes out, recreates, and populates the 'mocks' database.
var config = require('./config.js');

var nano = require('nano')({
  url: config.url
});

var async = require('async');
var fs = require('fs');

async.series([
  destroyOldTestDb,
  createTestDb,
  populateTestDb,
], function(err){
  if(err){ throw new Error(err)}
  console.log('Successfully (re)generated mock couchdb')
  process.exit();
})

function destroyOldTestDb(done){
  nano.db.destroy('mocks', function(err, body, headers){
    if(err){
      console.log(err, body, headers);
      if(err.error !== "not_found"){
        throw(err);
      }
    }
    done();
  });
}

function createTestDb(done){
  nano.db.create('mocks', function(err, body, headers){
    if(err){
      return done(err)
    }
    done();
  });
}

function populateTestDb(done){
  var mocks = nano.use('mocks');
  var user1JSON = fs.readFileSync('./mocks/user1.json');
  var user1 = JSON.parse(user1JSON);
  var soprochatJSON = fs.readFileSync('./soprochat-views.json');
  var soprochat = JSON.parse(soprochatJSON);

  mocks.insert(user1, user1.userid, function(err, body, header){
    if(err){ return done(err)}
    ///done();
  /*
    nano.request({
      db: 'mocks',
      method: 'put',
      doc: soprochat['']

    })
*/
    mocks.insert(soprochatJSON, soprochat._id, function(err){
      if(err){ return done(err)}
      done();
    })
  })
}