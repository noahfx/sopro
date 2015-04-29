// Todo: Move the baseUrl to globals
var baseUrl = 'https://demo.captains.io';
var societyProChatControllers =
angular.module('societyProChatApp.controllers', [
  'ngMaterial',
  'ngAnimate',
  'societyProChatApp.controller2',
  'societyProChatApp.cardController',
  'emoji',
])
.controller('mainController',
['$scope', '$http', '$rootScope', '$window', 'UserService',
function($scope, $http, $rootScope, $window, UserService) {
  $scope.privateChannels = [{
    name: "chapines",
    showBallon: true
  },
  {
    name: "cs-offtopic"
  },
  {
    name: "huevon"
  },
  {
    name: "people-interns"
  },
  {
    name: "cs-offtopic"
  },
  {
    name: "huevon",
    showBallon: true
  },
  {
    name: "people-interns"
  },
  ]
  
  $scope.decks = [{
    name: "chapines"
  },
  {
    name: "cs-offtopic"
  },
  {
    name: "huevon"
  },
  {
    name: "people-interns"
  }
  ]
  
    
  $scope.favorites = [{
    name: "chapines"
  },
  {
    name: "cs-offtopic"
  },
  {
    name: "huevon"
  },
  {
    name: "people-interns"
  }
  ]

  $scope.isAvatarMessage = function (i) {
    if (i == 0) return true;
    return $scope.messageHistory.messages[i].user != $scope.messageHistory.messages[i-1].user;
  };
  
  //JQUERY --------------------------------------------------------------
  /* Emoticon Dropdown */
  $('.emoticon-trigger').click(function() {
      $('.dropdown-emoticon').toggle('fast');
  });
  
  /* Input Dropdown */
  $('.options-trigger').click(function() {
      $('.dropdown-options').toggle('fast');
  });

  /* Company Dropdown */
  $('#trigger-arrow').click(function() {
      $('.sopro-company-panel').toggle('fast');
  });
  
  /* User Dropdown */
  $('.trigger-arrow-gray').click(function() {
      $('.sopro-user-panel').toggle('fast');
  });
  
  /* Role Dropdown */
  $('#trigger-avatar').click(function() {
      $('.sopro-role-panel').toggle('fast');
  });
  
  /* Textarea Autoresize */ 
  $('#message-input').autosize({append: false, callback: function () {
      var lastMessage = $('.messages-container ng-include').last()[0];
      if (lastMessage) 
          lastMessage.scrollIntoView();
  }});

  /* Textarea Send */
  $('#message-input').keydown(function(e) {
    if (event.keyCode == 13 && !event.shiftKey && $(".mentions>ul").css("display") == "none") {
      var message = $(this).val().trim();
      //SocietyPro.sendMessage(message);
      if (message) {
        $scope.sendMessage(message);
      }
      $(this).val('');    
      $(this).autosize({append: false}).trigger('autosize.resize');
      e.preventDefault();
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
 
  $('html').click(function() {
      $('.dropdown-options, .dropdown-emoticon, .sopro-company-panel, .sopro-user-panel, .sopro-role-panel').hide()
  });

  $('.options-trigger, .emoticon-trigger, .dropdown-emoticon, #trigger-arrow, .trigger-arrow-gray, #trigger-avatar').click(function(event) {
      event.stopPropagation();
  });

  var positionCommpanelScrollbar = function () {
    var $cp = $('#sopro-collections-wrap');
    if (!$cp[0]) return;
    if ($cp[0].scrollHeight > $cp.innerHeight()) {
      $cp.perfectScrollbar();
      $cp.perfectScrollbar('update');
    } else {
      if ($cp.hasClass("ps-container")) {
        $cp.perfectScrollbar('destroy');
        $cp.removeClass("ps-container")
      }
    }
  }
  setTimeout(function () {
    positionCommpanelScrollbar();
  }, 100);
  var win = angular.element($window);
  win.bind("resize",function(e){
    positionCommpanelScrollbar();
  });
  
  $scope.messageHistory = {
    "messages": [
        {
            "text": "hello :thumbsup:",
            "ts": "1415283588154",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "the random channel :kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing::kissing: :: works",
            "ts": "1415283616231",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "the #general :wink: doesn't for me",
            "ts": "1415283624407",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "why would my text :wink: :two_men_holding_hands: not even appear in the chat log?",
            "ts": "1415283688951",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "after your chat log picture story, do you think it best to get the core functionality working in #channels and private groups?",
            "ts": "1415283739491",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "Rafa cannot use private groups",
            "ts": "1415283784047",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "in general they are too buggy to use",
            "ts": "1415283806563",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "seems we should fix the core functionality of groups and channels asap",
            "ts": "1415283820828",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "so we can all start using this",
            "ts": "1415283826273",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "ok we will reprioritize the sprint when you come in. this will be after the picture chat log story is done.",
            "ts": "1415283891809",
            "type": "message",
            "user": "jon@xmpp.cambrian.org"
        },
        {
            "text": "Hello, this message was sent from http://download.cambrian.org/tests/websocket.htm via web sockets!",
            "ts": "1417457485152",
            "type": "message",
            "user": "me"
        },
        {
            "text": "ola k ase?",
            "ts": "1417543725519",
            "type": "message",
            "user": "jimmy5750910@xmpp.cambrian.org"
        },
        {
            "text": "jaja nombre solo probando con cesar el envio de mensajes en sopro",
            "ts": "1417543853607",
            "type": "message",
            "user": "jimmy5750910@xmpp.cambrian.org"
        }
    ]
  }

 $scope.toDate = function (ts) {
        return new Date(+ts*1000);
    };

 
  $scope.currentUser = $rootScope.currentUser = UserService;   
  $scope.roles = $scope.currentUser.identities;
  $rootScope.token = $scope.currentUser.apiToken;

  /*
    {
      "id": "abc",
      "name": "Calix",
      "img": "web/images/role-image.png" 
    },
    {
      "id": "xyz",
      "name": "Tomas",
      "img": "web/images/role-image.png" 
    }
  ]
  */

  $scope.channels = [];
  $scope.myChannels = [];
  $scope.peers = [];
  $rootScope.currentRole = {};
  $scope.showCollectionsOverflow = null;
  $scope.showSubscribersOverflow = null;

  $(document).mousedown(function (e) {
    console.log('mouseup listener');

    var container1 = $("sopro-collections-dropdown");
    var container2 = $("sopro-subscribers-dropdown");

    // Determine which, if any, dropdowns to close based on a click event somewhere on the page
    var isOpen1 = $scope.showCollectionsOverflow;
    var isOpen2 = $scope.showSubscribersOverflow;

    var clicked1 = container1.is(e.target);
    var clicked1child = container1.has(e.target).length > 0;

    var clicked2 = container2.is(e.target);
    var clicked2child = container2.has(e.target).length > 0;


    // if the target of the click isn't the container1...
    // ... nor a descendant of the container1
    // and it's already open...
    if ( !clicked1
      && !clicked1child
      && isOpen1
      && !clicked2
      && !clicked2child
    ){
      $rootScope.$broadcast("collections.overflow.close", e.target);
      $scope.showCollectionsOverflow = false;
      $scope.$apply();
    }


    if (!clicked2
      && !clicked2child
      && isOpen2) 
    {
      $rootScope.$broadcast("subscribers.overflow.close", e.target);
      $scope.showSubscribersOverflow = false;
      $scope.$apply();
    } 

  });

  $scope.getMyChannels = function (channels) {
    var myChannels = [];
    for (var i = 0; i < channels.length; i++) {
      if (channels[i].is_member) {
        myChannels.push(channels[i]);
      }
    };
    return myChannels;
  }

  $scope.changeRole = function (role) {
      $rootScope.currentRole = role;

      $http({
        method: 'GET',
        url: baseUrl + '/api/channels',
        headers: {
         'token-auth': $rootScope.token
        },
        params : {
          role: role.identityid
        }
      })
        .success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          //console.log(data);
          $scope.channels = data.channels;
          $scope.myChannels = $scope.getMyChannels($scope.channels);
          $scope.peers = data.peers;
          setTimeout(function () {
            positionCommpanelScrollbar();
          }, 50);
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
        });

        $scope.showRoles = false;
  };


  $scope.changeRole($scope.roles[0]);

  // Open/Close Dropdown Logic:

  $scope.$on("POO.click.collections", function ($event, data) {
    $scope.showSubscribersOverflow = false;
    $scope.showCollectionsOverflow = true;
  });

  $scope.$on("POO.click.subscribers", function ($event, data) {
    $scope.showSubscribersOverflow = true;
  });

}])
.controller("emoticonsCtrl",['$scope', 'emoticons', function ($scope,emoticons) {
    $scope.emoticonTab = 0;
    $scope.currentEmoticon = "grinning";
    $scope.arrayEmoticons1 = emoticons.arrayEmoticons1;
    $scope.arrayEmoticons2 = emoticons.arrayEmoticons2;
    $scope.arrayEmoticons3 = emoticons.arrayEmoticons3;
    $scope.arrayEmoticons4 = emoticons.arrayEmoticons4;
    $scope.arrayEmoticons5 = emoticons.arrayEmoticons5;
    $scope.arrayEmoticons6 = emoticons.arrayEmoticons6;

    $scope.change = function (i) {
        var edit = document.getElementById('message-input');
        edit.focus();
        edit.value =edit.value + ":" + i + ": ";
    };

    $scope.hover = function (i) {
        $scope.currentEmoticon = i;
    };
    
}]);

