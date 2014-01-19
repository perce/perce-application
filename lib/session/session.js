var crypto  = require('crypto');
var redis   = require('co-redis')(require('redis').createClient());
var debug   = require('debug')('SESSION/SESSION');
var Session = function() {};


Session.prototype.safeUrl = function *(next) {
  var cookie = this.cookies.get('session'),
      token;

  if (this.request.url === '/safe_url' && cookie) {
    cookie = JSON.parse(cookie);

    if (cookie.u && cookie.t && cookie.h) {
      token = yield redis.get(cookie.u + ';' + cookie.t);
      hash = crypto
        .createHmac('sha256', token)
        .update([cookie.u, cookie.t, token].join(';'), 'hex')
        .digest('hex');

      if (hash !== cookie.h) {
        // hash at user cookie is wrong, so send him not authorized and
        // delete his cookie
        console.log('wrong hash');
      } else {
        console.log('correct cookie');
        yield next;
      }
    }
  } else {
    // not secured url
    yield next;
  }
}

Session.prototype.url = function *(next) {
  var username = 'guest', // just a placeholder
      currentTime,
      token;

  if (this.request.url === '/') {
    currentTime = (new Date()).toISOString(),
    token = crypto.randomBytes(1024).toString('hex');

    // save in redis and then create the cookie
    yield redis.set(username + ';' + currentTime, token, 'EX', '900');

    debug( [username, currentTime, token].join(';') )
    this.cookies.set('session', JSON.stringify({
      'u': username,
      't': currentTime,
      'h': crypto
        .createHmac('sha256', token)
        .update([username, currentTime, token].join(';'), 'hex')
        .digest('hex')
    }));
  }

  // go to next thing to do
  yield next;
}

module.exports = new Session();
