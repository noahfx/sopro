var societyProChatControllers =
angular.module('societyProChatApp.services',[])
.factory('UserService', function(){
  return $('body').data('currentuser');
})
.factory('UserNames', function(){
  var userNames = {
    byId : function (_id){
      console.log(userNames.ids);
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
});
