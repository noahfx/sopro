var soproAdminControllers = 
angular.module('societyProChatApp2', ['ngMaterial'])
.controller(
  'adminController',
  ['$scope','$http','$rootScope','$window',
  function($scope,$http,$rootScope,$window) {
    console.log('adminController');
    var tabs = [
      { title: 'Channels', partial: "web/partials/admin-channels.html"},
      { title: 'Users', partial: "web/partials/admin-users.html"},
      { title: 'Roles', partial: "web/partials/admin-users.html"},
      { title: 'Permissions', partial: "web/partials/admin-users.html"},
      { title: 'Configuration', partial: "web/partials/admin-users.html"},
    ];
    var selected = null;
    var previous = null;
    $scope.tabs = tabs;
    $scope.selectedIndex = 1;
    $scope.$watch('selectedIndex', function(current, old){
      console.log(current);
      previous = selected;
      selected = tabs[current];
      if ( old && (old != current)){
        console.debug('Goodbye ' + previous.title + '!');
      }
      if ( current ){
        console.debug('Hello ' + selected.title + '!');
      }
    });
  }
  ]
)
.controller(
  'adminControllerUsers',
  ['$scope','$http','$rootScope','$window',
  function($scope,$http,$rootScope,$window) {
    console.log('adminControllerUsers');
    $scope.usersList = [];
    $scope.getCurrentUsersList = function(callback){
      callback(null, [{
          username: 'louise',
          realname: 'Louisiana',
          email: 'louise@centralservices.io',
        }, {
          username: 'thomas',
          realname: 'Thomas T',
          email: 'thomas@centralservices.io',
        }
      ])
    };

    $scope.updateUsersList = function(){
      $scope.getCurrentUsersList(function(err, users){
        console.log('Setting users to ', users)
        $scope.usersList = users;
      })
    };

    $scope.updateUsersList();

  }
  ]

)

