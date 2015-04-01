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

function filterOnlyChannelClicks($rootScope, $event, item, title) {
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
    keylines: { // These keylines represent the possible edges of the dropdown
      a0: null, // Vertical pixels from window top to (20px below commpanel top)
      a1: null, // Vertical pixels from window top to POO top
      a2: null, // Vertical pixels from window top to (20px above commpanel bottom)
      edge: null, // Horizontal pixels from window left to POO right
    },
    short: null,  // "tall" height > max and has a scrollbar; "short" height < max and has no scrollbar
  }
  var $from = $(fromElement);
  var dropdownItemsHeight = 30 * dataCount;
  var dropdownHeight = 20 + 30 + dropdownItemsHeight + 20;

  var $cp = $('#sopro-collections-wrap');

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

  if(dropdownHeight <= (a2-a1)){
    // Scenario: Dropdown is short and in the middle of the screen
    positions.short = true;
    positions.dropdown.top = a1+'px';
    positions.dropdown.height = dropdownHeight+'px';
    positions.dropdown['overflow-y'] = 'hidden';
  }

  if(dropdownHeight > (a2-a1)
    && dropdownHeight <= (a2-a0)
  ){
    // Scenario: Dropdown is short but exceeds distance from POO to bottom
    positions.short = true;
    positions.dropdown.top = (a2-dropdownHeight)+'px';
    positions.dropdown.height = dropdownHeight+'px';
    positions.dropdown['overflow-y'] = 'hidden';
  }

  if(dropdownHeight > (a2 - a0)){
    // Scenario: Dropdown is tall: exceeds maximum distance from top to bottom
    positions.short = false;
    positions.dropdown.top = a0+'px';
    positions.dropdown.height = (a2-a0)+'px';
    positions.dropdown['overflow-y'] = 'scroll';

  }
  return positions;
}

function drawDropdown($animate, $element, positions, zIndex){
  $element
  .css(positions.dropdown);
  if ((positions.arrow.top + 18) <=
  (parseInt(positions.dropdown.top.substring(0,positions.dropdown.top.indexOf('p'))) + 
  (parseInt(positions.dropdown.height.substring(0,positions.dropdown.height.indexOf('p')))))) {
    $element.find('.sopro-arrow-overflow-dropdown')
    .css(positions.arrow);
  } else {
    $element.find('.sopro-arrow-overflow-dropdown')
    .css({top:-18});
  }
  
  $animate.animate($element, {
    top: positions.keylines.a1,
    height: "0px",
  }, {
    top: positions.dropdown.top,
    height: positions.dropdown.height,
  });
  if(positions.short && $($element).hasClass("ps-container")) {
    $($element).perfectScrollbar('destroy');
  } else {
    $($element).perfectScrollbar({
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20
    });
    $($element).perfectScrollbar('update'); 
  }
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
      userExpandable: '@userexpandable', // can the user add to the collection?
      icon: '@',
      repeater: '=',
    },
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
        filterOnlyChannelClicks($rootScope, $event, item, title);
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
        filterOnlyChannelClicks($rootScope, e, item, title);
      }

      $('sopro-collections-dropdown').perfectScrollbar();
      var win = angular.element($window);
      win.bind("resize",function(e){
        if ($scope.repeater) {
          var positions = positionDropdown($scope.repeater.length, $scope.fromElement);
          drawDropdown($animate, $element, positions, 2);
        }
      });


      $scope.$on("POO.click.collections", function ($event, data) {
        $scope.repeater = data.repeater;
        $scope.dropdownTitle = data.title;
        $scope.fromElement = data.fromElement;
        $($scope.fromElement).addClass('poo-highlight-collection');
        var positions = positionDropdown(data.repeater.length, $scope.fromElement);
        setTimeout(function () {
          drawDropdown($animate, $element, positions, 2);
        },100);
      });

      $scope.$on('collections.overflow.close', function (){
        $('.poo-highlight-collection').removeClass('poo-highlight-collection');
      });
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

      var win = angular.element($window);
      win.bind("resize",function(e){
        if ($scope.repeater) {
          var positions = positionDropdown($scope.repeater.length, $scope.fromElement);
          drawDropdown($animate, $element, positions, 2);
        }
      });

      $scope.$on('POO.click.subscribers', function($event, data){
        console.log(data);  
        $scope.dropdownTitle = data.title;
        $scope.fromElement = data.fromElement;
        $($scope.fromElement).addClass('poo-highlight-subscriber');
        $http({
          method: 'GET',
          url: '/api/channel.info',
          headers: {
           'token-auth': $rootScope.token
          },
          params : {
            role: $rootScope.currentRole.identityid,
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
          }
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
        });
      });


      $scope.$on('subscribers.overflow.close', function (){
        $('.poo-highlight-subscriber').removeClass('poo-highlight-subscriber');
      });

    },
    templateUrl: 'web/partials/dropdown.html'
  };
});