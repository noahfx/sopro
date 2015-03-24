var uuid = require('node-uuid');
var async = require('async');

module.exports = function(){
  var PI = {};
  PI.adapters = [];
  PI.use = function(adapter){
    PI.adapters.push(adapter);
  }

  function ensureId(data){
    if(data._id === undefined){
      data._id = uuid.v4();
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

  PI.create = function(model, data, callback){
    data = ensureId(data);
    data = ensureModel(data, model);
    async.map(PI.adapters, function(adapter, done){
      adapter.create(model, data, done);
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

  PI.read = function(id, callback){
    async.map(PI.adapters, function(adapter, done){
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