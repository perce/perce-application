

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

/**
 * Constructor
 */
var Project = function() {};


/**
 * Create user
 *
 * @param  {Object}       post   post params
 * @param  {String}       userId userId
 * @return {Object|false}      false if it was not possible
 *   to create a user and or created user document
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


Project.prototype.getProjectsForUser = function *( userId ) {
  var view = thunkify( db.view ).bind( db );

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
