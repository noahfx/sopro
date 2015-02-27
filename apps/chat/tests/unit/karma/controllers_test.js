'use strict';

it('found the mocks', function(){
  expect(CAM_MOCKS.validToken).toEqual('12345');
})

describe("societyProChat Controllers", function() {
   var scope, rootscope, createController, httpBackend;

  beforeEach(module("societyProChatApp"));

  beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
      httpBackend = $httpBackend;
      httpBackend.expect('GET', '/channels?userID=abc')
        .respond(CAM_MOCKS.channels3);

      scope = $rootScope.$new();
      rootscope = $rootScope;

      createController = function(name) {
          name = name || 'mainController';
          var controller = $controller(name, {
              '$scope': scope
          });
          if(name === 'mainController'){
            httpBackend.flush();
          }
          return controller;
      };
  }));


  afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
  });

  describe('main controller', function(){
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
  })

  describe('stage controller', function(){
    beforeEach(function (){
      httpBackend.expect('POST', '/channel?userID=abc&name=karmachannel')
        .respond(CAM_MOCKS.postChannelResponse);
    });

    it("has an array of staged cards", function () {
      var controller = createController('stageController');
      expect(scope.stageCards).not.toBeUndefined();
      expect(Object.prototype.toString.call(scope.stageCards))
        .toEqual('[object Array]');
    });

    it("creates a channel when it hears createChannelClicked event", function(){
      createController('stageController');
      scope.stageCards.push({creationTitle: "karmachannel"});
      rootscope.$broadcast('createChannelClicked');
      spyOn(scope, "$on");
      expect(scope.$on).toHaveBeenCalled();
    })

  });
});