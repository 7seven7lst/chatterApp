angular.module('chat', ['ui.router', 'chat.main', 'chat.signin', 'chat.signup', 'chat.profile'])
.factory('httpInterceptor', ['$q','$injector','$rootScope',function ($q,$injector, $rootScope) {
    function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
                $rootScope.emit("unauthorized");
                $injector.get('$state').go('signin');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
}])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    $urlRouterProvider.otherwise('/signin');
    
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            authenticate: true
        })
        .state('signin', {
            url: '/signin',
            templateUrl: 'views/signin.html',
            controller: 'SigninCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
        .state('profile', {
            url: '/profile', 
            templateUrl: 'views/profile.html',
            controller: 'ProfileCtrl',
            authenticate: true
        });
     //$httpProvider.interceptors.push('httpInterceptor');

    
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

})

.run(function($rootScope, $state, Auth) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        console.log("root changing detected",  toState);
        if(toState.name !== 'signin' && toState.name !=='signup') {
            console.log("what is Auth>?????", Auth);
            var state = toState.name;
            Auth.getLoggedIn()
            .then(function(){
                console.log("here auth is >>>>>", Auth);
                if (Auth._loggedIn){
                    console.log("logged in , no need to redirect ")
                } else {
                    console.log("not logged in, need to redirect accordinly");
                    $state.go('signin');
                }
            })
        }
    });

});


