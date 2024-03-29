

var debug    = require( 'debug' )( 'USER/USER' );
var crypto   = require( 'crypto' );
var thunkify = require( 'thunkify' );
var config   = require( '../../config/config' );
var cushion  = new (require('cushion').Connection)(
                  '127.0.0.1',
                  5984,
                  config.couchdb.user,
                  config.couchdb.password
                );
var db       = cushion.database( config.couchdb.db );
var emitter  = require( '../../lib/emitter/emitter' );
/**
 * Constructor
 */
var User = function() {};


/**
 * Create user
 *
 * @param  {Object}       post post params
 * @return {Object|false}      false if it was not possible
 *   to create a user and or created user document
 */
User.prototype.create = function *( post ) {
  // iterate over the next() - thingy!!!
  var salt = crypto.randomBytes( 1024 ).toString( 'hex' ),
      view = thunkify( db.view ).bind( db ),
      document,
      emails,
      saveResult;

  if ( post.password.length < 8 ) {
    return 'PASSWORD NOT STRONG ENOUGH';
  }

  if (
    ( new RegExp( "/[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*" ) ).test( post.email )
  ) {
    return 'EMAIL NOT VALID';
  }

  // TODO PUT VALIDATION OF
  // EMAIL AND PASSWORD HERE
  if (
    post.email &&
    post.password
  ) {
    var emails = yield view(
                          'users',
                          'emails',
                          { key : '"' + post.email + '"' }
                        );

    if ( !emails[ 1 ].length ) {
      document = db.document();
      document.body( {
        email         : post.email,
        salt          : salt,
        type          : 'user',
        hash          : crypto.createHmac( 'sha256', salt )
                              .update( post.password + '!' + salt )
                              .digest( 'hex' ),
        generatedHash : post.generatedHash || false
      } );

      // check how the user was created
      // by itself or by invitation
      if ( post.generatedHash && post.projectName ) {
        emitter.emit(
          'user__invitation',
          post.email,
          post.generatedHash,
          post.projectName
        );
      } else {
        emitter.emit(
          'user__signUp',
          post.email
        );
      }

      yield ( thunkify( document.save ).bind( document ) )();

      return document;
    } else {
      return 'EMAIL ALREADY REGISTERED!!!!';
    }
  }


  if (
    post.hash &&
    post.password
  ) {
    var hashes = yield view(
                          'users',
                          'hashes',
                          { key : '"' + post.hash + '"' }
                        );

    // does the hash match?
    if ( !hashes[ 1 ].length ) {
      return 'YOUR HASH IS NOT VALID SORRY';
    } else {
      document = db.document( hashes[ 1 ][ 0 ].id );

      yield ( thunkify( document.load ).bind( document ) )();

      // set generated hash to false
      // and set new password credentials
      document.body( 'generatedHash', false );
      document.body( 'salt', salt );
      document.body(
        'hash',
        crypto.createHmac( 'sha256', salt )
              .update( post.password + '!' + salt )
              .digest( 'hex' )
      );

      // save everything ;)
      yield ( thunkify( document.save ).bind( document ) )();

      // send email to say welcome
      emitter.emit(
        'user__signUp',
        document.body( 'email' )
      );

      return document;
    }
  }
};


/**
 * Login user
 *
 * @param {String} email    email
 * @param {String} password password
 */
User.prototype.authenticate = function *( email, password ) {
  var view = thunkify( db.view ).bind( db ),
      userData = yield view(
                      'users',
                      'emails',
                      { key : '"' + email + '"' }
                    ),
      hash;

  if ( userData[ 1 ].length ) {
    user = userData[ 1 ][ 0 ];

    hash = crypto.createHmac( 'sha256', user.value.salt )
                  .update( password + '!' + user.value.salt )
                  .digest( 'hex' );

    if ( hash === user.value.hash ) {
      debug( 'USER LOGIN DATA CORRECT!' );
      return user.value;
    } else {
      debug( 'USER LOGIN DATA INCORRECT!' );
      return false;
    }
  } else {
    debug( 'USER LOGIN EMAIL NOT FOUND!' );
    return false;
  }
}


module.exports = new User();
