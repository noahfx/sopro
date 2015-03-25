var uuid = require('node-uuid');
var async = require('async');

module.exports = function(){
  var PI = {};
  PI.adapters = [];
  PI.use = function(adapter){
    PI.adapters.push(adapter);
  }

  function ensureId(action, data){
    if(data._id === undefined){
      switch (action) {
        case "create": 
          data._id = uuid.v4();
          break;
        case "update":
          throw new Error("No _id field specified in update");
          break; 
      }
    }
    return data;
  };

  function ensureModel(data, model){
    if(model === 'undefined'){
      throw new Error('Trying to ensure an undefined model')
    }
    if(data.soproModel === undefined){
      data.soproModel = model;
    }
    return data;
  };

  function createOrUpdate(action, model, data, callback) {
    data = ensureId(action,data);
    data = ensureModel(data, model);
    async.mapSeries(PI.adapters, function(adapter, done){
      if (action == "create") {
        adapter.create(model, data, done);  
      } else if (action == "update") {
        adapter.update(data, done);
      } 
    }, function(err, results){
      if(err){
        return callback(err);
      }
      if(results.length > 1){
        console.log('Read an object from multiple persistors. Returning the first one.')
      }
      callback(null, results[0])
    });
  }

  PI.create = function(model, data, callback){
    createOrUpdate("create", model, data, callback);
  };

  PI.update = function(model, data, callback){
    createOrUpdate("update", model, data, callback);
  };

  PI.read = function(id, callback){
    async.mapSeries(PI.adapters, function(adapter, done){
      adapter.read(id, done);
    }, function(err, results){
      if(err){
        return callback(err);
      }
      if(results.length > 1){
        console.log('Read an object from multiple persistors. Returning the first one.')
      }
      callback(null, results[0])
    })
  };

  PI.destroy = function(data, callback){
    async.each(PI.adapters, function(adapter, done){
      adapter.destroy(data, done);
    }, callback)
  };

  return PI;
}