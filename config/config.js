

var config = {};

/**
 * ROUTES DEFINITIONS
 */
config.routes = {};


/**
 * account routes
 * @type {Object}
 */
config.routes.account = {
  get : [ '/account' ],
};


/**
 * Index routes
 * @type {Object}
 */
config.routes.index = {
  get : [
    '/',
    '/howitworks',
    '/features',
    '/contact',
    '/user',
    '/user/:hash',
    '/login'
  ],
};


/**
 * Angular templates
 * @type {Object}
 */
config.routes.views = {
  get : [ /views\/(.*).html/i ]
};


/**
 * Security routes
 * @type {Object}
 */
config.routes.security = {
  get  : [ '/logout' ],
  post : [ '/login' ]
};


/**
 * Dashboard routes
 * @type {Object}
 */
config.routes.dashboard = {
  get : [ '/dashboard' ]
};


/**
 * Projects routes
 * @type {Object}
 */
config.routes.projects = {
  get  : [ '/projects', '/project/:id', '/project/:id/:action' ],
  post : [ '/projects' ]
};


/**
 * Projects routes
 * @type {Object}
 */
config.routes.projectUsers = {
  post : [ '/projects/:projectId/users' ]
};


/**
 * Customer routes
 * @type {Object}
 */
config.routes.user = {
  post  : [ '/user' ]
};


/**
 * Couch configuration
 * @type {Object}
 */
config.couchdb = {
  user     : 'perce',
  password : 'perce',
  db       : 'perce'
};


/**
 * mandrill configuration
 * @type {Object}
 */
config.mandrill = {
  apiKey : 'rBHsdmQzRI7IxhUvx8cHTg'
}


module.exports = config;
