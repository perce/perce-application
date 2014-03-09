


var debug   = require( 'debug')('LOGIN/LOGIN' );
var config  = require( '../../config/config' );
var session = require( '../../lib/session/session' );
var parse   = require( 'co-body');
var cushion = new ( require('cushion').Connection )(
                '127.0.0.1',
                5984,
                'stefan',
                'xxxx'
              );
var db      = cushion.database('perce-users');
var user    = require( '../../lib/user/user' );

/**
 * Constructor
 * Security Controller
 *
 * @type { AJAX CONTROLLER }
 */
var Controller = function() {};


/**
 * Handle log out
 */
Controller.prototype.get = function *( next ) {
  var date = new Date();

  // set date to past
  // to make cookie expire
  date.setMinutes( date.getMinutes() - 1 )

  this.cookies.set(
    'session',
    'whatever',
    {
      expires : date
    }
  );

  this.redirect( '/' );
};


/**
 * Handle login ajax call and authenticate user
 */
Controller.prototype.post = function *( next ) {
  var post  = yield parse(this),
      userDoc = false;

  if ( post.email && post.password ) {
    userDoc = yield user.authenticate( post.email, post.password );

    if ( userDoc ) {
      yield session.set( this, userDoc._id );

      this.status = 200;
      this.body = {
        url : '/projects'
      };
    } else {
      this.status = 401;
      this.body = {
        error : 'Nice try buddy!!!'
      };
    }
  } else {
    this.status = 401;
    this.body = {
      error : 'Please enter email and password'
    };
  }
};

module.exports = new Controller();
