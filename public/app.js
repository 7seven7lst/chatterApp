angular.module('chat', ['ui.router', 'chat.main', 'chat.signin', 'chat.profile'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .state('signin', {
            url: '/signin',
            templateUrl: 'views/signin.html',
            controller: 'SigninCtrl'
        })
        .state('profile', {
            url: '/profile', 
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl'
        });

    // the following will give angular injection error
    /*
    $httpProvider.interceptors.push(function($q, $state) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401) {
            $state.go('home');
          } 
          return $q.reject(response);
        }
      };
    });
    */

});




