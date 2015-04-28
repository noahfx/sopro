angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout', 'UserNames',
  function($scope, $http, $rootScope, $timeout, UserNames) {
    $scope.messages = [];
    $scope.currentInput = "";
    $scope.cardTitle = "";
    $scope.cardType = "";

    $http({
      method: 'GET',
      url: '/api/channel.info',
      headers: {
       'token-auth': $rootScope.token
      },
      params : {
        channel: $scope.card.channel._id
      }
    })
    .success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      if (data.ok) {
        data.channel.members.forEach(function(member){
          UserNames.add(member._id, member.name);
        });
      } else {
        throw new Error(data.error);
      }
    })
    .error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log(data);
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
      messageObj.authorName = UserNames.byId(messageObj.authorId);
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
      // Common options:
      var opts = {
        method: 'POST',
        url: '/api/postMessage',
        headers: {
          'token-auth': $rootScope.token
        },
      };

      // Different body:
      if($scope.cardType === 'dm'){
        opts.data = {
          channel: '@'+$scope.card.peer._id,
          text: $scope.currentInput
        }
      } else if($scope.cardType === 'chat'){
        opts.data = {
          channel: $scope.card.channel._id,
          text: $scope.currentInput
        }
      };

      console.log('Sending', opts);

      $http(opts)
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
    
    function loadChannelHistory(){
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

        $scope.messages = data.messages.map(function(message){
          message.authorName = UserNames.byId(message.authorId);
          return message;
        });
      })
      .error(function(data, status, headers, config) {
        console.log(status, data);
      });
    }

    function loadImHistory(){
      $http({
        method: 'GET',
        url: '/api/im.history',
        headers: {
         'token-auth': $rootScope.token
        },
        params : {
          receiverId : $scope.card.peer._id
        }
      })
      .success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        //console.log(data);
        if (!data.ok){
          return console.log(data);
        }
        $scope.messages = data.messages.map(function(message){
          message.authorName = UserNames.byId(message.authorId);
          return message;
        });
      })
      .error(function(data, status, headers, config) {
        console.log(status, data);
      });
    }

    if($scope.card.channel && !$scope.card.peer){
      $scope.cardType = 'chat';
      $scope.cardTitle = $scope.card.channel.name;
      loadChannelHistory();
    } else if(!$scope.card.channel && $scope.card.peer){
      $scope.cardType = 'dm';
      $scope.cardTitle = $scope.card.peer.name;
      loadImHistory()
    } else {
      throw new Error('No channel or peer to display on this card')
    }
  }
]);
