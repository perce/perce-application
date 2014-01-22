var debug   = require('debug')('SESSION/SESSION');
var crypto  = require('crypto');
var redis   = require('co-redis')(require('redis').createClient());
var Session = function() {};



Session.prototype.handle = function *(next) {
  var cookie = this.cookies.get('session'),
      cookieObject,
      currentTime,
      token;

  if (cookie) {
    try {
      cookieObject = JSON.parse(cookie);
    } catch(e) {
      cookieObject = {
        u : 'anonymous'
      };
    }
  } else {
    cookieObject = {
      u : 'anonymous'
    };
  }

  if (this.request.url !== '/dashboad' ) {
    currentTime = (new Date()).toISOString(),
    token = crypto.randomBytes(1024).toString('hex');

    // save in redis and then create the cookie
    yield redis.set(cookieObject.u + ';' + currentTime, token, 'EX', '900');

    this.cookies.set('session', JSON.stringify({
      'u': cookieObject.u,
      't': currentTime,
      'h': crypto
        .createHmac('sha256', token)
        .update([cookieObject.u, currentTime, token].join(';'))
        .digest('hex')
    }));

    yield next;
  } else {
    if (cookie) {
      if (
        cookieObject.u &&
        cookieObject.t &&
        cookieObject.h
      ) {
        token = yield redis.get(cookieObject.u + ';' + cookieObject.t);
        hash = crypto
          .createHmac('sha256', token)
          .update([cookieObject.u, cookieObject.t, token].join(';'))
          .digest('hex');

        if (hash !== cookieObject.h) {
          // hash at user cookie is wrong, so send him not authorized and
          // delete his cookie
          console.log('wrong hash');
          this.redirect('/');
        } else {
          console.log('correct cookie');
          yield next;
        }
      }
    } else {
      debug('REDIRECTING TO \'/\'');
      this.redirect('/');
    }
  }
};

module.exports = new Session();
