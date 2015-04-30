var societyProChatControllers =
angular.module('societyProChatApp.controllers', [
  'ngMaterial',
  'ngAnimate',
  'societyProChatApp.controller2',
  'societyProChatApp.cardController',
  'emoji',
])
.controller('mainController',
['$scope', '$http', '$rootScope', '$window', 'UserService', 'BaseUrl',
function($scope, $http, $rootScope, $window, UserService, BaseUrl) {
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

  // MAIN CONTROLLER JQUERY --------------------------------------------------------------
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
  
  $('html').click(function() {
    $('.dropdown-options, .dropdown-emoticon, .sopro-company-panel, .sopro-user-panel, .sopro-role-panel').hide()
    $rootScope.$apply(function () {
      $rootScope.$broadcast('hide.dropdowns');
    })
  });

  $('#trigger-arrow, .trigger-arrow-gray, #trigger-avatar').click(function(event) {
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


  $scope.channels = [];
  $scope.myChannels = [];
  $scope.peers = [];
  $rootScope.currentRole = {};
  $scope.showCollectionsOverflow = null;
  $scope.showSubscribersOverflow = null;

  $(document).mousedown(function (e) {

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

  $scope.$on("openChannelHistoryClicked", function () {
    $scope.showCollectionsOverflow = false;
    $scope.showSubscribersOverflow = false;
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
    console.log('changing role to', role);
    $rootScope.currentRole = role;

    $http({
      method: 'GET',
      url: BaseUrl + '/api/channels',
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
      console.log('role change success');
      $scope.channels = data.channels;
      $scope.myChannels = $scope.getMyChannels($scope.channels);
      $scope.peers = data.peers;
      if ($scope.myChannels.length !== 0){
        $rootScope.$broadcast('openChannelHistoryClicked',{channel: $scope.myChannels[0]}); 
      }
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

  $scope.$on("POO.click.subscribers.show", function ($event, data) {
    $scope.showSubscribersOverflow = true;
  });

}])
.controller("emoticonsCtrl",['$rootScope', '$scope', 'emoticons', function ($rootScope, $scope, emoticons) {
    $scope.emoticonTab = 0;
    $scope.currentEmoticon = "grinning";
    $scope.arrayEmoticons1 = emoticons.arrayEmoticons1;
    $scope.arrayEmoticons2 = emoticons.arrayEmoticons2;
    $scope.arrayEmoticons3 = emoticons.arrayEmoticons3;
    $scope.arrayEmoticons4 = emoticons.arrayEmoticons4;
    $scope.arrayEmoticons5 = emoticons.arrayEmoticons5;
    $scope.arrayEmoticons6 = emoticons.arrayEmoticons6;

    $scope.change = function (i) {
      /*
        var edit = document.getElementById('message-input');
        edit.focus();
        edit.value =edit.value + ":" + i + ": ";
      */
      var smileyString = ":" + i + ": ";
      $rootScope.$broadcast('append-smiley', smileyString);
      console.log('Event emitted');
    };

    $scope.hover = function (i) {
      $scope.currentEmoticon = i;
    };
    
    $scope.changeTab = function (i) {
      $scope.emoticonTab = i; 
      setTimeout(function () {
        positionEmoticonScrollbar();
      }, 400);
    }

    var positionEmoticonScrollbar = function () {
      var $cp = $('.dropdown-emoticon .tab');
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
      positionEmoticonScrollbar();
    }, 1000);

    $rootScope.openChannel = $scope.openChannel;

}]);

