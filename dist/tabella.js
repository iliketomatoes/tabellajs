/*! tabella - v0.0.1 - 2014-12-16
* https://github.com/iliketomatoes/tabellajs
* Copyright (c) 2014 ; Licensed  */
;(function(tabella) {

	'use strict';
	
	if (typeof define === 'function' && define.amd) {
        	// Register Tabella as an AMD module
        	define(tabella);
	} else {
        	// Register Tabella on window
        	window.Tabella = tabella();
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

		this.defaults = {
			periods : null,
			rows : null
		};

		this.rows = null;

		this.el = el;

		this.options = extend(this.defaults, options);

		function _setUpRows(periods, rows){

			var returnedRows = [];

			var numberOfPeriods = periods.length;

			var numberOfRows = rows.length;

			if(numberOfRows > 0){

				

			}

		}

		this.init = function(){
			var self = this;

			self.rows = _setUpRows(self.options.periods, self.options.rows[0]);

			console.log(self.rows);

		};

		this.init();

	//Close Tabella constructor
	}


	return Tabella;
});