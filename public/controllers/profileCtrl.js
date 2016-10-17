angular.module('chat.profile',[])
.controller("ProfileCtrl", ['$scope', '$http', function($scope, $http) {
  $http.get('/api/profile')
  .then(function(res){
    console.log("cons is ", res);
  })
    
}]);