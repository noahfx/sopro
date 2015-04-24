var stageController =
angular.module('societyProChatApp.controller2',
  ['ngMaterial']
)
.controller('stageController', 
['$scope', '$http', '$rootScope', '$timeout',
  function($scope,$http,$rootScope, $timeout) {
  $scope.stageCards = [];
  $scope.tmpStageCards = [];
  $scope.lastExpanded = -1;
  $scope.creationTitle = "";
  $scope.card = {};
  $scope.creationCard = {
    show: false,
    template:"web/partials/creation-card.html", 
    size:33,
    creationTitle: "",
    creationDesc: "",
  };
  $scope.expandedCard = {};

  $scope.handleCreateChannelClicked = function($event) {
    // If there are no cards, add a create channel card:
    if($scope.stageCards.length === 0){
      return showCreateChannelCard();
    }

    // Test what the first card is:
    var createCardsPresent = $scope.stageCards[0].creationCard;
    var createChannelPresent =
      ($scope.stageCards[0].type == "channel")
      ? true
      : false;

    // If there's an existing create channel card, toggle it off and on again:
    if(createCardsPresent){
      $scope.hideCreationCard();
    }  
    showCreateChannelCard();

  };
  $scope.$on("createChannelClicked", $scope.handleCreateChannelClicked);

  $scope.handleChannelHistoryClicked = function($event, data) {
    // If there are no cards, add a create channel card:
    var card = {
      type:"channel", 
      template:"web/partials/channel-card.html", 
      channel: data.channel,
      size: 100,
      show: true
    }

    /*if($scope.stageCards.length === 0){
      showChannelCard(card);
      return $scope.expandCard(0);
    }*/

    showChannelCard(card);
  }

  $scope.$on("openChannelHistoryClicked", $scope.handleChannelHistoryClicked);

  //$scope.$watch('stageCards', function () { $scope.expandedCard = $scope.stageCards[0]; });

  $scope.hideCreationCard = function (){
    $scope.creationCard.creationTitle = "";
    $scope.creationCard.creationDesc = "";
    $scope.creationCard.show = false;
    if ($scope.stageCards.length !== 0) {
      $scope.stageCards[0].size = 100;
    }
  }

  function showCreateChannelCard(){
    $scope.creationCard.show = true;
    if ($scope.stageCards.length !== 0) {
      $scope.stageCards[0].size = 66;
    }
  }

  function showChannelCard(data){
    if ($scope.creationCard.show) {
      data.size = 66;
    }

    if ($scope.stageCards.length == 0) {
      return $scope.stageCards.push(data);
    }

    $scope.indexToShow = -1;
    // Look through the existing cards for an already present card:
    var result = $.grep($scope.stageCards, function(card, index){
      if (card.channel.name == data.channel.name) {
        $scope.safeApply( function () {
          $scope.indexToShow = index;
        });
      }

      return card.channel.name == data.channel.name;
    });

    if ($scope.indexToShow !== -1) {
      var cardRemovedTmp = $scope.stageCards.splice($scope.indexToShow,1);
      $scope.stageCards.unshift(cardRemovedTmp[0]);
      return;
    }

    $scope.stageCards.unshift(data);
  }

  $scope.expandCard = function (index) {
    angular.copy($scope.stageCards, $scope.tmpStageCards);
    var extendedCard = {};
    angular.copy($scope.tmpStageCards[index], extendedCard)
    $scope.stageCards = [extendedCard];
    //console.log($scope.stageCards)
    $scope.stageCards[0].size = 100;
    $timeout(function() {
      $(".sopro-card").css("max-height","none");
    }, 100);
  }

  $scope.minimizeCard = function () {
    angular.copy($scope.tmpStageCards, $scope.stageCards);
  }

  $scope.cancelClicked = function(index){
    $scope.stageCards.shift();
  }

  $scope.createClicked = function(){
    $http({
      method: 'POST',
      url: '/api/channel',
      headers: {
       'token-auth': $rootScope.token
      },
      params : {
        name: $scope.creationCard.creationTitle,
        purpose: $scope.creationCard.creationDesc
      }
    })
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        if (data.ok) {
          // Add the new channel card to the stage:
          $scope.hideCreationCard();
          showChannelCard({
            type:"channel",
            template:"web/partials/channel-card.html",
            channel: data.channel,
            size: 100
          });
          // Remove the channel creation card from the stage:
          $scope.$parent.channels.push(data.channel);
          $scope.$parent.myChannels.push(data.channel);
        } else {
          throw new Error(data.error);
        }
      })
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  };

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };  
}]);