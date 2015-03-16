var societyProChatControllers = 
angular.module('societyProChatApp.controllers',['ngMaterial', 'ngAnimate', 'societyProChatApp.controller2'])

.controller('mainController',['$scope','$http','$rootScope','$window',function($scope,$http,$rootScope,$window) {
  $('#sopro-collections-wrap').perfectScrollbar();

  var win = angular.element($window);
  win.bind("resize",function(e){
    $('#sopro-collections-wrap').perfectScrollbar('update');
  });

  $rootScope.token = "12345";

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
  $rootScope.currentRole = {};
  $scope.showCollectionsOverflow = null;
  $scope.showSubscribersOverflow = null;

  $(document).mouseup(function (e) {
    console.log('mouseup listener');

    var container1 = $("sopro-collections-dropdown");
    var container2 = $("sopro-subscribers-dropdown");

    // Determine which, if any, dropdowns to close based on a click event somewhere on the page
    var isOpen1 = $scope.showCollectionsOverflow;
    var isOpen2 = $scope.showSubscribersOverflow;

    var clicked1 = container1.is(e.target);
    var clicked1child = container1.has(e.target).length > 0;

    var clicked2 = container2.is(e.target);
    var clicked2child = container2.has(e.target).length > 0;


    // if the target of the click isn't the container1...
    // ... nor a descendant of the container1
    // and it's already open...
    if ( !clicked1
      && !clicked1child
      && isOpen1
      && !clicked2
      && !clicked2child
    ){
      $rootScope.$broadcast("collections.overflow.close", e.target);
      $scope.showCollectionsOverflow = false;
      $scope.$apply();
    }


    if (!clicked2
      && !clicked2child
      && isOpen2) 
    {
      $rootScope.$broadcast("subscribers.overflow.close", e.target);
      $scope.showSubscribersOverflow = false;
      $scope.$apply();
    } 

  });

  $scope.changeRole = function (role) {
      $rootScope.currentRole = role;

      $http({
        method: 'GET',
        url: '/api/channels',
        headers: {
         'token-auth': $rootScope.token
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
          setTimeout(function () {
            $('#sopro-collections-wrap').perfectScrollbar('update')
          },300);
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