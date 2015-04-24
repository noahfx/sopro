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

couch.readAll = function(model, callback) {
  db.view('soprochat', 'docs_by_soproModel', {key: model}, function(err, body){
    if(err){
      return callback(err)
    };
    var docs = [];
    body.rows.forEach(function(row){
      docs.push(row.value);
    })
    callback(null, docs);
  });
};

couch.update = function(data, callback){
  if(data._id === undefined){
    return callback('Cannot update couch data without _id property')
  } else if(data._rev === undefined){
    return callback('Cannot update couch data without _rev property')
  }
  db.insert(data, data._id, function(err, body){
    if(err){
      return callback(err);
    };
    data._id = body.id;
    data._rev = body.rev;
    callback(err, data);
  });
};

couch.destroy = function(data, callback){
  assert(data._id);
  assert(data._rev);
  db.destroy(data._id, data._rev, callback);
}

couch.find = function(model, key, value, callback){
  var viewName = model+'_by_'+key;
  db.view('soprochat', viewName, {key: value}, function(err, body){
    if(err){
      return callback(err);
    }
    var data = body.rows.map(function(row){
      return row.value;
    })
    callback(null, data);
  })
}

couch.view = function(viewName, options, callback){
  db.view('soprochat', viewName, options, function(err, body){
    if(err){
      return callback(err);
    }
    var data = body.rows.map(function(row){
      return row.value;
    })
    callback(null, data);
  })
}

module.exports = couch;