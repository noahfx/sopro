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
        console.log('overflow clicked in collection pane')
        var o = $rootScope.dropdowns.overflow;
        o.shown = true;
        o.fromElement = $event.target;
        o.title = $scope.title;
        o.data = $scope.repeater;
        $rootScope.$broadcast("openOverflow");
        /*
        safeApply($scope, function () {
          console.log($scope.showOverflow)
          if ($scope.showOverflow) {
            $scope.showOverflow = false
          } else {
            $rootScope.$broadcast("closeOverflow", $scope.title);
            $scope.fromElement = $event.target;
            $scope.showOverflow = true;
          }
          console.log($scope.showOverflow)
        });
        */
      };

      $scope.$on("closeOverflow", function ($event, title) {
        safeApply($scope, function () {
          $scope.showOverflow = false;
        });
      });


    },
    templateUrl: 'web/partials/collection.html'
  };
})
.directive('soproDropdown', function(){
  return {
    transclude: true,
    restrict: 'E',
    scope: {
      title: '@dropdownTitle',
      type: "@"
    },
    controller: function ($rootScope, $scope) {
      /*
      console.log($scope.title);
      console.log($scope.type);
      console.log($scope.fromElement);
      */
      $scope.$on("openOverflow", function(){
        console.log('Local dropdown scope received openOverflow event');
        var meta = $rootScope.dropdowns[$scope.type];
        console.log(meta.shown);
        $scope.repeater = meta.data;
        //[{name: "plato"}, {name:"jimmy"}];
        $scope.showOverflow = meta.shown;
      });

    },
    link: function(scope, element, attrs){
      //var rect = scope.fromElement.getBoundingClientRect();
      //element[0].style.top = rect.top - 30;
      //element[0].style.left = rect.right + 50;
    },
    templateUrl: 'web/partials/dropdown.html'
  };
});