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

function onSubscriberPOOClick ($rootScope, $event, item) {
  console.log('Subscriber dropdown POO clicked')
  $rootScope.$broadcast("POO.click.subscribers", {
    fromElement: $event.target,
    title: item.name,
    id: item.id,
  });
};

function positionDropdown($element, data){
  var $from = $(data.fromElement);
  var $to = $($element)

  $to.css({
    'top': $from.offset().top,
    'left': $from.offset().left + $from.outerWidth(),
  })
}


var societyProChatDirectives =
angular.module('societyProChatApp.directives',[
  'societyProChatApp.global'
])
.directive('collection', function() {
  return {
    transclude: true,
    restrict: 'E',
    require:'^mainController',
    scope: {
      title: '@channelTitle',
      icon: '@',
      repeater: '=',
    },
    /*
    link: function(scope, element, attrs, mainController){
      //scope.openSubscriberDropdown = mainController.openSubscriberDropdown;
    },
    */
    controller: function ($rootScope, $scope, maxChannels) {
      $scope.maxChannels = maxChannels;
      $scope.showOverflow = false;

      $scope.createChannel = function () {
        $rootScope.$broadcast("createChannelClicked");
      };

      $scope.openCollectionsOverflow = function ($event) {
        $rootScope.$broadcast("POO.click.collections", {
          fromElement: $event.target,
          title: $scope.title,
          repeater: $scope.repeater,
        });
      };

      $scope.openSubscribersOverflow = function($event, item){
        console.log('collections controller and directive openSubscribersOverflow')
        onSubscriberPOOClick($rootScope, $event, item);
      }

    },
    templateUrl: 'web/partials/collection.html'
  };
})
.directive('soproCollectionsDropdown', function(){
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: function ($rootScope, $scope, $element) {

      $scope.openSubscribersOverflow = function(e, item){
        onSubscriberPOOClick($rootScope, e, item);
      }

      $scope.$on("POO.click.collections", function ($event, data) {

        safeApply($scope, function () {
          //$scope.subscriberDropdownIndex = -1;
          // Show dropdown
          $scope.repeater = data.repeater;
          $scope.dropdownTitle = data.title;
          $scope.fromElement = data.fromElement;
          positionDropdown($element, data);
        });
      });
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
    scope: {},
    controller: function ($rootScope, $scope, $element, $http) {

      $scope.$on('collections.overflow.close', function(){
        console.log('Subscribers dropdown closing after hearing collections dropdown closing.');

        $rootScope.$broadcast('subscribers.overflow.close')
      })

      $scope.$on('subscribers.overflow.open', function(){
      });


      $scope.$on('POO.click.subscribers', function($event, data){
        safeApply($scope, function () {
          $scope.dropdownTitle = data.title;
          $scope.fromElement = data.fromElement;
          positionDropdown($element, data);
          $http({
            method: 'GET',
            url: '/api/channel.info',
            headers: {
             'token-auth': $rootScope.token
            },
            params : {
              role: $rootScope.currentRole.id,
              channel: data.id
            }
          })
            .success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              console.log(data);
              $scope.repeater = data.channel.members;
            })
            .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(data);
            });
        });
      });



    },
    link: function(scope, element, attrs){
      //var rect = scope.fromElement.getBoundingClientRect();
      //element[0].style.top = rect.top - 30;
      //element[0].style.left = rect.right + 50;
    },
    /*
    */
    templateUrl: 'web/partials/dropdown.html'
  };
});