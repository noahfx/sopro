'use strict';

it('found the mocks', function(){
  expect(CAM_MOCKS.validToken).toEqual('12345');
})

describe("societyProChat Controllers", function() {
  var scope, rootscope, createController, httpBackend;

  beforeEach(module("societyProChatApp"));

  beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
      httpBackend = $httpBackend;
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



  describe('main controller', function(){
    beforeEach(function(){
      httpBackend.expect('GET', '/api/channels?role=abc')
      .respond(CAM_MOCKS.getChannelsResponse1);
    })
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
  })

  describe('stage controller', function(){
    beforeEach(function (){
    });
    afterEach(function(){
    })

    it("has an array of staged cards", function () {
      var controller = createController('stageController');
      expect(scope.stageCards).not.toBeUndefined();
      expect(Object.prototype.toString.call(scope.stageCards))
        .toEqual('[object Array]');
    });

    xit("creates a channel creation card when it hears createChannelClicked event", function(done){
      //httpBackend.expect('POST', '/api/channel?role=abc&name=karmachannel')
        //.respond(CAM_MOCKS.postChannelResponse);
      var controller = createController('stageController');
      //scope.stageCards.push({creationTitle: "karmachannel"});


      spyOn(scope, 'handleCreateChannelClicked');
      rootscope.$broadcast('createChannelClicked');
      setTimeout(function(){
        expect(scope.handleCreateChannelClicked).toHaveBeenCalled();
        //httpBackend.verifyNoOutstandingExpectation();
        //httpBackend.verifyNoOutstandingRequest();
        done();
      }, 3000)
    })

    it("creates a channel when Create is clicked", function(){
      // Configure the stage in preparation to click Create:
      httpBackend.expect('POST', '/api/channel?name=karmachannel&role=abc')
        .respond(CAM_MOCKS.postChannelResponse);
      var controller = createController('stageController');
      scope.channels =[];
      scope.currentRole = {
        id: CAM_MOCKS.roleId1,
      };
      scope.stageCards.push({creationTitle: "karmachannel"});

      // Click the Create button on the first card:
      scope.createClicked(0);
      httpBackend.flush();

      // See if the first card is now a channel history card:
      expect(scope.stageCards[0]).toEqual(
        jasmine.objectContaining({
          type: "channel",
          title: "karmachannel",
        })
      );
      expect(scope.stageCards[0]).not.toEqual(
        jasmine.objectContaining({
          creationCard: true,
        })
      );

      expect(scope.channels[0]).toEqual(
        jasmine.objectContaining(CAM_MOCKS.postChannelResponse.channel)
      );      

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();

    })

  });
});