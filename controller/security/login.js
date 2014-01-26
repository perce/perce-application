


var debug   = require('debug')('LOGIN/CONTROLLER');
var session = require('../../lib/session/session');
var parse   = require('co-body');
var cushion = new (require('cushion').Connection)(
                '127.0.0.1',
                5984,
                'stefan',
                'xxxx'
              );
var db      = cushion.database('perce-users');

/**
 * Index Controller
 */
var Controller = function() {};


/**
 * Get
 */
Controller.prototype.get = function *index( next ) {
  this.body = yield this.render('security/login');
};

Controller.prototype.post = function *index( next ) {
  var post = yield parse(this);

  db.allDocuments(function( error, info, allDocs ) {
    debug( JSON.stringify( error ) );
    debug( JSON.stringify( info ) );
    debug( JSON.stringify( allDocs ) );
  } );



  // // ENCRYPT FOR SURE!!!! AND CHECKKK!!!!!!
  // if ( post.name === 'stefan' && post.password === 'xxxx' ) {
  //   yield session.set( this, post.name );

  //   this.redirect( '/dashboard' );
  // } else {
  //   this.redirect( '/login' );
  // }
};

module.exports = new Controller();
