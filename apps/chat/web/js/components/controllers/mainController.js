var societyProChatControllers = 
angular.module('societyProChatApp.controllers',['ngMaterial', 'societyProChatApp.controller2'])

.controller('mainController',['$scope','$http','$rootScope',function($scope,$http,$rootScope) {
  $scope.token = "12345";

  $scope.roles = [
    {
      "id": "abc",
      "name": "Calix",
      "img": "web/images/role-image.png" 
    },
    {
      "id": "xyz",
      "name": "Tomas",
      "img": "web/images/role-image.png" 
    }
  ]

  $scope.channels = [];
  $scope.peers = [];
  $scope.currentRole = {};
  $scope.showCollectionsOverflow = null;
  $scope.showSubscribersOverflow = null;

  $(document).mouseup(function (e) {
    var container = $("sopro-collection-dropdown");

    if (!container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      $rootScope.$broadcast("collections.overflow.close", e.target);
      $scope.showCollectionsOverflow = false;
      $scope.$apply();
    }

    var container = $("sopro-subscribers-dropdown");

    if (!container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
      $rootScope.$broadcast("subscribers.overflow.close", e.target);
      $scope.showSubscribersOverflow = false;
      $scope.$apply();
    } 

  });

  $scope.changeRole = function (role) {
      $scope.currentRole = role;

      $http({
        method: 'GET',
        url: '/api/channels',
        headers: {
         'token-auth': $scope.token
        },
        params : {
          role: role.id
        }
      })
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          //console.log(data);
          $scope.channels = data.channels;
          $scope.peers = data.peers;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
        });

        $scope.showRoles = false;
  };


  $scope.changeRole($scope.roles[0]);

  // Open/Close Dropdown Logic:

  $scope.$on("POO.click.collections", function ($event, data) {
    $scope.showSubscribersOverflow = false;
    $scope.showCollectionsOverflow = true;
  });

  $scope.$on("POO.click.subscribers", function ($event, data) {
    $scope.showSubscribersOverflow = true;
  });

}]);