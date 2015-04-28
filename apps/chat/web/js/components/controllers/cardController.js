angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout',
  function($scope, $http, $rootScope, $timeout) {
    $scope.messages = [];
    $scope.currentInput = "";

    var socket = io();

    socket.on( $scope.card.channel._id, function (data) {
      console.log(JSON.stringify(data));
      $scope.updateMessagesHistory(data);
      $scope.$apply();
    });


    $scope.sortByTs = function (message){
      var result = +message.ts;
      if (isNaN(result)){
        throw new Error("Message timestamp can not be converted to number");
      }
      return +message.ts;
    };

    $scope.updateMessagesHistory = function (messageObj){
      //TODO: Improve search of existing message when we have sort server side
      messageLen = $scope.messages.length;
      for (var i = messageLen - 1; i >= 0; i--){
        if (messageObj._id === $scope.messages[i]._id){
          return console.log("HistoryController:updateMessageHistory: Message already exists");
        }
      }
      $scope.messages.push(messageObj);
      return console.log("HistoryController:updateMessageHistory: Message Updated");
    };

    $scope.handleCardInputKeypress = function($event){
      if($event.keyCode === 13){
        $scope.sendCurrentInput();
      }
    }
    $scope.sendCurrentInput = function (){
      console.log('Sending', $scope.currentInput)
      $http({
        method: 'POST',
        url: '/api/postMessage',
        headers: {
          'token-auth': $rootScope.token
        },
        data: {
          channel: $scope.card.channel._id,
          text: $scope.currentInput
        }
      })
      .success(function(data, status, headers, config){
        if (!data.ok){
          return console.log(data)
        }
        $scope.currentInput = "";
        $scope.updateMessagesHistory(data.message);
      })
      .error(function(data, status, headers, config){
        console.log(status, data);
      });
    };

    $http({
      method: 'GET',
      url: '/api/channel.history',
      headers: {
       'token-auth': $rootScope.token
      },
      params : {
      channel : $scope.card.channel._id
      }
    })
    .success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      //console.log(data);
      if (!data.ok){
        return console.log(data);
      }
      $scope.messages = data.messages;
    })
    .error(function(data, status, headers, config) {
      console.log(status, data);
    });
  }
]);
