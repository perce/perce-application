var debug   = require('debug')('DASHBOARD/CONTROLLER');
var session = require('../../lib/session/session');
var assets  = require( '../../lib/assets/assetsLoader.js' );

/**
 * Index Controller
 */
var Controller = function() {};


Controller.prototype.isSecure = true;


/**
 * Get
 */
Controller.prototype.get = function *index( next ) {
  this.body = yield this.render(
                    'beast/index',
                    {
                      assets     : assets,
                      isLoggedIn : session.isLoggedIn( this ),
                      userEmail  : this.user.email
                    }
                  );
};


module.exports = new Controller();
