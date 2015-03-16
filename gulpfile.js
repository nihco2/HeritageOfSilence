'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  rimraf = require('gulp-rimraf'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer');

// Modules for webserver and livereload
var express = require('express'),
  refresh = require('gulp-livereload'),
  livereload = require('connect-livereload'),
  livereloadport = 35729,
  serverport = 5000;

// Set up an express server (not starting it yet)
var server = express();
// Add live reload
server.use(livereload({
  port: livereloadport
}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
/*server.all('/*', function(req, res) {
  res.sendfile('index.html', {
    root: 'dist'
  });
});
*/
// Dev task
gulp.task('dev', ['clean', 'views', 'styles', 'bstyles', 'fonts', 'assets', 'lint', 'browserify'], function() {});

// Clean task
gulp.task('clean', function() {
  gulp.src('./dist/views', {
      read: false
    }) // much faster
    .pipe(rimraf({
      force: true
    }));
});

// JSHint task
gulp.task('lint', function() {
  gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// bootstrap style
gulp.task('bstyles', function() {
  gulp.src('bower_components/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('dist/css/vendor/'));
});

// Styles task
gulp.task('styles', function() {
  gulp.src([
      'styles/*.scss'
    ])
    // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
    .pipe(sass({
      onError: function(e) {
        console.log(e);
      }
    }))
    // Optionally add autoprefixer
    .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
    // These last two should look familiar now :)
    .pipe(gulp.dest('dist/css/'));
});

// fonts task
gulp.task('fonts', function() {
  gulp.src([
      'styles/themes/default/fonts/*'
    ])
    .pipe(gulp.dest('dist/css/themes/default/fonts'));
});

// assets task
gulp.task('assets', function() {
  gulp.src('assets/**/*')
    .pipe(gulp.dest('dist/assets/'));
});

// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
  gulp.src(['scripts/app.js'])
    .pipe(browserify({
      shim: {
        'jquery': {
          path: './bower_components/jquery/dist/jquery.js',
          exports: '$'
        },
        'bootstrap': {
          path: './bower_components/bootstrap/dist/js/bootstrap.js',
          exports: 'bootstrap',
          depends: {
            angular: 'jquery'
          }
        },
        'angular': {
          path: './bower_components/angular/angular.js',
          exports: 'angular'
        },
        'angular-route': {
          path: './bower_components/angular-route/angular-route.js',
          exports: 'ngRoute',
          depends: {
            angular: 'angular'
          }
        },
        'angular-sanitize': {
          path: './bower_components/angular-sanitize/angular-sanitize.js',
          exports: 'ngSanitize',
          depends: {
            angular: 'angular'
          }
        },
        'videogular': {
          path: './scripts/com/2fdevs/videogular/videogular.js',
          exports: 'vg',
          depends: {
            angular: 'angular'
          }
        },
        'videogular-controls': {
          path: './scripts/com/2fdevs/videogular/plugins/controls.js',
          exports: 'vg'
        },
        'videogular-buffering': {
          path: './scripts/com/2fdevs/videogular/plugins/buffering.js',
          exports: 'vg'
        },
        'videogular-overlay-play': {
          path: './scripts/com/2fdevs/videogular/plugins/overlay-play.js',
          exports: 'vg'
        },
        'videogular-poster': {
          path: './scripts/com/2fdevs/videogular/plugins/poster.js',
          exports: 'vg'
        },
        'videogular-youtube': {
          path: './scripts/youtube.js',
          exports: 'vg'
        }
      }
    }))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist/js'))

});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('index.html')
    // And put it in the dist folder
    .pipe(gulp.dest('dist/'));

  // Any other view files from app/views
  gulp.src('views/**/*')
    // Will be put in the dist/views folder
    .pipe(gulp.dest('dist/views/'));
});

gulp.task('watch', ['lint'], function() {
  // Start webserver
  server.listen(serverport);

  // Start live reload
  refresh.listen(livereloadport);

  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['scripts/*.js', 'scripts/**/*.js'], [
    'lint',
    'browserify'
  ]);
  // Watch our sass files
  gulp.watch(['styles/**/*.scss'], [
    'styles'
  ]);

  gulp.watch(['assets/**/*'], [
    'assets'
  ]);

  gulp.watch(['**/*.html'], [
    'views'
  ]);

  gulp.watch('./dist/**').on('change', refresh.changed);

});

gulp.task('default', ['dev', 'watch']);
