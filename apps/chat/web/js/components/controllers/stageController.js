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
    $scope.stageCards.unshift({type:"creationCard", object:"channel", template:"web/partials/creation-card.html"});
  }
  function showChannelCard(data){
    $scope.stageCards.unshift(data);
  }

  $scope.cancelClicked = function(){
    hideCreationCard();
  }

  $scope.createClicked = function(i){
    if(i !== 0){throw new Error('Attempted to create a card from non-0 index');};
    if(!$scope.stageCards[i].creationTitle) {
      throw new Error('Missing title of channel');
    }
    $http({
      method: 'POST',
      url: '/channel',
      headers: {
       'token-auth': $scope.token
      },
      params : {
        userID: $scope.currentRole.id,
        name: $scope.stageCards[i].creationTitle,
        purpose: $scope.stageCards[i].creationDesc
      }
    })
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(data);
        // Add the new channel card to the stage:
        var creationTitle = $scope.stageCards[i].creationTitle;
        var creationDesc = $scope.stageCards[i].creationDesc;
        hideCreationCard();
        showChannelCard({type:"historyCard", template:"web/partials/channel-card.html", title: creationTitle, description: creationDesc});
        // Remove the channel creation card to the stage:
      })
      .error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(data);
      });
  }
}]);