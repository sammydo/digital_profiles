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
