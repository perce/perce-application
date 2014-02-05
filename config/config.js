

var config = {};

/**
 * ROUTES DEFINITIONS
 */
config.routes = {};

//
// USER ROUTES
//
config.routes.user = {
  index  : '/user',
  create : '/user'
};

//
// DASHBOARD ROUTES
//
config.routes.dashboard = {
  index : '/dashboard'
};

//
// SECURITY ROUTES
//
config.routes.security = {
  login : '/login'
};

//
// Couch
//
config.couchdb = {
  user     : 'perce',
  password : 'perce'
};




module.exports = config;
