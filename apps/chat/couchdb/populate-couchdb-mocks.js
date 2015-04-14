var glob = require('glob');
// This script wipes out, recreates, and populates the 'mocks' database.
var config = require('../cfg/servers.js').couchdb;

// We need relative paths, so make sure we're in the right directory:
var assert = require('assert');
assert(process.cwd().match(/couchdb$/), 'Wrong directory! Invoke populate-couchdb-mocks from /apps/chat/couchdb')

// Load persistence interface
var PI = require('../persistence-interface.js')();
var PICouch = require('../persistence-couchdb');
PI.use(PICouch);

var nano = require('nano')({
  url: config.url
});

var async = require('async');
var fs = require('fs');

async.series([
  destroyOldTestDb,
  createTestDb,
  populateDesignDocs,
  populateTestDb,
], function(err){
  if(err){ throw new Error(err)}
  console.log('Successfully (re)generated mock couchdb')
  process.exit();
})

function destroyOldTestDb(done){
  nano.db.destroy('mocks', function(err, body, headers){
    if(err){
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

function populateDesignDocs(done){
  var mocks = nano.use('mocks');
  var soprochatJSON = fs.readFileSync('./soprochat-views.json');
  var soprochat = JSON.parse(soprochatJSON);
  // Not using PI.create because design docs don't have a .soproModel property
  mocks.insert(soprochat, soprochat._id, done)
}

function populateTestDb(callback){
  glob('mocks/*.json', {nonull: false}, function(err, files){
    assert(!err);
    console.log('Populating', files.length, 'mocks')
    async.eachSeries(files, function(path, done){
      var json = fs.readFileSync(path);
      var doc = JSON.parse(json);
      PI.create(doc.soproModel, doc, done)
    })
  })


}