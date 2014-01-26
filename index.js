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


var app    = koa();

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

// login area GET | POST
app.use( route.get( '/user/login', security.login.get ) );
app.use( route.post( '/user/customer', security.login.post ) );
app.use( route.get( '/security/login', security.login.get ) );
app.use( route.post( '/security/login', security.login.post ) );

// customer creationg or display of customer area GET | POST
app.use( route.get( '/user', user.index.get ) );
app.use( route.post( '/user', user.index.post ) );


// listen
app.listen( 3000, function() {
  console.log('listening on port 3000');
} );
