angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout',
  function($scope, $http, $rootScope, $timeout) {
    console.log('Card Controller Running')
    $timeout(function(){
      console.log('binding jquery')
        // BIND CARD CONTROLLER JQUERY
        // Execute once per channel history after view loads

        /* Emoticon Dropdown */
        $('.emoticon-trigger').click(function() {
            $('.dropdown-emoticon').toggle('fast');
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

      /* Textarea Send */
      console.log($('#message-input'));
      console.log($('#message-input').val());
      $('#message-input').keydown(function(event) {
        console.log(event);
        console.log($scope.currentInput);
        // TODO: Keep track of emoticon display in scope, to avoid recomputing on every single keypress
        if (event.keyCode == 13 && !event.shiftKey && $(".mentions>ul").css("display") == "none") {
          var message = $(this).val().trim();
          //SocietyPro.sendMessage(message);
          if (message) {
            console.log('Attempting to send a message');
            //$scope.sendMessage(message);
            $scope.$apply(function(){
              $scope.sendCurrentInput();
            })
          }
          $(this).autosize({append: false}).trigger('autosize.resize');
          event.preventDefault();
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
              return '<img src="avatars/avatar1.png"></img>' + value + '<span class="offline"></span>';
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

    }, 1000);
    console.log('jquery bindings scheduled')


    $scope.messages = [];
    $scope.currentInput = "abc";

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
      return $scope.messages[i].authorid != $scope.messages[i-1].authorid;
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
