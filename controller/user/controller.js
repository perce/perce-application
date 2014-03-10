


var debug   = require( 'debug' )( 'USER/INDEX' );
var session = require( '../../lib/session/session' );
var user    = require( '../../lib/user/user' );
var parse   = require( 'co-body' );


/**
 * Constructor
 * User controller
 *
 * @type { AJAX CONTROLLER }
 */
var Controller = function() {};


/**
 * Post
 */
Controller.prototype.post = function *post() {
  var post = yield parse( this );

  var userDoc = yield user.create( post );

  if ( typeof userDoc === 'object' ) {
    yield session.set( this, userDoc._id, userDoc._body.email );

    this.status = 201;
    this.body = {
      url : '/projects'
    };
  } else {
    // show error message
    this.status = 403;
    this.body   = {
      'error' : userDoc
    };
  }
};


module.exports = new Controller();
