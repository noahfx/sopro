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
);

