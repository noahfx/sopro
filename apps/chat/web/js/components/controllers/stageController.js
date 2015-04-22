var stageController =
angular.module('societyProChatApp.controller2',
  ['ngMaterial']
)
.controller('stageController', 
['$scope', '$http', '$rootScope', '$timeout',
  function($scope,$http,$rootScope, $timeout) {
  $scope.stageCards = [];
  $scope.tmpStageCards = [];
  $scope.lastExpanded;
  $scope.creationTitle = "";
  $scope.card = {};

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
      hideCreationCard();
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
      size: 50
    }

    if($scope.stageCards.length === 0){
      showChannelCard(card);
      return $scope.expandCard(0);
    }
    showChannelCard(card);
  }
  $scope.$on("openChannelHistoryClicked", $scope.handleChannelHistoryClicked);

  function hideCreationCard(){
    // Remove the first card from the stage.
    $scope.stageCards.shift();
    if ($scope.stageCards.length === 1) {
      $scope.expandCard(0);    
    }
  }

  function showCreateChannelCard(){
    $scope.stageCards.unshift(
      {creationCard:true, type:"channel", template:"web/partials/creation-card.html", size:50}
    );
  }

  function showChannelCard(data){
    // Look through the existing cards for an already present card:
    var result = $.grep($scope.stageCards, function(card){
      if(card.creationCard){
        return false;
      }
      return card.channel.name == data.channel.name;
    });
    if (result.length !== 0) {
      return;
    }
    // Test what the first card is:
    if ($scope.stageCards[0]) {
      var createCardsPresent = $scope.stageCards[0].creationCard;

      if(!createCardsPresent){
        if ($scope.stageCards[0].size === 100) {
          $scope.minimizeCard();
        }
      }
    }

    if ($scope.stageCards[0] && $scope.stageCards[0].creationCard) {
      $scope.stageCards.splice(1,0,data);
    } else {
      $scope.stageCards.unshift(data); 
    }
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
    $scope.stageCards.splice(index,1);
    if ($scope.stageCards.length === 1 && !$scope.stageCards[0].creationCard) {
      $scope.expandCard(0);    
    }
  }

  $scope.createClicked = function(i){
    if(i !== 0){throw new Error('Attempted to create a card from non-0 index');};
    if(!$scope.stageCards[i].creationTitle) {
      throw new Error('Missing title of channel');
      return;
    };
    $http({
      method: 'POST',
      url: '/api/channel',
      headers: {
       'token-auth': $rootScope.token
      },
      params : {
        role: $rootScope.currentRole.identityid,
        name: $scope.stageCards[i].creationTitle,
        purpose: $scope.stageCards[i].creationDesc
      }
    })
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        if (data.ok) {
          // Add the new channel card to the stage:
          var creationTitle = $scope.stageCards[i].creationTitle;
          var creationDesc = $scope.stageCards[i].creationDesc;
          hideCreationCard();
          showChannelCard({
            type:"channel", 
            template:"web/partials/channel-card.html", 
            channel: data.channel,
            size: 50
          });
          // Remove the channel creation card to the stage:
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
}]);