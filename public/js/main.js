
authInterceptorFact.$inject = ["$rootScope"];
AuthFactory.$inject = ["$firebaseAuth"];
UserFactory.$inject = ["API", "$http"];
AuthController.$inject = ["Auth", "$state", "User", "$rootScope", "ngToast", "$stateParams"];
SearchController.$inject = ["$state", "User", "$rootScope"];
SpartanController.$inject = ["User", "$state", "$stateParams", "$rootScope"];angular
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

angular
  .module('DigitalProfiles')
  .factory('Auth', AuthFactory)
  .run(function() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAyHrUwDBAsWCvc0SXnZjzqA6TntQhLRFc",
      authDomain: "digital-profiles-3b7c3.firebaseapp.com",
      databaseURL: "https://digital-profiles-3b7c3.firebaseio.com",
      storageBucket: "digital-profiles-3b7c3.appspot.com",
      messagingSenderId: "781897675110"
    };
    firebase.initializeApp(config);
  });

function AuthFactory($firebaseAuth) {
  return $firebaseAuth();
}

angular
  .module('DigitalProfiles')
  .factory('User', UserFactory);

// Interacts with users via the backend API
function UserFactory(API, $http) {
  return {
    // Create a new user
    create: function(newUser) {
      return $http.post(API + '/users', newUser, { headers: { 'Content-Type': 'application/json' }});
    },
    // Request to get a specific user
    getUser: function(id) {
      return $http.get(API + '/users/' + id);
    },
    // Request to get all spartans
    getSpartans: function(query) {
      return $http.get(API + '/users/spartans?' + query.type + '=' + query.name);
    },
    // Request to get a spartan
    getSpartan: function(id) {
      return $http.get(API + '/users/spartans/' + id);
    },
    // Update a spartan
    updateSpartan: function(id, spartan) {
      return $http.patch(API + '/users/spartans/' + id, spartan);
    },
    // Make an enquiry to sparta global using user data
    enquiry: function(enquiry){
      return $http.post(API + '/enquiry', enquiry);
    },
    // Make an enquiry to sparta global using input form
    annonymousEnquiry: function(enquiry){
      return $http.patch(API + '/enquiry', enquiry);
    }
  };
}

angular
  .module('DigitalProfiles')
  .controller('AuthController', AuthController);

