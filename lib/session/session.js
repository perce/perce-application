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
        cookieObject.u !== ANON_COOKIE // TODO MAKE CONSTANT OUT OF IT!!!!
      ) {
        token = yield redis.get(cookieObject.u + ';' + cookieObject.t);
        hash = crypto
          .createHmac('sha256', token)
          .update([cookieObject.u, cookieObject.t, token].join(';'))
          .digest('hex');

        if (hash !== cookieObject.h) {
          // hash at user cookie is wrong, so send him not authorized and
          // delete his cookie
          this.redirect('/');
        } else {
          yield Session.prototype.set.apply( this, [ this, cookieObject.u ] );

          yield next;
        }
      } else {
        console.log( 'wrong user' );
        this.redirect('/login');
      }
    } else {
      debug('REDIRECTING TO \'/\'');
      this.redirect('/');
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
