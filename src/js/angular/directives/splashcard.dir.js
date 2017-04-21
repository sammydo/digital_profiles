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
