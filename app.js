/**
 * Module dependencies.
 */

var debug    = require( 'debug' )( 'INDEX' );
var koa      = require( 'koa' );
var logger   = require( 'koa-logger' );
var route    = require( 'koa-route' );
var views    = require( 'koa-render' );
var session  = require( './lib/session/session' );

// controller
var index     = require( './controller/index/controller' );
var dashboard = require( './controller/dashboard/controller' );
var login     = require( './controller/login/controller' );
var security  = require( './controller/security/controller' );
var user      = require( './controller/user/controller' );

var config = require( './config/config' );


var app    = koa();
app.outputErrors = true;

// middleware

// logger
app.use( logger() );

app.name = 'koa-session-test';

// session handling
app.use( session.handle );

// view handling
app.use( views('./views', 'jade' ) );

// route middleware

// Homepage GET
app.use( route.get( '/', index.index.get ) );

// dashboard GET
app.use( route.get( '/dashboard', dashboard.index.get ) );

// security login area GET | POST
app.use( route.get( config.routes.security.login, security.login.get ) );
app.use( route.post( config.routes.security.login, security.login.post ) );

// customer creationg or display of customer area GET | POST
app.use( route.get( config.routes.user.index, user.index.get ) );
app.use( route.post( config.routes.user.create, user.index.post ) );

// listen
app.listen( 3000, function() {
  console.log('listening on port 3000');
} );
