var serverConfig = require('./cfg/servers.js');
var nano = require('nano')(serverConfig.couchdb.url);
var assert = require('assert');

db = nano.use(serverConfig.couchdb.db);

var couch = {};
couch.create = function(model, data, callback){
  db.insert(data, data._id, function(err, body){
    if(err){
      return callback(err);
    };
    data._id = body.id;
    data._rev = body.rev;
    callback(err, data);
  });
}
couch.read = function(id, callback){
  db.get(id, callback);
}

couch.update = function(data, callback){
  assert(data._id);
  assert(data._rev);
  db.insert(data, data._id, function(err, body){
    if(err){
      return callback(err);
    };
    callback(err, body);
  });
};

couch.destroy = function(data, callback){
  assert(data._id);
  assert(data._rev);
  db.destroy(data._id, data._rev, callback);
}

module.exports = couch;