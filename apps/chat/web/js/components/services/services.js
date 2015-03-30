var societyProChatControllers = 
angular.module('societyProChatApp.services',[])
.factory('UserService', function(){
  return $('#role-selection').data('currentuser');
})