function AuthController(Auth, $state, User, $rootScope, ngToast, $stateParams) {

  var self = this;
  self.email = '';
  self.password = '';
  self.loggedIn = false;
  self.user = {};
  self.emailSentMessage = '';
  self.skillauth = false;

  /******** Change the state of the registration form****/
  self.adminForm = false;
  self.clientForm = false;
  self.spartanForm = false;
  self.placeholder = true;

  self.admin = function() {
    self.placeholder = false;
    self.spartanForm = false;
    self.clientForm = false;
    self.adminForm = true;
    self.resetCredentials();
  };

  self.client = function() {
    self.placeholder = false;
    self.spartanForm = false;
    self.adminForm = false;
    self.clientForm = true;
    self.resetCredentials();
  };

  self.spartan = function() {
    self.placeholder = false;
    self.adminForm = false;
    self.clientForm = false;
    self.spartanForm = true;
    self.resetCredentials();
  };

  /************************************************************/
  // Function to check if a user is stored in the localStorage, if so grab
  self.checkLoggedIn = function() {
    return (localStorage.getItem("user")) ? true : false;
  };

  // Logged in status is determined from checkLoggedIn function
  self.loggedIn = self.checkLoggedIn();

  // Upon state change, if a user is set. Reassign that user.
  Auth.$onAuthStateChanged(function(user) {
    if (user) {
      self.user = user;
      self.getUser();
    }
  });

  // Check to ensuer only the spartan in question or an admin can modify their skills
  self.real = function() {
    if (self.user.data) {
      if (self.user.data[0]._id === $stateParams.id || self.user.data[0].role === 2) {
        self.skillauth = true;
      } else {
        self.skillauth = false;
      }
    }
  };

  // Outputs a toast to the page with error/success message
  function toast(type) {
    var htmlClass = "";
    if (type === self.error) {
      htmlClass = "red";
    } else if (type === self.success) {
      htmlClass = "green";
    } else {
      htmlClass = "white";
    }

    ngToast.create({
      content: '<div id="card-alert" class="alert card ' + htmlClass + ' col s12 m6 offset-m3"  ng-if="auth.error"><div class="card-content col s12 white-text valign-wrapper alert-padded"><p class="col s11">' + type + '</p><div class="col s1"><a class="close btn-floating btn-small waves-effect waves-light ' + htmlClass + ' valign" data-dismiss="alert" aria-label="Close"><i class="material-icons">close</i></a></div></div></div></div>',
      maxNumber: 1
    });
  }

  // Gets a user from the database with the associated firebase uid
  self.getUser = function() {
    User.getUser(Auth.$getAuth().uid)
      .then(function(user, err) {
        self.user = user;
        self.real();
      });
  };

  // Upon state change, if a user is set. Reassign that user, also get a token for use in requests.
  Auth.$onAuthStateChanged(function(user) {
    if (user) {
      Auth.$getAuth().getToken(false)
        .then(function(token) {
          $rootScope.token = token;
          User.getUser(user.uid)
            .then(function(res) {
              $rootScope.user = self.user;
            })
            .catch(function(error) {
              self.user = user;
            });
        });
    }
  });

  // Log-in function, user signs in with email and password
  self.signIn = function() {
    Auth.$signInWithEmailAndPassword(self.email, self.password)
      .then(function(user) {
        self.loggedIn = true;
        localStorage.setItem("user", "true");
        self.getUser();
        self.resetCredentials();
        $state.go('splash');
      })
      .catch(function(error) {
        self.error = error;
        toast(self.error);
      });
  };

  // Sign out with firebase
  self.signOut = function() {
    Auth.$signOut();
    self.loggedIn = false;
    self.user = {};
    localStorage.removeItem("user");
    $state.go('login', {
      location: true,
      inherit: true,
      relative: $state.$current,
      notify: false,
      reload: true
    });
  };

  // Generates a random password from user token
  function randomPassword() {
    var randomPassword = [];
    for (var i = 0; i < 8; i++) {
      randomPassword.push($rootScope.token.charAt(Math.floor(Math.random() * 30)));
    }
    return randomPassword.join("");
  }

  // Creates a new user with their associated role
  self.createUser = function(role) {
    self.password = randomPassword();
    self.getUser();

    Auth.$createUserWithEmailAndPassword(self.email, self.password)
      .then(function(user) {
        switch (role) {
          // Spartan
          case 0:
            User.create({
                uid: user.uid,
                role: 0,
                profile: {
                  email: self.email,
                  firstname: self.first_name,
                  lastname: self.last_name
                }
              })
              .then(function(response) {
                self.postCreateUser();
              })
              .catch(function(error) {
                self.error = error;
                toast(self.error);
              });
            break;
            // Client
          case 1:
            User.create({
                uid: user.uid,
                role: 1,
                profile: {
                  email: self.email,
                  firstname: self.first_name,
                  lastname: self.last_name,
                  number: self.number,
                  company: self.company,
                  companyPosition: self.companyPosition
                }
              })
              .then(function(response) {
                self.postCreateUser();
              })
              .catch(function(error) {
                self.error = error;
                toast(self.error);
              });
            break;
            // Admin
          case 2:
            User.create({
                uid: user.uid,
                role: 2,
                profile: {
                  email: self.email,
                  firstname: self.first_name,
                  lastname: self.last_name,
                }
              })
              .then(function(response) {
                self.postCreateUser();
              })
              .catch(function(error) {
                self.error = error;
                toast(self.error);
              });
            break;
          default:
        }
      })
      .catch(function(error) {
        self.error = error;
        toast(self.error);
      });
  };

  // Reset form data
  self.resetCredentials = function() {
    self.email = null;
    self.password = null;
    self.first_name = null;
    self.last_name = null;
    self.number = null;
    self.company = null;
    self.companyPosition = null;
  };

  // Function to run after a new user is created
  self.postCreateUser = function() {
    Auth.$sendPasswordResetEmail(self.email)
      .then(function() {
        self.success = "User has been created. Password reset email sent. Please sign in to continue";
        toast(self.success);
        self.resetCredentials();
        self.signOut();
      })
      .catch(function(error) {
        self.error = error;
        toast(self.error);
      });
  };

  // Sends an email to reset the users password
  self.resetPassword = function() {
    Auth.$sendPasswordResetEmail(self.email)
      .then(function() {
        self.success = "Password reset email has been sent";
        toast(self.success);
        $state.go('login');
        self.resetCredentials();
      })
      .catch(function(error) {
        self.error = error;
        toast(self.error);
      });
  };

  // Send an enquiry from a non registered user
  self.annonymousEnquiry = function() {
    var reqObj = {
      user: {
        profile: {
          email: self.email,
          firstname: self.first_name,
          lastname: self.last_name,
          number: self.number,
          company: self.company,
          companyPosition: self.companyPosition
        }
      },
      message: self.message
    };

    User.annonymousEnquiry(reqObj)
      .then(function(response) {
        self.message = '';
        self.success = "Your enquiry has been sent";
        toast(self.success);
        $state.go('splash');
      })
      .catch(function(error) {
        self.error = error.error;
        toast(self.error);
      });
  };

  // Send an enquiry from a registered user
  self.enquiry = function() {
    self.getUser();

    var reqObj = {
      user: self.user,
      message: self.message
    };

    User.enquiry(reqObj)
      .then(function(response) {
        self.message = '';
        self.success = "Your enquiry has been sent";
        toast(self.success);
        $state.go('splash');
      })
      .catch(function(error) {
        self.error = error.error;
        toast(self.error);
      });
  };
}

