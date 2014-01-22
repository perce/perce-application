var debug   = require('debug')('DASHBOARD/CONTROLLER');
var session = require('../../lib/session/session');

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *index(next) {
  this.body = 'dashboard/get';
};

module.exports = new Controller();
