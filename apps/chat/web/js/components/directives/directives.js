function safeApply($scope, fn) {
  var phase = $scope.$root.$$phase;
  if (phase == '$apply' || phase == '$digest') {
    if (fn && typeof fn === 'function') {
      fn();
    }
  } else {
    $scope.$apply(fn);
  }
};

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
        safeApply($scope, function () {
          $rootScope.$broadcast("closeOverflow");
          $scope.fromElement = $event.target;
          $scope.showOverflow = true;
        });
      };

      $scope.openSubscriberDropdown = function ($event, $index) {
        safeApply($scope, function () {
          $rootScope.$broadcast("closeSubscriberDropdown");
          $scope.fromElement = $event.target;
          $scope.subscriberDropdownIndex = $index;
        });
      };

      $scope.$on("closeOverflow", function ($event, target) {
        safeApply($scope, function () {
          $scope.showOverflow = false;
        });
      });

      $scope.$on("closeSubscriberDropdown", function ($event, target) {
        safeApply($scope, function () {
          $scope.subscriberDropdownIndex = -1;
        });
      });


    },
    templateUrl: 'web/partials/collection.html'
  };
})
.directive('soproCollectionDropdown', function(){
  return {
    restrict: 'E',
    scope: {
      title: '@dropdownTitle',
      fromElement:'=',
      collectionRepeater:'='
    },
    controller: function ($rootScope, $scope) {
      console.log($scope.fromElement);
      console.log($scope.repeater);
    },
    link: function(scope, element, attrs){
      //var rect = scope.fromElement.getBoundingClientRect();
      //element[0].style.top = rect.top - 30;
      //element[0].style.left = rect.right + 50;
    },
    templateUrl: 'web/partials/dropdown.html'
  };
})
.directive('soproSubscribersDropdown', function(){
  return {
    restrict: 'E',
    scope: {
      title: '@dropdownTitle',
      fromElement:'='
    },
    controller: function ($rootScope, $scope) {
    },
    link: function(scope, element, attrs){
      //var rect = scope.fromElement.getBoundingClientRect();
      //element[0].style.top = rect.top - 30;
      //element[0].style.left = rect.right + 50;
    },
    templateUrl: 'web/partials/dropdown.html'
  };
});