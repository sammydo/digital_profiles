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
