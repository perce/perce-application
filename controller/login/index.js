var debug   = require( 'debug' )( 'LOGIN/CONTROLLER' );
var session = require( '../../lib/session/session' );
var assets  = require( '../../lib/assets/assetsLoader.js' );
var parse   = require( 'co-body' );
var cushion = new (require( 'cushion' ).Connection )(
                '127.0.0.1',
                5984,
                'stefan',
                'xxxx'
              );
var db      = cushion.database( 'perce-users' );

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *index() {
  this.body = yield this.render(
                        'login/get',
                        {
                          assets : assets
                        }
                      );
};

Controller.prototype.post = function *index() {
  var post = yield parse( this );

  db.allDocuments( function( error, info, allDocs ) {
    debug( JSON.stringify( error ) );
    debug( JSON.stringify( info ) );
    debug( JSON.stringify( allDocs ) );
  } );
};

module.exports = new Controller();
