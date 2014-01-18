
/**
 * Module dependencies.
 */

var debug      = require('debug')('INDEX');
var koa        = require('koa');
var logger     = require('koa-logger');
var parse      = require('co-body');
var render     = require('./lib/render');
var route      = require('koa-route');
var session    = require('koa-session');
var redisStore = require('koa-redis');
var views      = require('co-views');

var app    = koa();
// "database"

var posts = [];

// middleware

// logger
// app.use(logger());

// session
app.name = 'koa-session-test';
app.keys = ['perceeeeeeeee'];
app.use( session( {
  store : redisStore({
    host : '127.0.0.1',
    port : 6379,
    db   : 0
  })
} ) );

app.use(function *(next){
  yield next;
  this.session.set = 'jojojojo';

  if ( this.session.isNew ) {
    debug( 'jojojojojojo' );
  }
});

// route middleware

app.use(route.get('/', list));
app.use(route.get('/post/new', add));
app.use(route.get('/post/:id', show));
app.use(route.post('/post', create));

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

app.listen(3000);
console.log('listening on port 3000');
