'use strict';

angular.module('chat')
.factory('Auth', function Auth($q, $timeout, $http, $rootScope, $state ) {
  // Get currentUser from cookie
  
  var _userName;
  var _loggedIn;
  var getLoggedIn = function() {
    return $http.get('/api/loggedin')
    .success(function(data){
        console.log("is it logged in???>>>>>", data);
        _loggedIn = Boolean(data);
        if (!_loggedIn){
            //$state.go('signin');
            return true;
        } else {
          return false;
        }
    })
    .error(function(err){
      return false;
    });
  };
  getLoggedIn();
  
  var setLoggedIn = function(isIn) {
      _loggedIn = isIn;
  };

  var logout = function(){
    console.log("hererere trying to logout");
    $http.get('/api/logout')
    .then(function(res, err){
      console.log("log out response", res);
      if (res.status ===200){
        $state.go('signin');
      }
    })
  }

  var signin = function(user){
    $http.post('/api/login', user)
    .then(function(res, err){
      console.log("response is >>>>>", res);
      return getLoggedIn()
    })
    .then(function(){
      if (res.status !== 401){
        service._loggedIn = true;
        service.getLoggedIn();
        $state.go('home');
      }
    })
  }

  var signup = function(user){
    $http.post('/api/signup', user)
    .then(function(res, err){
      console.log("response  from posting to signup api is >>>>>", res);
      if (res.status !== 401){
        service._loggedIn = true;
        service.getLoggedIn();
        $state.go('home');
      }
    })
  }

  var service ={
    getLoggedIn: getLoggedIn,
    _loggedIn: _loggedIn,
    logout: logout,
    signin: signin,
    signup: signup
  }
    
  return service;
});