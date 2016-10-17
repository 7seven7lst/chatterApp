angular.module('chat.signin', [])
.controller('SigninCtrl', ['$scope', '$http', '$state', '$rootScope','Auth', function($scope, $http, $state, $rootScope, Auth) {
  console.log("working!!!!");
  $scope.user = {};
   $scope.errors = {};
   $scope.signin = Auth.signin;
   
}]);

