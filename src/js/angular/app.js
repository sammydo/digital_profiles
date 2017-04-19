angular
  .module('DigitalProfiles', ['ui.router', 'firebase', 'ui.materialize', 'djds4rce.angular-socialshare', 'ngToast', 'ngAnimate'])
  .constant('API', '/api')
  .config(MainRouter)
  .run(AuthCatcher)
  .factory('httpRequestInterceptor', authInterceptorFact)
  .config(authInterceptor);

// Adds firebase token to requests to ensure authorisastion
function authInterceptorFact($rootScope) {
  return {
    request: function(config) {
      config.headers.auth = $rootScope.token;
      return config;
    },
    response: function(config) {
      var role = config.headers().user_role;
      return config;
    }
  };
}

authInterceptor.$inject = ["$httpProvider"];

function authInterceptor($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
}

AuthCatcher.$inject = ["$state", "$rootScope"];

// Ensure a user is enabled to view a state
function AuthCatcher($state, $rootScope) {
  $rootScope.$on('$stateChangeError', function(thing, toState, toParams, fromState, fromParams, error) {
    if (error === 'AUTH_REQUIRED') $state.go('authRequired');
  });

  $rootScope.$on('$stateChangeSuccess', function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $('#mobile-demo').sideNav('hide');
  });

}

MainRouter.$inject = ["$stateProvider", "$urlRouterProvider"];

// Main Router for Angular that controls the display of different states
function MainRouter($stateProvider, $urlRouterProvider) {

  var authRequired = {
    currentAuth: function(Auth) {
      return Auth.$requireSignIn();
    }
  };

  // Splash page with Spartans
  $stateProvider
    .state('splash', {
      url: '/',
      views: {
        '': {
          templateUrl: '/states/splash.html'
        },
        'navbar@splash': {
          templateUrl: '/states/partials/_navbar.html'
        }
      }
    })
    .state('enquiry', {
      url: '/enquiry',
      views: {
        '': {
          templateUrl: '/states/enquiry.html'
        },
        'navbar@enquiry': {
          templateUrl: '/states/partials/_navbar.html'
        }
      }
    })
    .state('authRequired', {
      url: '/authRequired',
      views: {
        '': {
          templateUrl: '/states/authRequired.html'
        },
        'navbar@authRequired': {
          templateUrl: '/states/partials/_navbar.html'
        }
      }
    })
    .state('emailSend', {
      url: '/emailSend',
      views: {
        '': {
          templateUrl: '/states/emailSend.html'
        },
        'navbar@emailSend': {
          templateUrl: '/states/partials/_navbar.html'
        }
      }
    })
    .state('login', {
      url: '/login',
      views: {
        '': {
          templateUrl: '/states/login.html'
        },
        'navbar@login': {
          templateUrl: '/states/partials/_navbar.html'
        }
      }
    })
    .state('register', {
      url: '/register',
      views: {
        '': {
          templateUrl: '/states/register.html'
        },
        'navbar@register': {
          templateUrl: '/states/partials/_navbar.html'
        },
        'adminreg@register': {
          templateUrl: '/states/partials/_adminreg.html'
        },
        'clientreg@register': {
          templateUrl: '/states/partials/_clientreg.html'
        },
        'spartanreg@register': {
          templateUrl: 'states/partials/_spartanreg.html'
        }
      },
      resolve: authRequired
    })
    .state('profile', {
      url: '/profile/:id',
      views: {
        '': {
          templateUrl: '/states/profile.html'
        },
        'navbar@profile': {
          templateUrl: '/states/partials/_navbar.html'
        }
      },
      resolve: authRequired
    })
    .state('faq', {
      url: '/faq/:id',
      views: {
        '': {
          templateUrl: '/states/faq.html'
        },
        'navbar@faq': {
          templateUrl: '/states/partials/_navbar.html'
        }
      }
    });

  // Else, display index
  $urlRouterProvider.otherwise('/');
}
