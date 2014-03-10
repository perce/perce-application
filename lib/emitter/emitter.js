var debug   = require( 'debug' )( 'EMITTER/EMITTER' );
var emitter = new ( require('events').EventEmitter )();

function Emitter () {};

/**
 * Wrap native event emitter functions
 * to use it as a singleton without
 * carrying it areound all the time
 */
Emitter.prototype.emit = function() {
  emitter.emit.apply( emitter, arguments );
};


/**
 * Wrap native event emitter functions
 * to use it as a singleton without
 * carrying it areound all the time
 */
Emitter.prototype.on = function() {
  emitter.on.apply( emitter, arguments );
};


module.exports = new Emitter();
