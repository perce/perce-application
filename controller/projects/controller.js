var assets  = require( '../../lib/assets/assetsLoader.js' );
var debug   = require( 'debug' )( 'PROJECTS/CONTROLLER' );
var parse   = require( 'co-body' );
var project = require( '../../lib/project/project' );
var session = require( '../../lib/session/session' );


/**
 * Index Controller
 */
var Controller = function() {};

Controller.prototype.isSecure = true;


/**
 * Get
 */
Controller.prototype.get = function *( next ) {
  if ( this.header[ 'perce-ajax' ] === 'true' ) {
    this.status = 200;
    this.body =  [
      { url: 'http://www.natue.com.br', title: 'natue' },
      { url: 'http://www.epicerie.com.br', title: 'epicerie' },
      { url: 'http://www.erie.com.br', title: 'dafiti' },
      { url: 'http://www.yay.com.br', title: 'yay' }
    ];
  } else {
    yield Controller.prototype._getHTML.apply( this, arguments );
  }
};


/**
 * Get for HTML
 */
Controller.prototype._getHTML = function *() {
  this.body = yield this.render(
                      'beast/index',
                      {
                        assets     : assets,
                        isLoggedIn : session.isLoggedIn( this )
                      }
                    );

};


/**
 * Post
 */
Controller.prototype.post = function *( next ) {
  var post = yield parse( this );

  var projectDoc = yield project.create( post, this.userId );

  if ( typeof projectDoc === 'object' ) {
    this.status = 201;
  } else {
    // show error message
    this.status = 403;
    this.body   = {
      error : projectDoc
    };
  }
};


module.exports = new Controller();