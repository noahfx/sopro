var appModule = angular.module("chatlog", ['ngMaterial','ngRoute', 'ngSanitize', 'emoticons','emoji'])
.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when(
            '/messages/:peername',
            {
                templateUrl: 'partials/messageLog.html',
                controller: 'chatlogCtrl'
            })
        .otherwise(
            {
                template: '404'
            }
        );
}])
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('messagesRenderFinished');
                });
            }
        }
    }
})
.controller("chatCtrl",['$scope', '$rootScope', function ($scope, $rootScope) {
    //   DEMO PURPOSE
    $scope.tab=2;
    $scope.changeTab = function () {
        $chromeTabsExampleShell.bind('chromeTabRender', function(){
            var $currentTab = $chromeTabsExampleShell.find('.chrome-tab-current');
            if ($currentTab.length && window['console'] && console.log) {
                console.log('Current tab index', $currentTab.index(), 'title', $.trim($currentTab.text()), 'data', $currentTab.data('tabData').data);
                console.log($currentTab.data('tabData').data);
                $scope.$apply(function(){
                   if ($currentTab.text().trim() == 'Google') {
                       $rootScope.url = "www.google.com";
                       $scope.tab=2;
                   }
                   if ($currentTab.text().trim() == 'Facebook') {
                       $rootScope.url = "www.facebook.com";
                       $scope.tab=1;
                   }
                   if ($currentTab.text().trim() == 'Chatlog') {
                       $scope.tab=0;
                   }
                });
            }
        });
    }
}])
.controller("chatlogCtrl", ['$scope', '$q', '$routeParams', '$rootScope', '$location', '$timeout', '$http', function ($scope, $q, $routeParams, $rootScope, $location, $timeout, $http) {
    $scope.peername = $rootScope.peername = $routeParams.peername;
    $rootScope.url = $location.path(); //TOOLBAR URL
    $scope.messageHistory = {messages:[]};
    $scope.optionsTrigger = $rootScope.optionsTrigger = false;

    if (document.getElementById('message-input')) document.getElementById('message-input').focus();
    
    // POLL FOR NEW MESSAGES:
    /*var pollMessages = function(){
        $timeout(function(){
            console.log('Getting new messages')
            $scope.getNewMessages();
            pollMessages();
        }, 5000)
    };
    pollMessages();*/

    //JQUERY --------------------------------------------------------------
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
        $('.dropdown-options, .dropdown-emoticon').hide()
    });

    $('.options-trigger, .emoticon-trigger, .dropdown-emoticon').click(function(event) {
        event.stopPropagation();
    });
    
    $('#file').change(function(e){
        alert('JAPI CALL files.upload');
        console.log(e);
        console.log($('#file')[0]);
    })
    
    //---------------------------------------------------------------------
    
    $scope.getMessages = function (userid) {
        var deferred = $q.defer();
      //JAPI CALL /messages/@peerid
      var url = "tests/messageLogMockJimmy.json";
      $http.get(url).success(function(data) {
         deferred.resolve(data);
      });
    return deferred.promise;
    };

    $scope.getNewMessages = function () {
        var newestM = $scope.messageHistory.messages[-1];
        var newestTS;
        if(newestM === undefined){
            // Couldn't find any existing messages in history
            newestTS = "0"
        } else {
            newestTS =  newestM.ts
        }

        var deferred = $q.defer();
        var xhr = new XMLHttpRequest();
        //xhr.open("GET", "http://private-eacc0-slapichannels.apiary-mock.com/api/im.history?token=xxxx-xxxxxxxx-xxxx&channel=C1234567890&text=Hello%20World&username=My%20Bot&parse=full");
        //xhr.open("GET", "http://localhost:38000/api/im.history?channel=random&oldest="+newestTS);
        xhr.open("GET", "tests/messageLogMockCesar.json");
        xhr.onreadystatechange = function () { 
            deferred.resolve(JSON.parse(this.responseText));
        };
        xhr.send(null);
        return deferred.promise;
    };

    $scope.sendMessage = function (message) {
       //JAPI CALL: chat.postMessage
       $http.get('https://private-eacc0-slapichannels.apiary-mock.com/api/chat.postMessage?token=xxxx-xxxxxxxx-xxxx&channel=C1234567890&text=Hello%20World&username=My%20Bot&parse=full&link_names=1&attachments=%5B%7B%22pretext%22%3A%20%22pre-hello%22%2C%20%22text%22%3A%20%22text-world%22%7D%5D&unfurl_links=true&unfurl_media=false&icon_url=http%3A%2F%2Florempixel.com%2F48%2F48&icon_emoji=%3Achart_with_upwards_trend%3A')
       .success(function(data) {
         console.log("JAPI CALL: chat.postMessage");
         console.log(data);
        });
        $scope.getMessages($scope.peername).then(function(object) {
            $scope.messageHistory = object;
        });
    }

    $scope.isAvatarMessage = function (i) {
        if (i == 0) return true;
        return $scope.messageHistory.messages[i].user != $scope.messageHistory.messages[i-1].user;
    };

    $scope.toDate = function (ts) {
        return new Date(+ts*1000);
    };

    $scope.safeApply = function(fn) {
      var phase = $rootScope.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    $scope.getMessages($scope.peername).then(function(object) {
        $scope.messageHistory = object;
    });

/*
    $scope.getNewMessages($scope.peername).then(function(newMessages) {
        $scope.messageHistory.concat(newMessages);
    });
*/

    if ($scope.$on) {
        $scope.$on('messagesRenderFinished',function(){
            $('.messages-container ng-include').last()[0].scrollIntoView();
        });
    }
   
}]).controller("emoticonsCtrl",['$scope', 'emoticons', function ($scope,emoticons) {
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
        edit.value =edit.value + ":" + i + ":";
    };

    $scope.hover = function (i) {
        $scope.currentEmoticon = i;
    };
    
}]);
