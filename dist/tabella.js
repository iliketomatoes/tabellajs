/*! tabella - v0.0.1 - 2014-12-18
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
				small : [360,2],
				medium : [640,3],
				large : [820,4],
				xlarge : [1080,5]
			},
			from : 'from',
			to : 'to',
			borderWidth : 1,
			currency : '&euro;'
		};

		this.periodRow = null;

		//Initialize the current breakpoint to the minimum breakpoint
		this.currentBreakpoint = [0,1];
		this.cellWidth = 0;

		this.el = el;

		
		if(typeof el !== 'undefined'){
			if(typeof options !== 'undefined'){
				this.options = extend(this.defaults, options);
				}else{
				throw new TabellaException('You did not pass any options to the constructor');
			}
		}else{
				throw new TabellaException('You did not pass a valid target element to the constructor');
			}		

		

		
		
		function _setUpPeriods(options, container, cellWidth){
			
			var periods = options.periods;

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var periodWrapper = document.createElement('div');
				periodWrapper.className = 'period-wrapper';
				container.appendChild(periodWrapper);

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				periodRow.style.width = cellWidth * numberOfPeriods + 'px';
				periodWrapper.appendChild(periodRow);

				for(var i = 0; i < numberOfPeriods; i++){

					var periodCell = document.createElement('div');
					periodCell.className = 'period-cell';
					periodCell.style.width = cellWidth + 'px';

					var periodEl = document.createElement('div');
						periodEl.className = 'period-element';

					//From - to Div	
					var periodHTML = '<div class="period-fromto">';
						periodHTML += options.from;
					if(typeof periods[i][1] !== 'undefined'){	
						periodHTML += '<br>';
						periodHTML += options.to;
					}	
						periodHTML += '</div>'; 	

					//Period actual dates
					periodHTML += '<div class="period-date">';
					periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					if(typeof periods[i][1] !== 'undefined'){
						periodHTML += '<br>';
						periodHTML += periods[i][1];
					}
					periodHTML += '</div>'; 

					periodEl.innerHTML = periodHTML;

					periodCell.appendChild(periodEl);

					periodRow.appendChild(periodCell);

				}

				return periodRow;

			}else{
				return false;
			}
		}	

		function _setUpRows(options, container, cellWidth){

			var periods = options.periods,
				rows = options.rows,
				numberOfPeriods = periods.length,
				numberOfRows = rows.length;

			if(numberOfRows > 0){

					var matchingPeriodCells = true;

					for(var i = 0; i < numberOfRows; i++){

						if(!matchingPeriodCells) break;

						var itemWrapper = document.createElement('div');
						itemWrapper.className = 'item-wrapper';
						container.appendChild(itemWrapper);
	
						if(!!rows[i].desc){
							var itemDesc = document.createElement('section');
							itemDesc.className = 'item-desc';
							itemDesc.innerHTML = rows[i].desc;
							itemWrapper.appendChild(itemDesc);
						}

						if(!!rows[i].prices){

							for(var j = 0; j < rows[i].prices.length; j++){

								if(!matchingPeriodCells) break;

								var itemRow = document.createElement('div');
								itemRow.className = 'item-row';
								itemRow.style.width = cellWidth * numberOfPeriods + 'px';
								itemWrapper.appendChild(itemRow);

								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var itemCell = document.createElement('div');

										var itemClass = 'item-cell';
										if(j >= 1) itemClass += ' cell-border-top';

										itemCell.className = itemClass;
										itemCell.style.width = cellWidth + 'px';

										var itemEl = document.createElement('div');
										itemEl.className = 'item-element';

										var itemHTML = '';

										//Cell description
										if(!!rows[i].pricesDesc[j]){
											itemHTML += '<div class="item-cell-desc">';
											if(!!rows[i].pricesDesc[j][k]){
												itemHTML += rows[i].pricesDesc[j][k];
											}else{
												if(!!rows[i].pricesDesc[j][0])
													itemHTML += rows[i].pricesDesc[j][0];
											}
											
											itemHTML += '</div>';
										}	

										//Item current price
										itemHTML += '<div class="item-value">';
										itemHTML += typeof  rows[i].prices[j][k] !== 'undefined' ?  rows[i].prices[j][k] : 'not set';
										itemHTML += ' ' + options.currency;
										itemHTML+= '</div>'; 

										itemEl.innerHTML = itemHTML;

										itemCell.appendChild(itemEl);

										itemRow.appendChild(itemCell);
									
									}else{
										matchingPeriodCells = false;
										break;
									}
								}
							}
						}
					}

				return matchingPeriodCells;	

			}else{

				return false;

			}

		}

		function _setUpArrows(options, container, periodRow){
			//TODO
		}

		function _attachEvents(){
			//TODO
		}

		this.getBreakpoint = function(){

			var self = this,
				minWidth = 0,
				containerWidth = self.el.clientWidth,
				breakpoints = self.options.breakpoints;
			 

			for(var bp in breakpoints){

				var bpWidth = breakpoints[bp][0];

				if(typeof bpWidth === 'number' &&  bpWidth > 0 && bpWidth <= containerWidth){

					if(Math.abs(containerWidth - bpWidth) < Math.abs(containerWidth - minWidth)){
						minWidth = bpWidth;
						self.currentBreakpoint = breakpoints[bp];
					}

				}

			}

			return self.currentBreakpoint;
		};

		this.getCellWidth = function(){
			var self = this,
				numberOfPeriods = self.options.periods.length,
				breakpoint,
				cellWidth;

			breakpoint = self.getBreakpoint();

			console.log(self.el.parentNode.clientWidth);

			if(breakpoint[1] > numberOfPeriods){
				cellWidth = self.el.clientWidth / numberOfPeriods;
			}else{
				cellWidth = self.el.clientWidth / breakpoint[1];
			}
			
			console.log(cellWidth);
			console.log(self.el.clientWidth);

			return Math.round(cellWidth);
		};




	

	if(this.options.periods !== null && this.options.rows !== null){

		this.cellWidth = this.getCellWidth();	

		this.periodRow = _setUpPeriods(this.options, this.el, this.cellWidth, this.el.clientWidth);

		if(this.periodRow){
	
			if(_setUpRows(this.options, this.el, this.cellWidth, this.el.clientWidth)){

				_setUpArrows(this.options, this.el, this.periodRow);

				var self = this;

				window.onload = function(){
					self.refreshSize();
					};

			}else{
				throw new TabellaException('There is a mismatch between periods and prices cells');
			}
		}else{
			throw new TabellaException('Periods is not an Array');
		}
		
	}else{
		throw new TabellaException('Periods or rows are null');
	}
	

		//this.init();

	//Close Tabella constructor
	}
Tabella.prototype.refreshSize = function(){
	var self = this;
	console.log(self);
	console.log(self.periodRow);

};

	return Tabella;
});