/**
 * Module dependencies.
 */
'use strict';

var debug    = require( 'debug' )( 'INDEX' );
var koa      = require( 'koa' );
var logger   = require( 'koa-logger' );
var router   = require( 'koa-router' );
var views    = require( 'koa-views' );
var statics  = require( 'koa-static' );
var session  = require( './lib/session/session' );

// controller
var controller        = {};
controller.account    = require( './controller/account/controller' )
controller.index      = require( './controller/index/controller' );
controller.dashboard  = require( './controller/dashboard/controller' );
controller.projects   = require( './controller/projects/controller' );
controller.security   = require( './controller/security/controller' );
controller.user       = require( './controller/user/controller' );
controller.views      = require( './controller/views/controller' );

var config = require( './config/config' );
var routes = config.routes;


var app    = koa();
app.use( router( app ) );
app.outputErrors = true;

// middleware

// logger
app.use( logger() );

// view handling
views( app, './views', 'html' )
  .map( 'underscore', 'html' );

// asset handling
app.use( statics( __dirname + '/public' ) );

// route middleware
for ( var route in routes ) {
  for ( var method in routes[ route ] ) {
    if ( routes[ route ][ method ] instanceof Array ) {
      routes[ route ][ method ].forEach( function( value ) {
        if ( controller[ route ].isSecure ) {
          app[ method ](
            value, session.handleSecure, controller[ route ][ method ]
          );
        } else {
          app[ method ](
            value, session.handle, controller[ route ][ method ]
          );
        }
      }.bind( this ) );
    }
  }
}

// listen
app.listen( 3000, function() {
  console.log('listening on port 3000');
} );
