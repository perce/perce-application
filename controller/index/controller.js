var debug   = require('debug')('INDEX/CONTROLLER');
var session = require('../../lib/session/session');

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *index(next) {
  this.body = yield this.render('index');
};

module.exports = new Controller();
