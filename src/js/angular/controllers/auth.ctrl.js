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
