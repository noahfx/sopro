var societyProChatDirectives = angular.module('societyProChatApp.directives',[
  'societyProChatApp.global'
  ])

.directive('collection', function() {
  return {
    restrict: 'E',
    scope: {
      title: '@',
      icon: '@',
      repeater: '=',
    },
    controller: function ($scope, maxChannels) {
      $scope.maxChannels = maxChannels;
    },
    templateUrl: 'web/partials/collection.html'
  };
});