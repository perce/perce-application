var debug   = require('debug')('SESSION/SESSION');
var crypto  = require('crypto');
var redis   = require('co-redis')(require('redis').createClient());
var Session = function() {};

var ANON_COOKIE = 'anonyPerce';


/**
 * TODO!!!
 * [handle description]
 * @type {[type]}
 */
Session.prototype.handle = function *( next ) {
  var cookie         = this.cookies.get( 'session' ),
      expirationDate = new Date(),
      cookieObject,
      currentTime,
      token;

  // set cookie expiration date
  // in 15 minutes
  expirationDate.setMinutes( expirationDate.getMinutes() + 15 );

  // check if cookie is set
  // TODO put that in function
  if ( cookie ) {
    try {
      cookieObject = JSON.parse( cookie );
    } catch( e ) {
      cookieObject = {
        u : ANON_COOKIE
      };
    }
  } else {
    cookieObject = {
      u : ANON_COOKIE
    };
  }


  currentTime = (new Date()).toISOString(),
  token = crypto.randomBytes(1024).toString('hex');

  if (
    cookieObject.u &&
    cookieObject.t &&
    cookieObject.h &&
    cookieObject.u !== ANON_COOKIE
  ) {
    redisEntry = JSON.parse(
      yield redis.get( cookieObject.u + ';' + cookieObject.t )
    );

    if ( redisEntry ) {
      hash = crypto
        .createHmac( 'sha256', redisEntry.token )
        .update( [cookieObject.u, cookieObject.t, redisEntry.token ].join( ';' ) )
        .digest( 'hex');

      if ( hash !== cookieObject.h ) {
        // hash at user cookie is wrong, so send him not authorized and
        // delete his cookie
        this.cookies.set( 'session', '' );
        this.redirect( '/' );
      } else {
        yield Session.prototype.set.apply(
                this,
                [ this, cookieObject.u, redisEntry.email ]
              );

        yield next;
      }
    } else {
      yield Session.prototype.set.apply( this, [ this, cookieObject.u ] );
    }
  } else {
    yield Session.prototype.set.apply( this, [ this, cookieObject.u ] );
    yield next;
  }
}


Session.prototype.handleSecure = function *( next ) {
  var cookie         = this.cookies.get( 'session' ),
      expirationDate = new Date(),
      cookieObject,
      currentTime,
      redisEntry;

  // set cookie expiration date
  // in 15 minutes
  expirationDate.setMinutes( expirationDate.getMinutes() + 15 );

  // check if cookie is set
  // TODO put that in function
  if ( cookie ) {
    try {
      cookieObject = JSON.parse( cookie );
    } catch( e ) {
      cookieObject = {
        u : ANON_COOKIE
      };
    }
  } else {
    cookieObject = {
      u : ANON_COOKIE
    };
  }


  if (
    cookieObject.u &&
    cookieObject.t &&
    cookieObject.h &&
    cookieObject.u !== ANON_COOKIE
  ) {
    redisEntry = JSON.parse(
      yield redis.get( cookieObject.u + ';' + cookieObject.t )
    );

    if ( redisEntry ) {
      hash = crypto
        .createHmac( 'sha256', redisEntry.token )
        .update( [cookieObject.u, cookieObject.t, redisEntry.token ].join( ';' ) )
        .digest( 'hex');

      if ( hash !== cookieObject.h ) {
        // hash at user cookie is wrong, so send him not authorized and
        // delete his cookie
        this.cookies.set( 'session', '' );
        this.redirect( '/' );
      } else {
        yield Session.prototype.set.apply(
          this, [ this, cookieObject.u, redisEntry.email ]
        );

        yield next;
      }
    } else {
      yield Session.prototype._handleRedirect.call( this, '/login' );
    }
  } else {
    yield Session.prototype._handleRedirect.call( this, '/login' );
  }
};



/**
 * TODO!!!
 * [set description]
 * @type {[type]}
 */
Session.prototype.set = function *( req, userId, userEmail ) {
  var currentTime    = (new Date()).toISOString(),
      token          = crypto.randomBytes(1024).toString('hex'),
      expirationDate = new Date();


  // set cookie expiration date
  // in 15 minutes
  expirationDate.setMinutes( expirationDate.getMinutes() + 15 );

  // save in redis and then create the cookie
  yield redis.set(
    userId + ';' + currentTime,
    JSON.stringify( {
      token : token,
      email : userEmail
    } ),
    'EX',
    '900'
  );

  // set user into request to read it later
  this.user = {
    id    : userId,
    email : userEmail
  }

  req.cookies.set(
    'session',
    JSON.stringify({
      'u': userId,
      't': currentTime,
      'h': crypto
        .createHmac('sha256', token)
        .update( [ userId, currentTime, token ].join( ';' ) )
        .digest('hex')
    }),
    {
      expires : expirationDate
    }
  );
};


/**
 * Handle requests that are not allowed
 * to enter the dashboard area...
 *
 * To not blow up our holy angular app ( with redirects - infinite loop ),
 * we detect if it is an request made by and and send
 * a normal 'forbidden' if so
 */
Session.prototype._handleRedirect = function *( url ) {
  if ( this.header[ 'perce-ajax' ] === 'true' ) {
    debug(
      'SENDING FORBIDDEN STATUS FOR NOT AUTHORIZED PERCE AJAX ACTION'
    );

    this.status = 403;
  } else {
    debug(
      'SENDING REDIRECT FOR NOT AUTHORIZED REQUEST'
    );

    this.redirect( url );
  }
}


/**
 * [isLoggedIn description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
Session.prototype.isLoggedIn = function( req ) {
  var cookie = req.cookies.get( 'session' ),
      cookieObject;

  // check if cookie is set
  if ( cookie ) {
    try {
      cookieObject = JSON.parse(cookie);
    } catch( e ) {
      return false;
    }
  } else {
    return false;
  }

  if ( cookieObject.u === ANON_COOKIE ) {
    return false;
  }

  return true;
};


module.exports = new Session();
