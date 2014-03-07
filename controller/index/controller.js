var debug   = require( 'debug' )( 'INDEX/CONTROLLER' );
var session = require( '../../lib/session/session' );
var assets  = require( '../../lib/assets/assetsLoader.js' );

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *( next ) {
  this.body = yield this.render(
                      'beauty/index',
                      {
                        assets     : assets,
                        isLoggedIn : session.isLoggedIn( this )
                      }
                    );
};


module.exports = new Controller();
