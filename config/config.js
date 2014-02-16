

var config = {};

/**
 * ROUTES DEFINITIONS
 */
config.routes = {};

/**
 * Index routes
 * @type {Object}
 */
config.routes.index = {
  get : [ '/', '/howitworks', '/features', '/contact', '/user', '/login' ],
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
  post : '/login'
};


/**
 * Customer routes
 * @type {Object}
 */
config.routes.user = {
  post  : '/user'
};


/**
 * Dashboard routes
 * @type {Object}
 */
config.routes.dashboard = {
  get : '/dashboard'
};


//
// Couch
//
config.couchdb = {
  user     : 'perce',
  password : 'perce'
};




module.exports = config;
