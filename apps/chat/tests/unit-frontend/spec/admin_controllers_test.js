describe("Admin Controllers", function () {
  var scope, rootscope, createController, httpBackend, UserServiceMock;

  beforeEach(module("societyProChatApp2"));

  beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    //scope.currentUser = require('./couchdb/mocks/user1')
    rootscope = $rootScope;
    UserServiceMock = {
        identities: [
          {
            "_id":"xyz",
          }
        ]
      }
    createController = function(name, flush) {
        var controller = $controller(name, {
          '$scope': scope,
          'UserService': UserServiceMock,
        });
        if(flush){
          httpBackend.flush();
        }
        return controller;
    };
  }));
    
  describe("Main Admin Controller", function () {
    it("has an array of tabs", function () {
      var controller = createController('adminController');
      expect(scope.tabs.length).toEqual(5);
    });

    it("has a currentUser", function () {
      var controller = createController('adminController');
      expect(scope.currentUser.identities[0].identityid).toEqual(UserServiceMock.identities[0].identityid);
    })  

    it("has a default tab 1", function() {
      var controller = createController('adminController');
      expect(scope.selectedIndex).toEqual(1);
    })

    it("has a watcher for selectedIndex", function () {
      var controller = createController('adminController');
      expect(scope.selected).toEqual(null);
      scope.tabsStatus(0);
      expect(scope.selected.title).toEqual("Channels");
    });
  });

  describe("Admin Controller Users", function () {
    beforeEach(function(){
      httpBackend.expect('GET', '/api/users?role=xyz')
      .respond(CAM_MOCKS.getUsersResponse);
    })
    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("has an array of users", function () {
      scope.currentUser = UserServiceMock;
      var controller = createController('adminControllerUsers');
      expect(scope.usersList.length).toEqual(0);
      httpBackend.flush();
      expect(scope.usersList.length).toEqual(CAM_MOCKS.getUsersResponse.users.length);
    }); 
  });
});