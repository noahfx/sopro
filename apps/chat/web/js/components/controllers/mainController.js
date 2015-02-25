var societyProChatControllers = angular.module('societyProChatApp.controllers',['ngMaterial'])

.controller('mainController',['$scope','$http',function($scope,$http) {
  var token = "12345";

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
  $scope.maxChannels = 2;
  $scope.currentRole = {};

  $scope.changeRole = function (role) {
      $scope.currentRole = role;

      $http({
        method: 'GET',
        url: '/channels',
        headers: {
         'token-auth': token
        },
        params : {
          userID: role.id
        }
      })
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          //console.log(data);
          $scope.channels = data.channels;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
        });

        $scope.showRoles = false;
  };


  $scope.changeRole($scope.roles[0]);
}]);