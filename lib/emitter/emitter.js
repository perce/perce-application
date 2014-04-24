var debug   = require( 'debug' )( 'EMITTER/EMITTER' );
var emitter = new ( require('events').EventEmitter )();

function Emitter () {
  this.timestamp = + new Date();
};

/**
 * Wrap native event emitter functions
 * to use it as a singleton without
 * carrying it areound all the time
 */
Emitter.prototype.emit = function() {
  debug( this.timestamp );
  emitter.emit.apply( emitter, arguments );
};


/**
 * Wrap native event emitter functions
 * to use it as a singleton without
 * carrying it areound all the time
 */
Emitter.prototype.on = function() {
  debug( this.timestamp );
  emitter.on.apply( emitter, arguments );
};

// TODO CHECK THIS!!!!!!
module.exports = new Emitter();
