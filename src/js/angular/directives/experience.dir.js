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
