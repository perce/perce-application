/**
 * Module dependencies.
 */

var crypto     = require('crypto');
var debug      = require('debug')('INDEX');
var koa        = require('koa');
var logger     = require('koa-logger');
var parse      = require('co-body');
var redis      = require('co-redis')(require('redis').createClient());
var render     = require('./lib/render');
var route      = require('koa-route');
var views      = require('co-views');

var app    = koa();
// "database"

var posts = [];

// middleware

// logger
// app.use(logger());


app.name = 'koa-session-test';

app.use(function *(next) {
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
});

app.use(function *(next) {
  var username = 'foobar', // just a placeholder
      currentTime,
      token;

  if (this.request.url === '/') {
    currentTime = (new Date()).toISOString(),
    token = crypto.randomBytes(1024).toString('hex');

    // save in redis and then create the cookie
    yield redis.set(username + ';' + currentTime, token, 'EX', '900');
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
});


// route middleware

app.use(route.get('/', list));
app.use(route.get('/post/new', add));
app.use(route.get('/post/:id', show));
app.use(route.post('/post', create));
app.use(route.get('/safe_url', function *() {
  this.body = 'secured area';
}));

// route definitions

/**
 * Post listing.
 */

function *list() {
  this.body = yield render('list', { posts: posts });
}

/**
 * Show creation form.
 */

function *add() {
  this.body = yield render('new');
}

/**
 * Show post :id.
 */

function *show(id) {
  var post = posts[id];
  if (!post) this.throw(404, 'invalid post id');
  this.body = yield render('show', { post: post });
}

/**
 * Create a post.
 */

function *create() {
  var post = yield parse(this);
  var id = posts.push(post) - 1;
  post.created_at = new Date;
  post.id = id;
  this.redirect('/');
}


// listen
app.listen(3000, function() {
  console.log('listening on port 3000');
});
