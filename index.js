/**
 * Module dependencies.
 */

var debug    = require('debug')('INDEX');
var koa      = require('koa');
var logger   = require('koa-logger');
var parse    = require('co-body');
var render   = require('./lib/render');
var route    = require('koa-route');
var views    = require('co-views');
var session = require('./lib/session/session');

var app    = koa();
// "database"

var posts = [];

// middleware

// logger
// app.use(logger());

app.name = 'koa-session-test';

// session handling
app.use(session.safeUrl);
app.use(session.url);


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
