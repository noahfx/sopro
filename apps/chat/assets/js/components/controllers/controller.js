'use strict';
  
angular.module('societyProChatApp.controllers', [])

.controller('appController',['$scope','$http',function($scope, $http) {
  $scope.channels = [];

  $http({
    method: 'GET',
    url: '/channel',
    headers: {
      'auth-token': "12345"
    }
  })
  .success(function(data, status, headers, config) {
    console.log(data);
    $scope.channels = data;
  })
  .error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log("error");
  });
}]);
