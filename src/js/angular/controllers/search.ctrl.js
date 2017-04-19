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
