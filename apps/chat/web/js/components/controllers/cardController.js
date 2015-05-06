angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout', 'UserNames', 'BaseUrl', 'Socket',
  function($scope, $http, $rootScope, $timeout, UserNames, BaseUrl, Socket) {
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

    $timeout(bindJquery, 1000);

    function bindJquery(){
      console.log('binding jquery')
        // BIND CARD CONTROLLER JQUERY
        // Execute once per channel history after view loads

        /* Emoticon Dropdown */
        $('.emoticon-trigger').click(function() {
            $('.dropdown-emoticon').toggle('fast');
            $scope.$apply( function () {
              $scope.showEmoticons = true;
            });
        });

        /* Input Dropdown */
        $('.options-trigger').click(function() {
            $('.dropdown-options').toggle('fast');
        });

      /* Textarea Autoresize */
      $('#message-input').autosize({append: false, callback: function () {
          var lastMessage = $('.messages-container ng-include').last()[0];
          if (lastMessage)
              lastMessage.scrollIntoView();
          }
      });

      /* Textarea Autocomplete */
      $('textarea').textcomplete([
        {
          mentions: ['jon','jimmy','hiro','tomas','cesar','jorge','voodoo','salme','plato'],
          match: /\B@(\w*)$/,
          search: function (term, callback) {
              callback($.map(this.mentions, function (mention) {
                  return mention.indexOf(term) === 0 ? mention : null;
              }));
          },
          template: function (value) {
              return '<img src="web/avatars/avatar1.png"></img>' + value + '<span class="offline"></span>';
          },
          replace: function (mention) {
              return '@' + mention + ' ';
          },
          index: 1
        }
      ],{
          appendTo: $('.mentions')
      });


      $('.options-trigger, .emoticon-trigger, .dropdown-emoticon').click(function(event) {
          event.stopPropagation();
      });

    }

    // Set up angular scope variables and functions
    $scope.messages = [];
    $scope.currentInput = {
      text: ""
    }
    $scope.cardTitle = "";
    $scope.cardType = "";


    $scope.getChannelMemberNames = function (callback) {
      $http({
        method: 'GET',
        url: BaseUrl + '/api/channel.info',
        headers: {
         'token-auth': $rootScope.token
        },
        params : {
          channel: $scope.card.channel._id
        }
      })
      .success(function(data, status, headers, config) {
        if (data.ok) {
          data.channel.members.forEach(function(member){
            UserNames.add(member._id, member.name);
          });
        } else {
          throw new Error(data.error);
          callback(data);
        }
        callback(null);
      })
      .error(function(data, status, headers, config) {
        console.log(data);
        callback(data);
      });
    };
  
    $scope.listenToMessages = function (id) {
      Socket.on(id, function (data) {
        console.log(JSON.stringify(data));
        $scope.updateMessagesHistory(data);
      });
    }

    $scope.sortByTs = function (message){
      var result = +message.ts;
      if (isNaN(result)){
        throw new Error("Message timestamp can not be converted to number");
      }
      return +message.ts;
    };

    $scope.isAvatarMessage = function (i) {
      if (i == 0) return true;
      return $scope.messages[i].authorId != $scope.messages[i-1].authorId;
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
      if ($event.keyCode == 13 && !$event.shiftKey) {
        if($(".mentions>ul").css("display") !== "none"){
          return false;
        }

        var message = $scope.currentInput.text.trim();
        console.log(message)
        if (message) {
          safeApply($scope, $scope.sendCurrentInput)
        }
        $event.preventDefault();
      }
    }

    $scope.sendCurrentInput = function (){
      // Common options:
      var opts = {
        method: 'POST',
        url: BaseUrl + '/api/postMessage',
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
          text: $scope.currentInput.text
        }
      };

      console.log('Sending', opts);

      $http(opts)
      .success(function(data, status, headers, config){
        if (!data.ok){
          return console.log(data)
        }
        $scope.currentInput.text = "";
        $('#message-input')
          .val('')
          .autosize({append: false})
            .trigger('autosize.resize');

        $scope.updateMessagesHistory(data.message);
      })
      .error(function(data, status, headers, config){
        console.log(status, data);
      });
    };

    $scope.$on('append-smiley', function($event, smileyString){
      console.log('Event received');
      console.log(smileyString);
      $scope.currentInput.text += smileyString;
      $('#message-input').focus();
    })


    function loadChannelHistory(){
      var httpOpts = {
        url: BaseUrl + '/api/channel.history',
        params : {
          channel : $scope.card.channel._id
        }
      };
      getHistory(httpOpts);
    }
    
    function loadImHistory(){
      var httpOpts = {
        url: BaseUrl + '/api/im.history',
        params : {
          receiverId : $scope.card.peer._id
        }
      };
      getHistory(httpOpts);
    }

    function getHistory(httpOpts){
      httpOpts.method = 'GET';
      httpOpts.headers = {
        'token-auth': $rootScope.token
      };
      $http(httpOpts)
      .success(function(data, status, headers, config) {
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
      $scope.listenToMessages($scope.card.channel._id);
      $scope.cardTitle = $scope.card.channel.name;
      $scope.getChannelMemberNames(function(err){
        loadChannelHistory();
      });
    } else if(!$scope.card.channel && $scope.card.peer){
      $scope.cardType = 'dm';
      $scope.listenToMessages($scope.card.peer._id);
      $scope.cardTitle = $scope.card.peer.name;
      loadImHistory()
    } else {
      throw new Error('No channel or peer to display on this card')
    }
    $rootScope.openChannel = $scope.card.channel;
  }
]);
