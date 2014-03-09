// Gulpfile.js
// Require the needed packages
"use strict";


var gulp    = require( 'gulp' );
var concat  = require( 'gulp-concat' );
var stylus  = require( 'gulp-stylus' );
var bust    = require( 'gulp-buster' );
var svgmin  = require( 'gulp-svgmin' );
var uglify  = require( 'gulp-uglify' );
var lr      = require( 'tiny-lr' );
var server  = lr();



gulp.task( 'bust', function() {
  gulp.src( [
    'public/**/*'
  ] )
    .pipe( bust('busters.json') )
    .pipe( gulp.dest( './config' ) );
} );

gulp.task( 'indexScripts', function() {
  gulp.src(
    [
      './assets/js/vendor/angular.js',
      './assets/js/vendor/angular-route.js',
      './assets/js/index/app.js',
      './assets/js/index/controller/login.js',
      './assets/js/index/controller/createUser.js'
    ]
  ).pipe( concat( 'beauty.js') )
    //.pipe( uglify() )
    .pipe( gulp.dest('./public/js') )
} );

gulp.task( 'privateScripts', function() {
  gulp.src(
    [
      './assets/js/vendor/angular.js',
      './assets/js/vendor/angular-route.js',
      './assets/js/vendor/angular-animate.js',
      './assets/js/dashboard/app.js'
    ]
  ).pipe( concat( 'beast.js' ) )
    //.pipe( uglify() )
    .pipe( gulp.dest( './public/js' ) )
} );

gulp.task( 'stylus', function() {
    gulp.src( './assets/styles/index.styl' )
      .pipe( stylus( {
        use: [ 'nib' ],
        import: [ 'nib' ]
      } ) )
      .pipe(gulp.dest( './public/styles' ) );
} );

gulp.task( 'svgo', function() {
    gulp.src( 'assets/img/**/*.svg' )
        .pipe( svgmin() )
        .pipe( gulp.dest( './public/img' ) );
} );


// Default gulp task to run
gulp.task( 'default', function() {
    gulp.start( 'stylus', 'svgo', 'indexScripts', 'privateScripts' );

    gulp.watch( './assets/styles/**/*.styl', function() {
      gulp.start( 'stylus', 'bust' );
    } );

    gulp.watch( './assets/js/**/*.js', function() {
      gulp.start( 'indexScripts', 'privateScripts', 'bust' );
    } );
} );
