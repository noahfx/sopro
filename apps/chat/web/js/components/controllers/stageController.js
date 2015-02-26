var stageController = 
angular.module('societyProChatApp.controller2',['ngMaterial'])
.controller('stageController', ['$scope', '$http', function($scope,$http) {
  $scope.stageCards = [];
  $scope.creationTitle = "";
  $scope.card = {};

  $scope.$on("createChannelClicked", function ($event) {
    console.log('Broadcast received');
    
    // If there's an existing create channel card, toggle it off:
    var createCardsPresent =
      ($('.creation-card').length > 0)
      ? true
      : false;
    var createChannelPresent =
      ($('#card-create-channel').length > 0)
      ? true
      : false;

    if(createCardsPresent){
      if(createChannelPresent){
        // Toggle off the existing channel creation card.
        hideCreationCard();
      } else {
        // Replace the other creation card with the channel creation card.
        hideCreationCard();
        showCreateChannelCard();
      }
    } else {
      showCreateChannelCard();
    }

  });

  function hideCreationCard(){
    // Remove the first card from the stage.
    $scope.stageCards.shift();
    //$('.creation-card').remove();
  }

  function showCreateChannelCard(){
    $scope.stageCards.unshift({template:"web/partials/creation-card.html"});
  }
  function showChannelCard(data){
    $scope.stageCards.push(data);
  }

  $scope.cancelClicked = function(){
    hideCreationCard();
  }

  $scope.createClicked = function(i){
    if(i !== 0){throw new Error('Attempted to create a card from non-0 index')}
    // Add the new channel card to the stage:
    showChannelCard({template:"web/partials/channel-card.html", title: $scope.stageCards[i].creationTitle});
    $scope.creationTitle = "";
    // Remove the channel creation card to the stage:
    hideCreationCard();
  }
}]);