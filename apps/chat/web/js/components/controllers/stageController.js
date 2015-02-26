var stageController = 
angular.module('societyProChatApp.controller2',['ngMaterial'])
.controller('stageController', ['$scope', '$http', function($scope,$http) {
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
        $('.creation-card').remove();
      } else {
        // Replace the other creation card with the channel creation card.
        $('.creation-card').remove();
        insertCardElement();
      }
    } else {
      insertCardElement();
    }

    function insertCardElement(){
      $('<md-card></md-card>')
      .attr('id', 'card-create-channel')
      .addClass('creation-card')
      .text('Create Channel:')
      .appendTo($('#main-stage'));
    }
  });
}]);