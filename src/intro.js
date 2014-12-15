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
