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

      $scope.openCollectionsDropdown = function ($event) {
        safeApply($scope, function () {
          $rootScope.$broadcast("POO.click.collection", {
            fromElement: $event.target,
            title: $scope.title,
            repeater: $scope.repeater,
          });
          //$scope.fromElement = $event.target;
          //$scope.showOverflow = true;
        });
      };

/*
      $scope.openSubscriberDropdown = function ($event, $index) {
        safeApply($scope, function () {
          $rootScope.$broadcast("closeSubscriberDropdown");
          $scope.fromElement = $event.target;
          $scope.subscriberDropdownIndex = $index;
        });
      };
*/

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
    transclude: true,
    controller: function ($rootScope, $scope) {

      $scope.openSubscribersOverflow = function ($event) {
        safeApply($scope, function () {
          $rootScope.$broadcast("POO.click.subscribers", {
            fromElement: $event.target,
            title: $scope.title,
            repeater: $scope.collectionRepeater,
          });
          //$scope.fromElement = $event.target;
          //$scope.showOverflow = true;
        });
      };

      $scope.$on("POO.click.collection", function ($event, data) {
        safeApply($scope, function () {
          //$scope.subscriberDropdownIndex = -1;
          // Show dropdown
          $scope.repeater = data.repeater;
          $scope.dropdownTitle = data.title;
          $scope.fromElement = data.fromElement;
        });
      });

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
    transclude: true,
    scope: {
      title: '@dropdownTitle',
      fromElement:'='
    },
    controller: function ($rootScope, $scope) {

      $scope.$on('collection.overflow.close', function(){
        $rootScope.$broadcast('subscribers.overflow.close')
      })
    },
    link: function(scope, element, attrs){
      //var rect = scope.fromElement.getBoundingClientRect();
      //element[0].style.top = rect.top - 30;
      //element[0].style.left = rect.right + 50;
    },
    templateUrl: 'web/partials/dropdown.html'
  };
});