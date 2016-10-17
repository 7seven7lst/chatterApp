angular.module('chat.signup', [])
.controller('SignupCtrl', ['$scope', '$http', '$state', '$rootScope','Auth', function($scope, $http, $state, $rootScope, Auth) {
  console.log("sign up controller working!!!");
  $scope.signup = Auth.signup;
   
}]);

