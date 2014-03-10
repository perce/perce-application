

var debug    = require( 'debug' )( 'PROJECT/PROJECT' );
var crypto   = require( 'crypto' );
var thunkify = require( 'thunkify' );
var config   = require( '../../config/config' );
var user     = require( '../../lib/user/user' );
var cushion  = new (require('cushion').Connection)(
                  '127.0.0.1',
                  5984,
                  config.couchdb.user,
                  config.couchdb.password
                );
var db       = cushion.database( config.couchdb.db );
var view     = thunkify( db.view ).bind( db );
var emitter  = require( '../../lib/emitter/emitter' );

/**
 * Constructor
 */
var Project = function() {};


/**
 * Add user to project
 *
 * @param  {String}       projectId project id
 * @param  {String}       userEmail user email
 * @return {Object|String}      String if it was not possible
 *   to create a project or created project document
 */
Project.prototype.addUser = function *( projectId, userEmail ) {
  var userId     = yield view(
                    'users',
                    'emails',
                    { key : '"' + userEmail + '"' }
                  ),
      projectDoc = db.document( projectId ),
      projectUsers,
      userDoc;

  yield ( thunkify( projectDoc.load ).bind( projectDoc ) )();
  projectUsers = projectDoc.body( 'users' );


  // user with given email is already registered
  if ( userId[ 1 ].length ) {

    projectUsers.push( userId[ 1 ][ 0 ].id );
    projectDoc.body( 'users', projectUsers );

    yield ( thunkify( projectDoc.save ).bind( projectDoc ) )();

    emitter.emit(
      'project__addUser',
      userEmail,
      projectDoc._body.name
    );

    return projectDoc.body();
  } else {
    userDoc = yield user.create( {
      email         : userEmail,
      password      : crypto.randomBytes( 1024 ).toString( 'hex' ),
      generatedHash : crypto.randomBytes( 1024 ).toString( 'hex' ).substr( 0, 32 ),
      projectName   : projectDoc._body.name
    } );

    if ( typeof userDoc === 'object' ) {
      projectUsers.push( userDoc._id );
      projectDoc.body( 'users', projectUsers );

      return yield ( thunkify( projectDoc.save ).bind( projectDoc ) )();
    } else {
      return userDoc;
    }
  }
};


/**
 * Create project
 *
 * @param  {Object}       post   post params
 * @param  {Object}       user   user
 * @return {Object|String}       String if it was not possible
 *   to create a project or created project document
 */
Project.prototype.create = function *( post, user ) {
  if (
    post.name &&
    post.url &&
    user.id
  ) {
    var projectDoc = db.document();

    projectDoc.body( {
      name  : post.name,
      url   : post.url,
      type  : 'project',
      users : [ user.id ]
    } );

    yield ( thunkify( projectDoc.save ).bind( projectDoc ) )();

    emitter.emit(
      'project__create',
      user.email,
      projectDoc._body.name
    );

    return projectDoc;
  } else {
    return 'Name || Url || userId was missing';
  }
};


/**
 * Get all projects related to one userId
 *
 * @param {String} userId userId
 * @return {Array} all connected projects
 */
Project.prototype.getProjectsForUser = function *( userId ) {
  projects = yield view(
                      'projects',
                      'users',
                      { key : '"' + userId + '"' }
                    );

  if ( projects[ 1 ].length ) {
    return projects[ 1 ].map( function( row ) {
      return row.value;
    } );
  } else {
    return [];
  }
}

module.exports = new Project();
