/*! tabella - v0.0.1 - 2014-12-22
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
//TabellaBuilder constructor ... just an empty function
	function TabellaBuilder(){}


	TabellaBuilder.prototype.setUpPeriods = function(options, container, cellWidth){
		
		var periods = options.periods;

		var docfrag = document.createDocumentFragment();

		if(periods instanceof Array && periods.length){

			var numberOfPeriods = periods.length;

			var tRow = createHTMLEl('div', 't-row', docfrag);

			var tRowContent = createHTMLEl('div', 't-row-content', tRow);

			tRowContent.style.width = cellWidth * (numberOfPeriods + 1) + 'px';
			
			var tRowDescHTML = '<div class="t-element">';
				tRowDescHTML +='<div class="t-cell-desc-l">';
				tRowDescHTML += options.from;
				tRowDescHTML += '<br>';
				tRowDescHTML += options.to;
				tRowDescHTML += '</div>';
				tRowDescHTML += '</div>';  

			var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

			tRowDesc.style.width = cellWidth + 'px';

			var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

			tRowValues.style.width = cellWidth * numberOfPeriods + 'px';

			for(var i = 0; i < numberOfPeriods; i++){

				var tRowCell = document.createElement('div');
				tRowCell.className = 't-row-cell';
				tRowCell.style.width = cellWidth + 'px';

				//From - to Div	
				var periodHTML = '<div class="t-cell-desc-s">';
					periodHTML += options.from;
				if(typeof periods[i][1] !== 'undefined'){	
					periodHTML += '<br>';
					periodHTML += options.to;
				}	
					periodHTML += '</div>'; 	

				//Period actual dates
				periodHTML += '<div class="t-cell-value">';
				periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
				if(typeof periods[i][1] !== 'undefined'){
					periodHTML += '<br>';
					periodHTML += periods[i][1];
				}
				periodHTML += '</div>'; 

				var tEl = createHTMLEl( 'div', 't-element', tRowCell, periodHTML);

				tRowValues.appendChild(tRowCell);

			}

			container.appendChild(docfrag);

			return tRow;

		}else{
			return false;
		}
	};	

	TabellaBuilder.prototype.setUpRows = function (options, container, cellWidth){

		var periods = options.periods,
			rows = options.rows,
			numberOfPeriods = periods.length,
			numberOfRows = rows.length;

		var docfrag = document.createDocumentFragment();

		if(numberOfRows > 0){

				var matchingPeriodCells = true;

				for(var i = 0; i < numberOfRows; i++){

					if(!matchingPeriodCells) break;

					var tRow = createHTMLEl('div', 't-row', docfrag);
				
					if(!!rows[i].desc){
						var tHeader = createHTMLEl('section','t-row-header', tRow, rows[i].desc);
					}

					if(!!rows[i].prices){

						var tRowContent = createHTMLEl('div', 't-row-content', tRow);

						tRowContent.style.width = cellWidth * (numberOfPeriods + 1) + 'px';

						for(var j = 0; j < rows[i].prices.length; j++){

							if(!matchingPeriodCells) break;

							var tRowDescHTML = '<div class="t-element">';
								tRowDescHTML +='<div class="t-cell-desc-l">';
								tRowDescHTML += rows[i].pricesDesc[j];
								tRowDescHTML += '</div>';
								tRowDescHTML += '</div>';  

							var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

							tRowDesc.style.width = cellWidth + 'px';

							var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);
							tRowValues.style.width = cellWidth * numberOfPeriods + 'px';
						
							for(var k = 0; k < rows[i].prices[j].length; k++){

								if(rows[i].prices[j].length === numberOfPeriods){
									var tRowCell = document.createElement('div');

									var cellClass = 't-row-cell';
									if(j >= 1) cellClass += ' cell-border-top';

									tRowCell.className = cellClass;
									tRowCell.style.width = cellWidth + 'px';

									var cellHTML = '';

									//Cell description
									if(!!rows[i].pricesDesc[j]){
										cellHTML += '<div class="t-cell-desc-s">';
										if(!!rows[i].pricesDesc[j][k]){
											cellHTML += rows[i].pricesDesc[j][k];
										}else{
											if(!!rows[i].pricesDesc[j][0])
												cellHTML += rows[i].pricesDesc[j][0];
										}
										
										cellHTML += '</div>';
									}	

									//Item current price
									cellHTML += '<div class="t-cell-value">';
									cellHTML += typeof  rows[i].prices[j][k] !== 'undefined' ?  rows[i].prices[j][k] : 'not set';
									cellHTML += ' ' + options.currency;
									cellHTML+= '</div>'; 


									var tEl = createHTMLEl('div', 't-element', tRowCell, cellHTML);

									tRowValues.appendChild(tRowCell);
								
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

	};

	TabellaBuilder.prototype.setUpArrows = function(options, container, periodRow){
		//TODO
	};

	TabellaBuilder.prototype.attachEvents = function(){
		//TODO
	};

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
			switchLayout : 1,
			descCellWidth : 200,
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
	
	var self = this;

	if(self.options.periods !== null && self.options.rows !== null){

		self.cellWidth = self.getCellWidth();	

		self.periodRow = TabellaBuilder.prototype.setUpPeriods(self.options, self.el, self.cellWidth, self.el.clientWidth);

		if(self.periodRow){
	
			if(TabellaBuilder.prototype.setUpRows(self.options, self.el, self.cellWidth, self.el.clientWidth)){

				TabellaBuilder.prototype.setUpArrows(self.options, self.el, self.periodRow);

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
	

		//self.init();

	//Close Tabella constructor
	}

Tabella.prototype.refreshSize = function(){
	var self = this;
	//console.log(self.options);
	return self.options;
};

Tabella.prototype.getCellWidth = function(){
			var self = this,
				//Number of cells = number of periods + 1 cell for descriptions
				//numberOfCells = self.options.periods.length + 1,
				numberOfCells = self.options.periods.length,
				breakpoint,
				cellWidth;

			breakpoint = self.getBreakpoint();

			if(breakpoint[1] > numberOfCells ){
				cellWidth = self.el.clientWidth / numberOfCells;
			}else{
				cellWidth = self.el.clientWidth / breakpoint[1];
			}
			
			//console.log(cellWidth);
			//console.log(self.el.clientWidth);

			return Math.round(cellWidth);
		};

Tabella.prototype.getBreakpoint = function(){

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

	return Tabella;
});