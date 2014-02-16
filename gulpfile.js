// Gulpfile.js
// Require the needed packages
"use strict";


var gulp    = require( 'gulp' );
var concat  = require( 'gulp-concat' );
var stylus  = require( 'gulp-stylus' );
var refresh = require( 'gulp-livereload' );
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

gulp.task( 'scripts', function() {
  gulp.src(
    [
      './assets/js/vendor/angular.js',
      './assets/js/vendor/angular-route.js',
      './assets/js/index/controller.js',
      './assets/js/index/app.js'
    ]
  ).pipe( concat( 'index.js') )
    //.pipe( uglify() )
    .pipe( gulp.dest('./public/js') )
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

gulp.task( 'livereload', function() {
  server.listen( 35729, function( err ){
    if( err ) {
      return console.log( err );
    }
  });
} );

// Default gulp task to run
gulp.task( 'default', function() {
    gulp.run( 'stylus', 'svgo', 'scripts', 'livereload' );

    gulp.watch( './assets/styles/**/*.styl', function() {
      gulp.run( 'stylus', 'livereload', 'bust' );
    } );

    gulp.watch( './assets/js/**/*.js', function() {
      gulp.run( 'scripts', 'livereload', 'bust' );
    } );
} );
