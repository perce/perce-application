


var debug    = require( 'debug' )( 'USER/USER' );
var crypto   = require( 'crypto' );
var thunkify = require('thunkify');
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
 * Create user in connected CouchDB
 *
 * @param  {Object}       post post params
 * @return {Object|false}      false if it was not possible
 *                                   to create a user and or
 *                                   created user document
 */
User.prototype.create = function ( post ) {
  var salt = crypto.randomBytes( 1024 ).toString( 'hex' ),
      document;

  if (
    post.email &&
    post.password
  ) {
    document = db.document();
    document.body( {
      email : post.email,
      salt  : salt,
      hash  : crypto.createHmac( 'sha256', salt )
                    .update( post.password + '!' + salt )
                    .digest( 'hex' )
    } );

    return ( thunkify( document.save ).bind( document ) )();
  } else {
    return false;
  }
}


module.exports = new User();
