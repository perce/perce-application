"use strict";

var busters = require( '../../config/busters.json' );

module.exports = function( path ) {
    return path + ( busters[ 'public' + path ] ? '?' + busters[ 'public' + path ] : '' );
};
