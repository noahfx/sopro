'use strict';

describe("societyProChat Controllers", function() {
   var scope, createController, httpBackend;

  beforeEach(module("societyProChatApp"));
  
  beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
      httpBackend = $httpBackend;

      httpBackend.expect('GET', '/channels?userID=abc')
        .respond({
            "ok": true,
            "channels": [
              {"name": "general"},
              {"name": "test"},
              {"name": "devs"},
              {"name": "random"},
              {"name": "stuff"},
              {"name": "channel2"}
            ],
            "peers": [
              {"name": "Jimmy"},
              {"name": "Mario"},
              {"name": "jorge"},
              {"name": "maria"},
              {"name": "jhon"},
              {"name": "peersito"}
            ]
        });

      scope = $rootScope.$new();

      createController = function() {
          var controller = $controller('mainController', {
              '$scope': scope
          });
          httpBackend.flush();
          return controller;
      };
  }));

  afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
  });

  it("has an array of roles", function () {
    var controller = createController();
    expect(scope.roles).not.toBeUndefined();
    expect(Object.prototype.toString.call(scope.roles)).toEqual('[object Array]');
  });

  it("has an array of channels", function () {
    var controller = createController();
    expect(scope.channels).not.toBeUndefined();
    expect(Object.prototype.toString.call(scope.channels)).toEqual('[object Array]');
  });

  it("has an array of peers", function () {
    var controller = createController();
    expect(scope.peers).not.toBeUndefined();
    expect(Object.prototype.toString.call(scope.channels)).toEqual('[object Array]');
  });
});