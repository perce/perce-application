


var debug   = require( 'debug' )( 'USER/INDEX' );
var session = require( '../../lib/session/session' );
var user    = require( '../../lib/user/user' );
var parse   = require( 'co-body' );

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Post
 */
Controller.prototype.post = function *post() {
  var post = yield parse( this );

  var userDoc = yield user.create( post );

  // more conditions please
  if ( typeof userDoc === 'object' ) {
    yield session.set( this, userDoc._id );
    this.redirect( 'user' );
  } else {
    this.body = yield this.render( 'user/create' );
  }
};


module.exports = new Controller();
