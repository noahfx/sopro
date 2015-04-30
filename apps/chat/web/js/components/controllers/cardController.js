angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout', 'UserNames', 'BaseUrl',
  function($scope, $http, $rootScope, $timeout, UserNames, BaseUrl) {
    console.log('Loading cardController.js')
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
    console.log('jquery bindings scheduled')

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
          match: /\B:([\-+\w]*)$/,
          search: function (term, callback) {
            callback($.map(emojies, function (emoji) {
              return emoji.indexOf(term) === 0 ? emoji : null;
            }));
          },
          template: function (value) {
            return '<img src="web/bower_components/angular-emoji-filter/res/emoji/emoji_' + value + '.png"></img>' + value;
          },
          replace: function (value) {
            return ':' + value + ': ';
          },
          index: 1
        },
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
    }

    var socket = io();

    $scope.listenToMessages = function (id) {
      socket.on(id, function (data) {
        console.log(JSON.stringify(data));
        $scope.updateMessagesHistory(data);
        $scope.$apply();
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
      //TODO: verify authorid/authorId
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
      /*
      if($event.keyCode === 13){
        $scope.sendCurrentInput();
      }
      */
      if ($event.keyCode == 13 && !$event.shiftKey) {
        if($(".mentions>ul").css("display") !== "none"){
          return false;
        }

        // var $input = $($event.target);
        //var message = $input.val().trim();

        var message = $scope.currentInput.text.trim();
        console.log(message)
        //SocietyPro.sendMessage(message);
        if (message) {
          //$scope.sendMessage(message);
          /*
          safeApply($scope, function(){
            $scope.sendCurrentInput();
          })
          */

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
      $http({
        method: 'GET',
        url: BaseUrl + '/api/channel.history',
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
        url: BaseUrl + '/api/im.history',
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


    console.log($scope.card.channel);
    $rootScope.openChannel = $scope.card.channel;
  }
]);
