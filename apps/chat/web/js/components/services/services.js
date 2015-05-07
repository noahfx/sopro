var societyProChatControllers =
angular.module('societyProChatApp.services',['emoticons'])
.factory('UserService', function(){
  return $('body').data('currentuser');
})
.factory('UserNames', function(){
  var userNames = {
    byId : function (_id){
      var name = userNames.ids[_id];
      if (name === undefined){
        console.log("Unknown name for user id.");
        return "";
      }
      return name;
    },
    ids : {},
    add : function (_id, name){
      userNames.ids[_id] = name;
    }
  };
  return userNames;
})
.factory('BaseUrl', function(){
  var baseUrl = $('body').attr('data-soprobaseurl');
  if(!baseUrl) {
    return "";
  }
  // Strip trailing slash if any:
  return baseUrl.replace(/\/$/, '');
})
.factory('Socket', function ($rootScope) {
  var socket = io();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
