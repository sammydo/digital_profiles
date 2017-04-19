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
