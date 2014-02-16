var debug   = require( 'debug' )( 'VIEWS/CONTROLLER' );

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *( view ) {
  this.body = yield this.render(
                      view
                    );
};


module.exports = new Controller();
