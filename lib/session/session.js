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
  var cookie = this.cookies.get( 'session' ),
      cookieObject,
      currentTime,
      token;

  // check if cookie is set
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


  // CHECK IF SECURE OR NOT
  //
  // if not secure
  //
  // TODO PUT IT IN CONFIG
  if ( !/dashboard/.test( this.request.url ) ) {
    currentTime = (new Date()).toISOString(),
    token = crypto.randomBytes(1024).toString('hex');

    // save in redis and then create the cookie
    yield redis.set(cookieObject.u + ';' + currentTime, token, 'EX', '900');

    this.cookies.set('session', JSON.stringify({
      'u' : cookieObject.u,
      't' : currentTime,
      'h' : crypto
            .createHmac('sha256', token)
            .update([cookieObject.u, currentTime, token].join(';'))
            .digest('hex')
    } ) );

    yield next;

  } else {
    if ( cookie ) {
      if (
        cookieObject.u &&
        cookieObject.t &&
        cookieObject.h &&
        cookieObject.u !== ANON_COOKIE
      ) {
        token = yield redis.get( cookieObject.u + ';' + cookieObject.t );

        if ( token ) {
          hash = crypto
            .createHmac( 'sha256', token )
            .update( [cookieObject.u, cookieObject.t, token ].join( ';' ) )
            .digest( 'hex');

          if ( hash !== cookieObject.h ) {
            // hash at user cookie is wrong, so send him not authorized and
            // delete his cookie
            this.cookies.set( 'session', '' );
            this.redirect( '/' );
          } else {
            yield Session.prototype.set.apply( this, [ this, cookieObject.u ] );

            yield next;
          }
        } else {
          yield Session.prototype._handleRedirect.call( this, '/login' );
        }
      } else {
        yield Session.prototype._handleRedirect.call( this, '/login' );
      }
    } else {
      yield Session.prototype._handleRedirect.call( this, '/' );
    }
  }
};


/**
 * TODO!!!
 * [set description]
 * @type {[type]}
 */
Session.prototype.set = function *( req, user ) {
  var currentTime = (new Date()).toISOString(),
      token       = crypto.randomBytes(1024).toString('hex');

  // save in redis and then create the cookie
  yield redis.set( user + ';' + currentTime, token, 'EX', '900' );

  req.cookies.set('session', JSON.stringify({
    'u': user,
    't': currentTime,
    'h': crypto
      .createHmac('sha256', token)
      .update([user, currentTime, token].join(';'))
      .digest('hex')
  }));
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
  var cookie = req.cookies.get('session'),
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
