

var debug    = require( 'debug' )( 'USER/USER' );
var crypto   = require( 'crypto' );
var thunkify = require( 'thunkify' );
var cushion  = new (require('cushion').Connection)(
                  '127.0.0.1',
                  5984,
                  'stefan',
                  'xxxx'
                );
var db       = cushion.database( 'perce-users' );

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

  if (
    post.email &&
    post.password
  ) {
    var emails = yield view(
                          'emails',
                          'all',
                          { key : '"' + post.email + '"' }
                        );

    if ( !emails[ 1 ].length ) {
      document = db.document();
      document.body( {
        email : post.email,
        salt  : salt,
        hash  : crypto.createHmac( 'sha256', salt )
                      .update( post.password + '!' + salt )
                      .digest( 'hex' )
      } );

      saveResult = yield ( thunkify( document.save ).bind( document ) )();

      return saveResult;
    } else {
      debug( 'EMAIL ALREADY REGISTERED!!!!' );
      return false;
    }
  } else {
    debug( 'EMAIL && PASSWORD NOT THERE!!!!' );
    return false;
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
                      'emails',
                      'all',
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
