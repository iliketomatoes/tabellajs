/*! tabella - v0.0.1 - 2014-12-17
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
			rows : null,
			/**
			* BREAKPOINTS : 
			* 1st element in array is the breakpoint, 
			* the 2nd is the number of cells to be shown
			* Default breakpoint is from [0,1], just one element is shown
			*/
			breakpoints : {
				small : [300,2],
				medium : [540,3],
				large : [720,4],
				xlarge : [1080,5]
			}
		};

		this.periods = null;
		this.rows = null;

		//Initialize the current breakpoint to the minimum breakpoint
		this.currentBreakpoint = [0,1];
		this.cellWidth = 0;

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

				var returnedPeriods = [],
					numberOfPeriods = periods.length;

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				container.appendChild(periodRow);

				for(var i = 0; i < numberOfPeriods; i++){

					var periodEl = document.createElement('div');
					periodEl.className = 'period-element';

					var periodDesc = typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					
					if(typeof periods[i][1] !== 'undefined'){
						periodDesc += '<br>';
						periodDesc += periods[i][1];
					}

					periodEl.innerHTML = periodDesc;

					periodRow.appendChild(periodEl);

				}

				return true;

			}else{
				return false;
			}
		}	

		function _setUpRows(periods, rows){

			var returnedRows = [],
				numberOfPeriods = periods.length,
				numberOfRows = rows.length;

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

		this.getBreakpoint = function(){

			var self = this,
				minWidth = 0,
				containerWidth = self.el.clientWidth,
				breakpoints = self.options.breakpoints;
			 

			for(var bp in breakpoints){

				var bpWidth = breakpoints[bp][0];

				if(typeof bpWidth === 'number' && bpWidth <= containerWidth){

					if(Math.abs(containerWidth - bpWidth) < Math.abs(containerWidth - minWidth)){
						minWidth = bpWidth;
						self.currentBreakpoint = breakpoints[bp];
					}

				}

			}

			return self.currentBreakpoint;

		};

		this.setSize = function(){
			var self = this,
				numberOfPeriods = self.options.periods.length,
				breakpoint;

			breakpoint = self.getBreakpoint();

		};

		try{
			if(this.options.periods !== null && this.options.rows !== null){

				this.setSize();	

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