angular
  .module('DigitalProfiles')
  .controller('SearchController', SearchController);


function SearchController($state, User, $rootScope) {
  var self = this;

  // Search filter select data for viewing
  self.data = {
    placeholder: 'Filter By...',
    showall: 'Show All',
    streams: ['WebDev', 'SDET', 'DevOps', 'Testers', 'Business Analysis', 'Project Management'],
    skills: ['Javascript', 'Angular', 'Agile', 'Node', 'Ruby', 'Unit Testing', 'MongoDB'],
    selected: 'Filter By...'
  };

  // Update the spartan splash page using filter
  self.updateSplash = function(authorised) {
    var type = self.getType(self.data.selected);

    if (authorised) {
      $rootScope.$emit("getSpartans", {
        name: self.data.selected,
        type: type
      });
    } else {
      $rootScope.$emit("getFinishedSpartans", {
        name: self.data.selected,
        type: type
      });
    }
  };

  // Get filter type
  self.getType = function(name) {
    if (self.data.streams.indexOf(name) !== -1) return "stream";
    if (self.data.skills.indexOf(name) !== -1) return "skills";
    return "other";
  };
}

angular
  .module('DigitalProfiles')
  .controller('SpartanController', SpartanController);


function SpartanController(User, $state, $stateParams, $rootScope) {
  var self = this;
  self.spartans = [];
  self.spartan = {};
  self.skills = ["Communication", "Reliability", "Teamwork", "Adaptabilty", "Organisational skills", "Punctuality", "Motivational skills", "Listening skills", "Javascript", "jQuery", "Angular", "Node", "HTML5", "CSS", "MongoDB", "Ruby", "Watir", "Cucumber", "Agile"];
  self.switch = "";
  self.available = "";
  self.currentSkill = "";

  // Get all spartans base on the input query
  self.getSpartans = function(query) {
    User.getSpartans(query)
      .then(function(response) {
        self.spartans = response.data;
      })
      .catch(function(error) {
        self.error = error;
      });
  };

  // Run function if elsewhere calls getSpartans
  $rootScope.$on("getSpartans", function(event, data) {
    self.getSpartans(data);
  });

  // Toggle for being able to manipualte profile
  self.toggleSwitch = function() {
    self.spartan.profile.finished = self.switch;
    self.save();
  };

  // Toggle for whether a spartan is available
  self.toggleAvailability = function() {
    self.spartan.profile.availability = self.available;
    self.save();
  };

  // Save new data to spartan
  self.save = function() {
    User.updateSpartan($stateParams.id, self.spartan)
      .then(function(response) {
        self.spartan = response.data;
      });
  };

  // Add a skill to the spartan
  self.addSkill = function() {
    if (self.spartan.profile.skills.indexOf(self.currentSkill) === -1 && self.currentSkill !== "") {
      self.spartan.profile.skills.push(self.currentSkill);
      self.save();
    }
  };

  // Remove a skill from the spartan
  self.removeSkill = function(skill) {
    var index = self.spartan.profile.skills.indexOf(skill);
    self.spartan.profile.skills.splice(index, 1);
    self.save();
  };

  // Get only 'finished' spartan profiles
  // (for client and spartan users to see)
  self.getFinishedSpartans = function(query) {
    self.finishedSpartans = [];
    User.getSpartans(query)
      .then(function(response) {
        for (i = 0; i < response.data.length; i++) {
          if (response.data[i].profile.finished) {
            self.finishedSpartans.push(response.data[i]);
          }
        }
      })
      .catch(function(error) {
        self.error = error;
      });
  };

  // Run function if elsewhere calls getFinishedSpartans
  $rootScope.$on("getFinishedSpartans", function(event, data) {
    self.getFinishedSpartans(data);
  });

  // Get a single spartan and similar spartans to them
  self.getSpartan = function() {
    var id = $stateParams.id;
    self.foundSimilarity = [];
    self.doneSpartans = [];

    User.getSpartans({
        name: 'placeholder',
        type: 'other'
      })
      .then(function(response) {
        for (i = 0; i < response.data.length; i++) {
          if (response.data[i].profile.finished) {
            self.doneSpartans.push(response.data[i]);
          }
        }
      })
      .catch(function(error) {
        self.error = error;
      });

    User.getSpartan(id)
      .then(function(response) {
        self.spartan = response.data;
        self.switch = self.spartan.profile.finished;
        self.available = self.spartan.profile.availability;

        /**** finding similarity ****/
        for (var j = 0; j < self.doneSpartans.length; j++) {
          if (self.spartan.profile.jobtitle === self.doneSpartans[j].profile.jobtitle &&
            self.spartan.profile.firstname !== self.doneSpartans[j].profile.firstname &&
            self.spartan.profile.lastname !== self.doneSpartans[j].profile.lastname
          ) {
            if(self.foundSimilarity.length < 3) {
              self.foundSimilarity.push(self.doneSpartans[j]);
            }
          }
        }
        /****************************/
      })
      .catch(function(error) {
        self.error = error;
      });
  };
}

