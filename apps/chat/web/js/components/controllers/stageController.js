var stageController = 
angular.module('societyProChatApp.controller2',['ngMaterial'])
.controller('stageController', ['$scope', '$http', function($scope,$http) {
  $scope.$on("createChannelClicked", function ($event) {
    console.log('Adding card');
    $('<md-card></md-card>')
      .attr('id', 'card-create-channel')
      .text('Create Channel:')
      .appendTo($('#main-stage'));
  });
}]);