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
