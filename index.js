/**
 * Module dependencies.
 */

var debug    = require('debug')('INDEX');
var koa      = require('koa');
var logger   = require('koa-logger');
var route    = require('koa-route');
var views    = require('koa-render');
var session  = require('./lib/session/session');

// controller
var index     = require('./controller/index/controller');
var dashboard = require('./controller/dashboard/controller');
var login     = require('./controller/login/controller');


var app    = koa();

// middleware

// logger
app.use(logger());

app.name = 'koa-session-test';

// session handling
app.use(session.handle);

// view handling
app.use(views('./views', 'jade'));

// route middleware

app.use(route.get('/',          index.get));
app.use(route.get('/login',     login.get));
app.use(route.post('/login',    login.post));
app.use(route.get('/dashboard', dashboard.get));

// route definitions

// /**
//  * Post listing.
//  */

// function *list() {
//   this.body = yield render('list', { posts: posts });
// }

// /**
//  * Show creation form.
//  */

// function *add() {
//   this.body = yield render('new');
// }

// /**
//  * Show post :id.
//  */

// function *show(id) {
//   var post = posts[id];
//   if (!post) this.throw(404, 'invalid post id');
//   this.body = yield render('show', { post: post });
// }

// /**
//  * Create a post.
//  */

// function *create() {
//   var post = yield parse(this);
//   var id = posts.push(post) - 1;
//   post.created_at = new Date;
//   post.id = id;
//   this.redirect('/');
// }


// listen
app.listen(3000, function() {
  console.log('listening on port 3000');
});
