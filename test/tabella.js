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

    
    /*!
     * classie v1.0.1
     * class helper functions
     * from bonzo https://github.com/ded/bonzo
     * MIT license
     * 
     * classie.has( elem, 'my-class' ) -> true/false
     * classie.add( elem, 'my-new-class' )
     * classie.remove( elem, 'my-unwanted-class' )
     * classie.toggle( elem, 'my-class' )
     */

    /*jshint browser: true, strict: true, undef: true, unused: true */
    /*global define: false, module: false */

    // class helper functions from bonzo https://github.com/ded/bonzo

    function classReg( className ) {
      return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ( 'classList' in document.documentElement ) {
      hasClass = function( elem, c ) {
        return elem.classList.contains( c );
      };
      addClass = function( elem, c ) {
        elem.classList.add( c );
      };
      removeClass = function( elem, c ) {
        elem.classList.remove( c );
      };
    }
    else {
      hasClass = function( elem, c ) {
        return classReg( c ).test( elem.className );
      };
      addClass = function( elem, c ) {
        if ( !hasClass( elem, c ) ) {
          elem.className = elem.className + ' ' + c;
        }
      };
      removeClass = function( elem, c ) {
        elem.className = elem.className.replace( classReg( c ), ' ' );
      };
    }

    function toggleClass( elem, c ) {
      var fn = hasClass( elem, c ) ? removeClass : addClass;
      fn( elem, c );
    }

    var classie = {
      // full names
      hasClass: hasClass,
      addClass: addClass,
      removeClass: removeClass,
      toggleClass: toggleClass,
      // short names
      has: hasClass,
      add: addClass,
      remove: removeClass,
      toggle: toggleClass
    };

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

    function getArray(nodeList){

        return Array.prototype.slice.call(nodeList,0);

    }
	
	function TabellaException(value) {			

	   this.value = value;
	   this.message = "Tabella.js error: ";
	   this.toString = function() {
	      return this.message + this.value;
	   };
	}
//TabellaBuilder constructor
	function TabellaBuilder( options, el ){

		this.options = options;
		this.el = el;

	}


	TabellaBuilder.prototype.setUpPeriods = function(){

		var self = this;
		
		var periods = self.options.periods;

		var docfrag = document.createDocumentFragment();

		if(periods instanceof Array && periods.length){

			var numberOfPeriods = periods.length;

			var tRow = createHTMLEl('div', 't-row', docfrag);

			var tRowContent = createHTMLEl('div', 't-row-content', tRow);

			//tRowContent.style.width = cellWidth * (numberOfPeriods + 1) + 'px';
			
			var tRowDescHTML = '<div class="t-element">';
				tRowDescHTML +='<div class="t-cell-desc-l">';
				tRowDescHTML += self.options.from;
				tRowDescHTML += '<br>';
				tRowDescHTML += self.options.to;
				tRowDescHTML += '</div>';
				tRowDescHTML += '</div>';  

			var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

			//tRowDesc.style.width = cellWidth + 'px';

			var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

			//tRowValues.style.width = cellWidth * numberOfPeriods + 'px';

			for(var i = 0; i < numberOfPeriods; i++){

				var tRowCell = document.createElement('div');
				tRowCell.className = 't-row-cell';
				//tRowCell.style.width = cellWidth + 'px';

				//From - to Div	
				var periodHTML = '<div class="t-cell-desc-s">';
					periodHTML += self.options.from;
				if(typeof periods[i][1] !== 'undefined'){	
					periodHTML += '<br>';
					periodHTML += self.options.to;
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

			self.el.appendChild(docfrag);

			return tRow;

		}else{
			return false;
		}
	};	

	TabellaBuilder.prototype.setUpRows = function (){

		var self = this,
			periods = self.options.periods,
			rows = self.options.rows,
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

						for(var j = 0; j < rows[i].prices.length; j++){

						var tRowContent = createHTMLEl('div', 't-row-content', tRow);

						//tRowContent.style.width = cellWidth * (numberOfPeriods + 1) + 'px';	

							if(!matchingPeriodCells) break;

							var tRowDescHTML = '<div class="t-element">';
								tRowDescHTML +='<div class="t-cell-desc-l">';
								tRowDescHTML += rows[i].pricesDesc[j];
								tRowDescHTML += '</div>';
								tRowDescHTML += '</div>';

							var descClass = 't-row-desc';
							if(j >= 1) descClass += ' t-cell-border-top';	  

							var tRowDesc = createHTMLEl('div', descClass, tRowContent, tRowDescHTML);

							//tRowDesc.style.width = cellWidth + 'px';

							var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);
							//tRowValues.style.width = cellWidth * numberOfPeriods + 'px';
						
							for(var k = 0; k < rows[i].prices[j].length; k++){

								if(rows[i].prices[j].length === numberOfPeriods){
									var tRowCell = document.createElement('div');

									var cellClass = 't-row-cell';
									if(j >= 1) cellClass += ' t-cell-border-top';

									tRowCell.className = cellClass;
									//tRowCell.style.width = cellWidth + 'px';

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
									cellHTML += ' ' + self.options.currency;
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

			self.el.appendChild(docfrag);	

			return matchingPeriodCells;	

		}else{

			return false;

		}

	};

	TabellaBuilder.prototype.setUpArrows = function(){
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
			* 1st element in array is the row width, 
			* the 2nd is the number of cells to be shown
			* Default breakpoint is from [0,1], just one element is shown
			*/
			cellBreakpoints : {
				default : [0,1],
				small : [360,2],
				medium : [640,4],
				large : [820,5],
				xlarge : [1080,6]
			},
			/**
			* DESCRIPTION BREAKPOINTS : 
			* 1st element in array is the row width, 
			* the 2nd is the description cell width,
			* Default breakpoint is from [0,0]
			*/
			descBreakpoints : {
				default : [0,0],
				medium : [460, 160],
				large : [900, 200]
			},
			from : 'from',
			to : 'to',
			borderWidth : 1,
			currency : '&euro;'
		};

		this.periodRow = null;
		//An object that has to hold the cellBreakpoint and descBreakpoint
		this.currentBreakpoint = {};
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

		var builder = new TabellaBuilder(self.options, self.el);
	
		self.periodRow = builder.setUpPeriods();

		if(self.periodRow){
	
			if(builder.setUpRows()){

				builder.setUpArrows();

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
	var self = this,
		breakpoint = self.getBreakpoint();
		console.log(breakpoint);

	var cellWidth = self.getCellWidth(breakpoint),
		descWidth = breakpoint.descBreakpoint[1],
		numberOfPeriods = self.options.periods.length;


	var rows = getArray(self.el.querySelectorAll('.t-row'));

	rows.forEach(function(el){

		var tContent = getArray(el.querySelectorAll('.t-row-content'));

			if(breakpoint.descBreakpoint[1] > 0){

				tContent.forEach(function(el){

					el.style.width = descWidth + (numberOfPeriods * cellWidth) + 'px';

					el.querySelector('.t-row-desc').style.width = descWidth + 'px';

					getArray(el.querySelectorAll('.t-row-cell')).forEach(function(el){

						el.style.width = cellWidth + 'px';

					});

					getArray(el.querySelectorAll('.t-cell-desc-s')).forEach(function(innerEl){
						classie.add(innerEl, 't-hide');
					});

				});	
				
			}else{

				tContent.forEach(function(el){

					el.style.width = (numberOfPeriods * cellWidth) + 'px';

					classie.add(el.querySelector('.t-row-desc'), 't-hide');

					getArray(el.querySelectorAll('.t-row-cell')).forEach(function(el){

						el.style.width = cellWidth + 'px';

					});

					getArray(el.querySelectorAll('.t-cell-desc-s')).forEach(function(innerEl){
						classie.remove(innerEl, 't-hide');
					});

				});

			}
			

	});


	//return self.options;
};

Tabella.prototype.getCellWidth = function(breakpoint){
			var self = this,
				//Number of cells = number of periods + 1 cell for descriptions
				//numberOfCells = self.options.periods.length + 1,
				numberOfCells = self.options.periods.length,
				cellBreakpoint = breakpoint.cellBreakpoint,
				descBreakpoint = breakpoint.descBreakpoint,
				cellWidth;

			if(cellBreakpoint[1] > numberOfCells ){
				cellWidth = (self.el.clientWidth - descBreakpoint[1]) / numberOfCells;
			}else{
				cellWidth = (self.el.clientWidth - descBreakpoint[1]) / cellBreakpoint[1];
			}
			
			//console.log(self.el.clientWidth);

			return Math.round(cellWidth);
		};

Tabella.prototype.getBreakpoint = function(){

			var self = this,
				minWidth = 0,
				containerWidth = self.el.clientWidth,
				cellBreakpoints = self.options.cellBreakpoints,
				descBreakpoints = self.options.descBreakpoints;

			var cellBreakpoint = [0,1], 
				descBreakpoint = [0,0];

			for(var cbp in cellBreakpoints){

				var cbpWidth = cellBreakpoints[cbp][0];

				if(typeof cbpWidth === 'number' &&  cbpWidth > 0 && cbpWidth <= containerWidth){

					if(Math.abs(containerWidth - cbpWidth) < Math.abs(containerWidth - minWidth)){
						minWidth = cbpWidth;
						cellBreakpoint = cellBreakpoints[cbp];
					}

				}

			}

			minWidth = 0;

			for(var dbp in descBreakpoints){

				var dbpWidth = descBreakpoints[dbp][0];

				if(typeof dbpWidth === 'number' &&  dbpWidth > 0 && dbpWidth <= containerWidth){

					if(Math.abs(containerWidth - dbpWidth) < Math.abs(containerWidth - minWidth)){
						minWidth = dbpWidth;
						descBreakpoint = descBreakpoints[dbp];
					}

				}

			}

			return {
					cellBreakpoint : cellBreakpoint,
					descBreakpoint : descBreakpoint
					};
		};		
	
	// Register TabellaException on window
    window.TabellaException = TabellaException;

	return Tabella;
});