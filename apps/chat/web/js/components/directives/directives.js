var societyProChatDirectives = 
angular.module('societyProChatApp.directives',[
  'societyProChatApp.global'
])
.directive('collection', function() {
  return {
    transclude: true,
    restrict: 'E',
    scope: {
      title: '@channelTitle',
      icon: '@',
      repeater: '=',
    },
    controller: function ($rootScope, $scope, maxChannels) {
      $scope.maxChannels = maxChannels;
      $scope.showOverflow = false;

      $scope.createChannel = function () {
        console.log("broadcasting creation")
        $rootScope.$broadcast("createChannelClicked");
      };

      $scope.openOverflow = function () {
        $scope.showOverflow = !$scope.showOverflow;
        $rootScope.$broadcast("openOverflow",$scope.title);
      };

      $scope.$on("openOverflow", function ($event, title) {
        if (title !== $scope.title){
          $scope.showOverflow = false;
        }
      });
    },
    templateUrl: 'web/partials/collection.html'
  };
});