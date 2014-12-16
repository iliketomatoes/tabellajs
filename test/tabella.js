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
	
	function TabellaException(value) {			

	   this.value = value;
	   this.message = "Tabella.js error: ";
	   this.toString = function() {
	      return this.message + this.value;
	   };
	}

	function Tabella(el, options){

		this.defaults = {
			periods : null,
			rows : null
		};

		this.periods = null;
		this.rows = null;

		this.el = el;

		try{
			if(typeof el !== 'undefined'){
				if(typeof options !== 'undefined'){
					this.options = extend(this.defaults, options);
				}else{
					throw new TabellaException('You did not pass any options to the constructor');
				}
			}else{
				throw new TabellaException('You did not pass a valid target element to the constructor');
			}		

		}catch(e){
			console.error(e.toString());
			return e;
		}

		
		function _setUpPeriods(periods, container){
			
			if(periods instanceof Array && periods.length){

				var returnedPeriods = [];

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				container.appendChild(periodRow);

				for(var i = 0; i < periods.length; i++){

					console.log(periods[i]);
				}

				return true;

			}else{
				return false;
			}
		}	

		function _setUpRows(periods, rows){

			var returnedRows = [];

			var numberOfPeriods = periods.length;

			var numberOfRows = rows.length;

			if(numberOfRows > 0){

					for(var i = 0; i < numberOfRows; i++){
						for(var prop in rows[i]){

						}
					}

				return true;	

			}else{

				return false;

			}

		}

		try{
			if(this.options.periods !== null && this.options.rows !== null){

				this.periods = _setUpPeriods(this.options.periods, this.el);

				if(this.periods){
					this.rows = _setUpRows(this.options.periods, this.options.rows);

					if(!!this.rows){

					}else{
						throw new TabellaException('There is a mismatch between periods and prices cells');
					}
				}else{
					throw new TabellaException('Periods is not an Array');
				}
				
			}else{
				throw new TabellaException('Periods or rows are null');
			}
		}catch(e){
			console.error(e.toString());
			return e;
		}

		//this.init();

	//Close Tabella constructor
	}

	
	// Register TabellaException on window
    window.TabellaException = TabellaException;

	return Tabella;
});