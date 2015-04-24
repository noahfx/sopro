var societyProChatControllers =
    angular.module('societyProChatApp.controllers',
  [
     'ngMaterial',
     'ngAnimate',
     'societyProChatApp.controller2',
     'societyProChatApp.cardController',
   ]
  )
.controller('mainController',
['$scope', '$http', '$rootScope', '$window', 'UserService',
  function($scope, $http, $rootScope, $window, UserService) {
  var positionCommpanelScrollbar = function () {
    var $cp = $('#sopro-collections-wrap');
    if (!$cp[0]) return;
    if ($cp[0].scrollHeight > $cp.innerHeight()) {
      $cp.perfectScrollbar();
      $cp.perfectScrollbar('update');
    } else {
      if ($cp.hasClass("ps-container")) {
        $cp.perfectScrollbar('destroy');
        $cp.removeClass("ps-container")
      }
    }
  }
  setTimeout(function () {
    positionCommpanelScrollbar();
  }, 100);
  var win = angular.element($window);
  win.bind("resize",function(e){
    positionCommpanelScrollbar();
  });

  $scope.currentUser = $rootScope.currentUser = UserService;   
  $scope.roles = $scope.currentUser.identities;
  $rootScope.token = $scope.currentUser.apiToken;

  /*
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
  */

  $scope.channels = [];
  $scope.myChannels = [];
  $scope.peers = [];
  $rootScope.currentRole = {};
  $scope.showCollectionsOverflow = null;
  $scope.showSubscribersOverflow = null;

  $(document).mousedown(function (e) {
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

  $scope.getMyChannels = function (channels) {
    var myChannels = [];
    for (var i = 0; i < channels.length; i++) {
      if (channels[i].is_member) {
        myChannels.push(channels[i]);
      }
    };
    return myChannels;
  }

  $scope.changeRole = function (role) {
      $rootScope.currentRole = role;

      $http({
        method: 'GET',
        url: '/api/channels',
        headers: {
         'token-auth': $rootScope.token
        },
        params : {
          role: role.identityid
        }
      })
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          //console.log(data);
          $scope.channels = data.channels;
          $scope.myChannels = $scope.getMyChannels($scope.channels);
          $scope.peers = data.peers;
          if ($scope.myChannels.length !== 0){
            $rootScope.$broadcast('openChannelHistoryClicked',{channel: $scope.myChannels[0]}); 
          }
          setTimeout(function () {
            positionCommpanelScrollbar();
          }, 50);
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
