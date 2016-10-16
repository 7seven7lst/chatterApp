angular.module('homeowrk.utilservice', [])

.factory('UtilService', ['$http', '$log', function($http, $log) {
  var transformDate = function(assignmentDate) {
      return new Date(assignmentDate).toLocaleString();
  };

  var getURL = function() {
    return $http.get('https://api.edmodo.com/assignments?access_token=12e7eaf1625004b7341b6d681fa3a7c1c551b5300cf7f7f3a02010e99c84695d');
  }

  return {
    getURL: getURL,
    transformDate: transformDate
  };
}]);
