// This script wipes out, recreates, and populates the 'mocks' database.
var config = require('../cfg/server.cfg.js').couchdb;

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

function populateTestDb(callback){
  var mocks = nano.use('mocks');
  var user1JSON = fs.readFileSync('./mocks/user1.json');
  var user1 = JSON.parse(user1JSON);
  var user2JSON = fs.readFileSync('./mocks/user2.json');
  var user2 = JSON.parse(user2JSON);
  var soprochatJSON = fs.readFileSync('./soprochat-views.json');
  var soprochat = JSON.parse(soprochatJSON);

  var mockDocuments = [
    './mocks/user1.json',
    './mocks/user2.json',
    './mocks/identity1.json',
    './mocks/identity2.json',
    './soprochat-views.json',
  ]

  async.eachSeries(mockDocuments, function(path, done){
    var json = fs.readFileSync(path);
    var doc = JSON.parse(json);
    mocks.insert(doc, doc._id, done)
  }, function(err){
    if(err){
      return callback(err)
    }
    callback(null);
  })

}