var societyProChatDirectives = angular.module('societyProChatApp.directives',[])

.directive('collection', function() {
  return {
    restrict: 'E',
    scope: {
      title: '@',
      icon: '@',
      repeater: '=',
    },
    templateUrl: 'web/partials/collection.html'
  };
});