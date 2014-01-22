var debug   = require('debug')('LOGIN/CONTROLLER');
var session = require('../../lib/session/session');

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *index(next) {
  this.body = 'login/get';
};

Controller.prototype.post = function *index(next) {
  this.body = 'login/post';
};

module.exports = new Controller();
