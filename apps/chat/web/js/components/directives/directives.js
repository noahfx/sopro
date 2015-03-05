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
        $rootScope.$broadcast("createChannelClicked");
      };

      $scope.openOverflow = function ($event) {
        $rootScope.$broadcast("closeOverflow");
        $scope.fromElement = $event.target;
        $scope.showOverflow = true;
      };

      $scope.$on("closeOverflow", function ($event) {
        console.log("adio");
        $scope.showOverflow = false;
      });
    },
    templateUrl: 'web/partials/collection.html'
  };
}).directive('soproDropdown', function(){
  return {
    transclude: true,
    restrict: 'E',
    scope: {
      title: '@dropdownTitle',
      channelId: "@",
      fromElement: "=",
      type: "@"
    },
    controller: function ($scope) {
      $scope.repeater = [{name: "plato"}, {name:"jimmy"}];
      console.log($scope.title);
      console.log($scope.type);
      console.log($scope.fromElement);
    },
    link: function(scope, element, attrs){
      //var rect = scope.fromElement.getBoundingClientRect();
      //element[0].style.top = rect.top - 30;
      //element[0].style.left = rect.right + 50;
    },
    templateUrl: 'web/partials/dropdown.html'
  };
});