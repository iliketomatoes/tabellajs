/*! tabella - v0.0.1 - 2014-12-20
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

    function createHTMLEl(htmlEl, className, parent, htmlContent){
        var el = document.createElement(htmlEl);
            el.className = className;
            if(!!htmlContent) el.innerHTML = htmlContent;
            parent.appendChild(el);

        return el;    
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

			var docfrag = document.createDocumentFragment();

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var periodWrapper = createHTMLEl('div', 'period-wrapper', docfrag);

				var rowWrapper = createHTMLEl('div', 'row-wrapper', periodWrapper);

				rowWrapper.style.width = cellWidth * (numberOfPeriods + 1) + 'px';
				
				var periodDescHTML = '<div class="period-element">';
					periodDescHTML +='<div class="period-large-fromto">';
					periodDescHTML += options.from;
					periodDescHTML += '<br>';
					periodDescHTML += options.to;
					periodDescHTML += '</div>';
					periodDescHTML += '</div>';  

				var periodDescription = createHTMLEl('div', 'period-description', rowWrapper, periodDescHTML);

				periodDescription.style.width = cellWidth + 'px';

				var periodRow = createHTMLEl('div', 'period-row', rowWrapper);

				periodRow.style.width = cellWidth * numberOfPeriods + 'px';

				for(var i = 0; i < numberOfPeriods; i++){

					var periodCell = document.createElement('div');
					periodCell.className = 'period-cell';
					periodCell.style.width = cellWidth + 'px';

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

					var periodEl = createHTMLEl( 'div', 'period-element', periodCell, periodHTML);

					periodRow.appendChild(periodCell);

				}

				container.appendChild(docfrag);

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

			var docfrag = document.createDocumentFragment();

			if(numberOfRows > 0){

					var matchingPeriodCells = true;

					for(var i = 0; i < numberOfRows; i++){

						if(!matchingPeriodCells) break;

						var itemWrapper = createHTMLEl('div', 'item-wrapper', docfrag);
					
						if(!!rows[i].desc){
							var itemDesc = createHTMLEl('section','item-desc', itemWrapper, rows[i].desc);
						}

						if(!!rows[i].prices){

							for(var j = 0; j < rows[i].prices.length; j++){

								if(!matchingPeriodCells) break;

						
								var itemRow = createHTMLEl('div', 'item-row', itemWrapper);
								itemRow.style.width = cellWidth * numberOfPeriods + 'px';
							
								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var itemCell = document.createElement('div');

										var itemClass = 'item-cell';
										if(j >= 1) itemClass += ' cell-border-top';

										itemCell.className = itemClass;
										itemCell.style.width = cellWidth + 'px';

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


										var itemEl = createHTMLEl('div', 'item-element', itemCell, itemHTML);

										itemRow.appendChild(itemCell);
									
									}else{
										matchingPeriodCells = false;
										break;
									}
								}
							}
						}
					}

				container.appendChild(docfrag);	

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
				//Number of cells = number of periods + 1 cell for descriptions
				numberOfCells = self.options.periods.length + 1,
				breakpoint,
				cellWidth;

			breakpoint = self.getBreakpoint();

			console.log(self.el.parentNode.clientWidth);

			if(breakpoint[1] > numberOfCells ){
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
	
	// Register TabellaException on window
    window.TabellaException = TabellaException;

	return Tabella;
});