var societyProChatControllers = 
angular.module('societyProChatApp.services',['emoticons'])
.factory('UserService', function(){
  return $('body').data('currentuser');
})