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

function onSubscriberPOOClick ($rootScope, $event, item, title) {
  console.log('Subscriber dropdown POO clicked')
  if(title === "CHANNELS"){
    $rootScope.$broadcast("POO.click.subscribers", {
      // todo: rename to "open the channel subscribers" or simmilar
      fromElement: $event.target,
      title: item.name,
      id: item.id,
    });
  }
};

function positionDropdown(dataCount, fromElement){
  // Calculate and return the position for this element.
  var positions = {
    arrow: {},
    dropdown: {},
    keylines: {
      a0: null,
      a1: null,
      a2: null,
      edge: null,
    }
  }
  var $from = $(fromElement);
  //var $to = $($element);
  var dropdownItemsHeight = 30 * dataCount;
  var dropdownHeight = 20 + 30 + dropdownItemsHeight + 20;

  var $cp = $('#sopro-collections-wrap');
  //var $arrow = $to.find($('.sopro-arrow-overflow-dropdown'));

  //console.log('Positioning something with height', $to.innerHeight());


  var a0 = $cp.offset().top + 20;
  var a1 = $from.offset().top;
  // var a2 = a0 + $cp.height() - 40;
  var a2 = a0 + $cp.height();

  var pooYmid =
    $from.offset().top
 + ($from.outerHeight()/2);

  // Middle of arrow should align with middle of POO. Arrow is 10px * 18px
  var arrowTop = pooYmid - 9;
  var pooRight = $from.offset().left + $from.outerWidth();

  positions.keylines.a0 = a0;
  positions.keylines.a1 = a1;
  positions.keylines.a2 = a2;
  positions.keylines.edge = pooRight;
  positions.arrow.top = arrowTop;
  positions.arrow.left = pooRight - 9;
  positions.dropdown.left = pooRight;

  var scenario = null;
  if(dropdownHeight <= (a2-a1)){
    // Scenario: Dropdown is short and in the middle of the screen
    positions.dropdown.top = a1+'px';
    positions.dropdown.height = dropdownHeight+'px';
    positions.dropdown['overflow-y'] = 'hidden';
  }

  if(dropdownHeight > (a2-a1)
    && dropdownHeight <= (a2-a0)
  ){
    // Scenario: Dropdown exceeds distance from POO to bottom
    positions.dropdown.top = (a2-dropdownHeight)+'px';
    positions.dropdown.height = dropdownHeight+'px';
    positions.dropdown['overflow-y'] = 'hidden';
  }

  if(dropdownHeight > (a2 - a0)){
    // Scenario: Dropdown exceeds maximum distance from top to bottom
    positions.dropdown.top = a0+'px';
    positions.dropdown.height = (a2-a0)+'px';
    positions.dropdown['overflow-y'] = 'scroll';

  }
  return positions;
}

function drawDropdown($animate, $element, positions, zIndex){
  $element
  .css(positions.dropdown);

  $element.find('.sopro-arrow-overflow-dropdown')
  .css(positions.arrow);

  if(zIndex){
    $element.addClass('md-whiteframe-z'+zIndex);
  }

  $animate.animate($element, {
    top: positions.keylines.a1,
    height: "0px",
  }, {
    top: positions.dropdown.top,
    height: positions.dropdown.height,
  });
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

      $scope.openSubscribersOverflow = function($event, item, title){
        // This is getting triggered from multiple collections. 
        // Check whether it's a channel overflow or peers:
        onSubscriberPOOClick($rootScope, $event, item, title);
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
    controller: function ($rootScope, $scope, $element, $animate, $window) {

      $scope.openSubscribersOverflow = function(e, item, title){
        onSubscriberPOOClick($rootScope, e, item, title);
      }
/*
      $scope.$on('dropdownReadyToRender', function(){
        setTimeout(function(){
          positionDropdown($element, $scope.fromElement);
        }, 100)
        console.log('rendering collection dropdown')

      })
*/
      
      var win = angular.element($window);
      win.bind("resize",function(e){
        var positions = positionDropdown($scope.repeater.length, $scope.fromElement);
        drawDropdown($animate, $element, positions, 2);
      });


      $scope.$on("POO.click.collections", function ($event, data) {
        $scope.repeater = data.repeater;
        $scope.dropdownTitle = data.title;
        $scope.fromElement = data.fromElement;
        var positions = positionDropdown(data.repeater.length, $scope.fromElement);
        drawDropdown($animate, $element, positions, 2);
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
    controller: function ($rootScope, $scope, $element, $http, $animate, $window) {

      $scope.$on('collections.overflow.close', function(){
        console.log('Subscribers dropdown closing after hearing collections dropdown closing.');

        $rootScope.$broadcast('subscribers.overflow.close')
      })

      $scope.$on('dropdownReadyToRender', function(){
        var positions = positionDropdown($element, $scope.fromElement);
      })

      var win = angular.element($window);
      win.bind("resize",function(e){
        var positions = positionDropdown($scope.repeater.length, $scope.fromElement);
        drawDropdown($animate, $element, positions, 2);
      });

      $scope.$on('POO.click.subscribers', function($event, data){
        console.log(data);  
        $scope.dropdownTitle = data.title;
        $scope.fromElement = data.fromElement;
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
            if (data.ok) {
              $scope.repeater = data.channel.members;
              var positions = positionDropdown(data.channel.members.length, $scope.fromElement);
              drawDropdown($animate, $element, positions, 1);
            } else {

            }
          })
          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(data);
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
.directive('waitForRender', function(){
  return function(scope, element, attrs){
    if(scope.$last){
      console.log('Emitting dropdownReadyToRender')
      scope.$emit("dropdownReadyToRender")
    }
  }
})