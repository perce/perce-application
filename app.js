/**
 * Module dependencies.
 */
'use strict';

var debug    = require( 'debug' )( 'INDEX' );
var koa      = require( 'koa' );
var logger   = require( 'koa-logger' );
var router   = require( 'koa-route' );
var views    = require( 'koa-views' );
var statics  = require( 'koa-static' );
var session  = require( './lib/session/session' );

// controller
var controller        = {};
controller.index      = require( './controller/index/controller' );
controller.views      = require( './controller/views/controller' );
// controller.dashboard  = require( './controller/dashboard/controller' );
// controller.login      = require( './controller/login/controller' );
// controller.security   = require( './controller/security/controller' );
controller.user       = require( './controller/user/controller' );

var config = require( './config/config' );
var routes = config.routes;


var app    = koa();
app.outputErrors = true;

// middleware

// logger
app.use( logger() );

// view handling
views( app, './views', 'html' )
  .map( 'underscore', 'html' );

// session handling
app.use( session.handle );

// asset handling
app.use(statics(__dirname + '/public'));

// route middleware
for ( var route in routes ) {
  if ( typeof routes[ route ] === 'object' ) {
    for ( var method in routes[ route ] ) {
      if ( routes[ route ][ method ] instanceof Array ) {
        routes[ route ][ method ].forEach( function( value ) {
          app.use( router[ method ]( value, controller[ route ][ method ] ) );
        }.bind( this ) );
      }
    }
  }
}

// // dashboard GET
// app.use( route.get( routes.dashboard.index, dashboard.index.get ) );

// // security login area GET | POST
// app.use( route.get( routes.security.login, security.login.get ) );
// app.use( route.post( routes.security.login, security.login.post ) );

// // customer creationg or display of customer area GET | POST
// app.use( route.get( routes.user.index, user.index.get ) );
// app.use( route.post( routes.user.create, user.index.post ) );

// listen
app.listen( 3000, function() {
  console.log('listening on port 3000');
} );
