var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var runSequence = require('run-sequence');

// Compile materialize
gulp.task('build-materialize', function() {
  return gulp.src('bower_componenets/materialize/sass/**/*')
    .pipe(gulp.dest('src/sass/materialize-sass'));
});

// Compile and concatanate SASS
gulp.task('build-sass', function() {
  return gulp.src('src/sass/main.scss')
    .pipe(sass({
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('main.min.css'))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('public/css/'));
});

// Build bower packages and concatanate
// gulp.task('build-bower', function() {
//   return gulp.src('./bower.json')
//     .pipe(mainBowerFiles('**/*.js'))
//     .pipe(concat('bower.js'))
//     .pipe(gulp.dest('src/js/'));
// });

// Quality control for js files
gulp.task('jslint', function() {
  gulp.src('src/js/angular/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter()); // Display results
});

// Minify and concatanate js files

gulp.task('concat-js', function() {
  gulp.src(['src/js/angular/app.js', 'src/js/angular/factories/*.js', 'src/js/angular/**/*.js', 'src/js/custom/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest('public/js/'));
});

// Watch files for changes
gulp.task('watch', function() {
  gulp.watch('src/sass/*.scss', ['build-sass']);
  // gulp.watch('./bower.json', ['build-bower']);
  gulp.watch('src/js/angular/**/*.js', ['jslint']);
  gulp.watch('src/js/custom/**/*.js', ['jslint']);
  gulp.watch('src/js/**/*.js', ['concat-js']);
});

gulp.task('default', ['watch', 'build-materialize', 'build-sass', 'jslint', 'concat-js']);

gulp.task('build', function(done) {
  runSequence('build-materialize', 'build-sass', 'concat-js', function() {
    console.log("Build Complete");
    done();
  });
});
