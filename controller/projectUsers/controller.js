var debug   = require( 'debug' )( 'PROJECTUSERS/CONTROLLER' );
var parse   = require( 'co-body' );
var project = require( '../../lib/project/project' );


/**
 * Index Controller
 */
var Controller = function() {};

Controller.prototype.isSecure = true;


/**
 * Post
 */
Controller.prototype.post = function *( next ) {
  var post = yield parse( this ),
      projectDoc;

  if (
    this.header[ 'perce-ajax' ] === 'true' &&
    this.params.projectId &&
    post.email
  ) {
    projectDoc = yield project.addUser(
      this.params.projectId,
      post.email,
      this.emitter
    );

    if ( typeof projectDoc === 'object' ) {
      this.status = 201;
    } else {
      this.status = 401;
      this.body   = {
        error : project
      }
    }
  }
};


module.exports = new Controller();
