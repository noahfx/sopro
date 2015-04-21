angular.module('societyProChatApp.cardController',
  ['ngMaterial']
)
.controller('historyCardController',
['$scope', '$http', '$rootScope', '$timeout',
  function($scope, $http, $rootScope, $timeout) {
    $scope.messages = ["a", "b", "c"];
    $http({
        method: 'GET',
        url: '/api/channel.history',
        headers: {
         'token-auth': $rootScope.token
        },
        params : {
	  channel : "general"
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
