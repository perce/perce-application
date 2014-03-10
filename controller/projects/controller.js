var debug   = require( 'debug' )( 'PROJECTS/CONTROLLER' );
var assets  = require( '../../lib/assets/assetsLoader.js' );
var parse   = require( 'co-body' );
var project = require( '../../lib/project/project' );
var session = require( '../../lib/session/session' );
var emitter = require( '../../lib/emitter/emitter' );


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
    var projects = yield project.getProjectsForUser( this.user.id );

    this.status = 200;
    this.body   = projects;
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
  var projectDoc = yield project.create( post, this.user );

  if ( typeof projectDoc === 'object' ) {
    this.status = 201;
    this.body = {
      doc : {
        _id  : projectDoc._id,
        name : projectDoc._body.name,
        url  : projectDoc._body.url
      }
    }
  } else {
    // show error message
    this.status = 403;
    this.body   = {
      error : projectDoc
    };
  }
};


module.exports = new Controller();
