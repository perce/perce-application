

var debug    = require( 'debug' )( 'PROJECT/PROJECT' );
var crypto   = require( 'crypto' );
var thunkify = require( 'thunkify' );
var config   = require( '../../config/config' );
var cushion  = new (require('cushion').Connection)(
                  '127.0.0.1',
                  5984,
                  config.couchdb.user,
                  config.couchdb.password
                );
var db       = cushion.database( 'perce-users' );
var view     = thunkify( db.view ).bind( db );

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
                    'emails',
                    'all',
                    { key : '"' + userEmail + '"' }
                  ),
      projectDoc = db.document( projectId ),
      projectUsers;

  // user with given email is already registered
  if ( userId[ 1 ].length ) {
    yield ( thunkify( projectDoc.load ).bind( projectDoc ) )();

    projectUsers = projectDoc.body( 'users' );

    projectUsers.push( userId[ 1 ][ 0 ].id );
    projectDoc.body( 'users', projectUsers );

    debug( JSON.stringify( projectDoc.body(), null, 2 ) );
    debug( JSON.stringify( userId[ 1 ][ 0 ].id, null, 2 ) );

    return yield ( thunkify( projectDoc.save ).bind( projectDoc ) )();
  } else {
    // todo set up handling for not registered users
  }
};


/**
 * Create project
 *
 * @param  {Object}       post   post params
 * @param  {String}       userId userId
 * @return {Object|String}      String if it was not possible
 *   to create a project or created project document
 */
Project.prototype.create = function *( post, userId ) {
  if (
    post.name &&
    post.url &&
    userId
  ) {
    document = db.document();
    document.body( {
      name  : post.name,
      url   : post.url,
      type  : 'project',
      users : [ userId ]
    } );

    saveResult = yield ( thunkify( document.save ).bind( document ) )();

    return saveResult;
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
                      'all',
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
