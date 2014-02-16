/**
 * Module dependencies.
 */
'use strict';

var debug    = require( 'debug' )( 'INDEX' );
var koa      = require( 'koa' );
var logger   = require( 'koa-logger' );
var route    = require( 'koa-route' );
var views    = require( 'koa-views' );
var statics  = require( 'koa-static' );
var session  = require( './lib/session/session' );

// controller
var index     = require( './controller/index/controller' );
var dashboard = require( './controller/dashboard/controller' );
var login     = require( './controller/login/controller' );
var security  = require( './controller/security/controller' );
var user      = require( './controller/user/controller' );

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
app.use( statics( '.' ) );


// route middleware

// Homepage GET
app.use( route.get( '/', index.get ) );
app.use( route.get( '/howitworks', index.get ) );
app.use( route.get( '/features', index.get ) );

// dashboard GET
app.use( route.get( routes.dashboard.index, dashboard.index.get ) );

// security login area GET | POST
app.use( route.get( routes.security.login, security.login.get ) );
app.use( route.post( routes.security.login, security.login.post ) );

// customer creationg or display of customer area GET | POST
app.use( route.get( routes.user.index, user.index.get ) );
app.use( route.post( routes.user.create, user.index.post ) );

// listen
app.listen( 3000, function() {
  console.log('listening on port 3000');
} );
