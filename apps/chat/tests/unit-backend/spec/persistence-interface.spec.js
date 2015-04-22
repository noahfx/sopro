// tests/unit/jasmine/spec/persistence-interface.spec.jasmine
var memoryAdapter = {
  create: function(model, data, callback){
    return callback(null, data);
  },
  update: function(data, callback){
    return callback(null, data);
  },
  read: function(id, callback) {
    return callback(null, {_id: 12345, name: 'secondRecord'});
  },
  readAll: function(model, callback) {
    return callback(null, [{_id: 12345, name: "firstRecord"}, {_id: 23456, name: 'secondRecord'}]);
  }
};

var PI = require('../../../persistence-interface')();
var PICouch = require('../../../persistence-couchdb');

PI.use(PICouch);
PI.use(memoryAdapter);

function spyCreate() {
  spyOn(PICouch, 'create').and.callFake(function(model, data, callback) {
    return callback(null, data);
  });
};

var errorCallback = function(err, body) {
};

describe('persistence-interface', function() {
  
  it('adds an id to a new user', function(done) {
    var userData = {username: 'testIDUser', identities: ['abc']};
    spyCreate();
    PI.create('user', userData, function (err, returnData) {
      expect(returnData._id).not.toBe(undefined);
      done();
    });
  });

  it('throws an error if an _id is not passed when updating a user', function() {
    var userData = {username: 'testIDErrorUser', identities: ['abc']};
    spyOn(PICouch, 'update').and.callFake(function(data, callback) {
      return callback(null, data);
    });
    expect(function(){PI.update('user', userData, errorCallback);}).toThrow(new Error("No _id field specified in update"));
    expect(PICouch.update).not.toHaveBeenCalled();
  });

  it('throws an error if the model type is undefined', function() {
    var userData = {
      username: 'testModelErrorUser',
      identities: ['abc']
    };
    spyCreate();
    var modelType = undefined;
    expect(function(){PI.create(modelType, userData, errorCallback);}).toThrow(new Error('Trying to ensure an undefined model'));
    expect(PICouch.create).not.toHaveBeenCalled();
  });

  it('throws an error if the model type doesnt match data.soproModel', function() {
    var userData = {
      soproModel: 'channel',
      username: 'testWrongUser',
      identities: ['abc']
    };
    spyCreate();
    var modelType = 'user';
    expect(function(){
      PI.create(modelType, userData, errorCallback);
    }).toThrow(
      new Error('Expected and actual model did not match')
    );
    expect(PICouch.create).not.toHaveBeenCalled();
  });

  it('applies the model type to undefined soproModel', function(done) {
    var userData = {username: 'testModelUser', identities: ['abc']};
    spyCreate();
    PI.create('user', userData, function (err, returnData) {
      expect(returnData.soproModel).toEqual('user');
      done();
    });
  });

  it("proxies the create action to the db adapters", function() {
    var userData = {username: 'testCreateUser', identities: ['abc']};
    spyCreate();
    PI.create('user', userData, function(err, returnData) {    
      expect(PICouch.create).toHaveBeenCalled();  
      expect(PI.adapters.length).toEqual(2);
      expect(returnData.length).toEqual(undefined);
    });  
  });

  it("proxies the update action to the db adapters", function() {
    var userData = {username: 'testUpdateUser', identities: ['abc'], _id: 12345};
    spyOn(PICouch, 'update').and.callFake(function(data, callback) {
      return callback(null, data);
    });
    PI.update('user', userData, function(err, returnData) {
      expect(PI.adapters.length).toEqual(2);
      expect(returnData.length).toEqual(undefined);
    });
    expect(PICouch.update).toHaveBeenCalled();
  });

  it("proxies the read action to the db adapters", function() {
    spyOn(PICouch, 'read').and.callFake(function(data, callback) {
      return callback(data);
    });
    PI.read(12345, function(returnData) {
      expect(PI.adapters.length).toEqual(2);
      expect(returnData.length).toEqual(undefined);
    });
    expect(PICouch.read).toHaveBeenCalled();
  });

  it("returns all records returned on a readAll", function() {
    spyOn(PICouch, 'readAll').and.callFake(function(data, callback) {
      var mockData = [{_id: 12345, name: "firstRecord"}, {_id: 23456, name: 'secondRecord'}];
      return callback(null, mockData);
    });
    PI.readAll(12345, function(err, returnData) {
      expect(returnData.length).toEqual(2);
      expect(returnData[0].name).toEqual('firstRecord');
    });
  });

});
