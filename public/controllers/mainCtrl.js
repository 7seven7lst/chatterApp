angular.module('chat.main',[])
.controller("MainCtrl", ['$scope', '$state', '$http', 'Auth', function($scope, $state, $http, Auth) {
  $scope.logout = Auth.logout;
    
}]);