var societyProChatControllers = 
angular.module('societyProChatApp.services',[])
.factory('UserService', function(){
  return $('body').data('currentuser');
})