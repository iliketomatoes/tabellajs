/*! tabella - v0.0.1 - 2014-12-15
* https://github.com/iliketomatoes/tabellajs
* Copyright (c) 2014 ; Licensed  */
;(function(Tabella) {

	'use strict';
	
	if (typeof define === 'function' && define.amd) {
        	// Register Tabella as an AMD module
        	define(Tabella);
	} else {
        	// Register elba on window
        	window.Tabella = Tabella;
	}

})(function () {

	'use strict';

function extend( a, b ) {
	for( var key in b ) { 
		if( b.hasOwnProperty( key ) ) {
			a[key] = b[key];
		}
	}
	return a;
}

//http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
function getSupportedTransform() {
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
    for(var i = 0; i < prefixes.length; i++) {
        if(document.createElement('div').style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
}
function Tabella(el, options){

	


	this.test = 'ciao';
}

return Tabella;
});