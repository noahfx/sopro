var soproAdminControllers = 
angular.module('societyProChatApp2', ['ngMaterial', 'societyProChatApp.services'])
.controller(
  'adminController',
  ['$scope', '$http', '$rootScope', 'UserService',
  function($scope,$http,$rootScope,UserService) {
    var tabs = [
      { title: 'Channels', partial: "web/partials/admin-channels.html"},
      { title: 'Users', partial: "web/partials/admin-users.html"},
      { title: 'Roles', partial: "web/partials/admin-roles.html"},
      { title: 'Permissions', partial: "web/partials/admin-permissions.html"},
      { title: 'Configuration', partial: "web/partials/admin-configuration.html"},
    ];
    $scope.selected = null;
    $scope.previous = null;
    $scope.currentUser = UserService;

    $scope.tabs = tabs;
    $scope.selectedIndex = 1;
    $scope.tabsStatus = function (current, old){
      console.log(current);
      $scope.previous = $scope.selected;
      $scope.selected = $scope.tabs[current];
      if ( old && (old != current)){
        console.debug('Goodbye ' + $scope.previous.title + '!');
      }
      if ( current ){
        console.debug('Hello ' + $scope.selected.title + '!');
      }
    }
    $scope.$watch('selectedIndex', $scope.tabsStatus);
  }
  ]
)
.controller(
  'adminControllerUsers',
  ['$scope','$http','$rootScope',
  function($scope,$http,$rootScope) {
    console.log('adminControllerUsers');
    $scope.usersList = [];
    $scope.getCurrentUsersList = function(callback){
      $http({
        method: 'GET',
        url: '/api/users',
        headers: {
          'token-auth': '12345'
        },
        params: {
          role: $scope.currentUser.identities[0]._id
        }
      })
      .success(function(data, status, headers, config){
        callback(null, data.users);
      })
      .error(function(data, status, headers, config){
        callback('API error', data);
      })
    };

    $scope.updateUsersList = function(){
      $scope.getCurrentUsersList(function(err, users){
        $scope.usersList = users;
      })
    };

    $scope.updateUsersList();

  }
  ]

)
