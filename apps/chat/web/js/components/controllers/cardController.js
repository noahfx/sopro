angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout',
  function($scope, $http, $rootScope, $timeout) {
    $scope.messages = [];
    $scope.sortByTs = function (message){
      var result = +message.ts;
      if (isNaN(result)){
        throw new Error("Message timestamp can not be converted to number");
      }
      return +message.ts;
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
