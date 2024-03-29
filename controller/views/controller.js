var debug   = require( 'debug' )( 'VIEWS/CONTROLLER' );

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *() {
  this.body = yield this.render(
                      this.params[ 0 ]
                    );
};


module.exports = new Controller();