angular
  .module('DigitalProfiles')
  .directive('experiencetab', experienceTab);

function experienceTab() {
  return {
    restrict: 'E',
    templateUrl: 'js/directives/experience.dir.html',
    scope: {
      experiences: '=',
      profileswitch: '='
    }
  };
}

angular
  .module('DigitalProfiles')
  .directive('projecttab', projectTab);

function projectTab() {
  return {
    restrict: 'E',
    templateUrl: 'js/directives/project.dir.html',
    scope: {
      projects: '=',
      profileswitch: '='
    }
  };
}

angular
  .module('DigitalProfiles')
  .directive('splashcard', SplashCardDirective);

function SplashCardDirective() {
  return {
    restrict: 'E',
    templateUrl: 'js/directives/splashcard.dir.html',
    scope: {
      spartans: '='
    }
  };
}

angular
	.module('DigitalProfiles')

	// Takes availability of a spartan and returns a string if false
	.filter('Available', function() {
		return function(input) {
			if(input === false) {
				return "Unavailable - On client site";
			} else {
				return input;
			}
		};
	})

	// Takes dates and formats them into more readable outputs
	.filter('DateFormat', function() {
		return function(input) {
			var date = new Date(input);
			var newDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
			return (newDate && !isNaN(date.getDate())) ? newDate : input;
		};
	});
