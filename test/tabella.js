/*! tabella - v0.0.1 - 2015-01-12
* https://github.com/iliketomatoes/tabellajs
* Copyright (c) 2015 ; Licensed  */
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

   function setListener(elm, events, callback) {
      var eventsArray = events.split(' '),
        i = eventsArray.length;

      while (i--) {
        elm.addEventListener(eventsArray[i], callback, false);
      }
    }

    function invokeCallback(cb, cbContext){
    var context = cbContext || null,
      params = Array.prototype.slice.call(arguments, 2);
      return cb.apply(context, params);
  } 

  function getReboundTime(space, speed){
    return Math.round((Math.abs(space) / speed) * 1000);
  }


	
	function TabellaException(value) {			

	   this.value = value;
	   this.message = "Tabella.js error: ";
	   this.toString = function() {
	      return this.message + this.value;
	   };
	}
	//Check the supported vendor prefix for transformations
	var vendorTransform  =  getSupportedTransform();				    

	//from http://easeings.net/
	var easeingObj = {
		easeInSine : [0.47, 0, 0.745, 0.715],
		easeOutSine : [0.39, 0.575, 0.565, 1],
		easeInOutSine : [0.445, 0.05, 0.55, 0.95],
		easeInQuad : [0.55, 0.085, 0.68, 0.53],
		easeOutQuad : [0.25, 0.46, 0.45, 0.94],
		easeInOutQuad : [0.455, 0.03, 0.515, 0.955],
		easeInCubic : [0.55, 0.055, 0.675, 0.19],
		easeOutCubic : [0.215, 0.61, 0.355, 1],
		easeInOutCubic : [0.645, 0.045, 0.355, 1],
		easeInQuart : [0.895, 0.03, 0.685, 0.22],
		easeOutQuart : [0.165, 0.84, 0.44, 1],
		easeInOutQuart : [0.77, 0, 0.175, 1],
		easeInQuint : [0.755, 0.05, 0.855, 0.06],
		easeOutQuint : [0.23, 1, 0.32, 1],
		easeInOutQuint : [0.86, 0, 0.07, 1],
		easeInExpo : [0.95, 0.05, 0.795, 0.035],
		easeOutExpo : [0.19, 1, 0.22, 1],
		easeInOutExpo : [1, 0, 0, 1],
		easeInCirc : [0.6, 0.04, 0.98, 0.335],
		easeOutCirc : [0.075, 0.82, 0.165, 1],
		easeInOutCirc : [0.785, 0.135, 0.15, 0.86],
		easeInBack : [0.6, -0.28, 0.735, 0.045],
		easeOutBack  : [0.175, 0.885, 0.32, 1.275],
		easeInOutBack  : [0.68, -0.55, 0.265, 1.55],
	};

	var lastTime = 0;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	//rAF polyfill
	if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

	var Animator = {
		easeing : 'easeInOutSine',
		
		animated : false,
		
		dragged : null,

		getAnimationCurve : function(duration, easeing){
			var self = this,
				epsilon = (1000 / 60 / duration) / 4;

			return getBezier(easeing, epsilon);
			},

		actualAnimation : function(el, offset, duration, animationCurve, startingOffset){

			var self = this,
				targetOffset = startingOffset - offset,
				start = null,
				myReq;

			function animationStep(timestamp){
			
				if (start === null) start = timestamp;

				var timePassed = (timestamp - start);
				var progress = timePassed / duration;

				if (progress >= 1) progress = 1;

				var delta = animationCurve(progress).toFixed(2);

				//console.log(delta);

				self.step(el, delta, startingOffset, targetOffset);

				if (progress === 1){
					cancelAnimationFrame(myReq);
					start = null;
					}else{
					requestAnimationFrame(animationStep);
				}

			}

			myReq = requestAnimationFrame(animationStep);

			},

		step : function(el, delta, startingOffset, targetOffset){
			this.offset(el,parseInt(startingOffset) + parseInt((targetOffset - startingOffset) * delta));
			},

		offset : function(elem, length){

			if(typeof length === 'undefined'){

				if(vendorTransform){
					/**
					* @return {Number} the x offset of the translation
					*/
					var parsedXOffset = elem.style[vendorTransform] ? elem.style[vendorTransform].match(/-?\d+/g)[0] : 0;

					return parsedXOffset;
					}else{
						return elem.style.left;
					}		

				}else{
					if(vendorTransform){
						elem.style[vendorTransform] = 'translate(' + length + 'px, 0px)';
					}else{
						elem.style.left = length + 'px';
					}	
				}
			},

		animate : function(target, offset, duration, easeing){

			var self = this,
				easeingVar = easeing || self.easeing;

			var actualEaseing = getEaseing(easeingVar);	

			if(self.animated) return false;
			self.animated = true;

			var animationCurve = self.getAnimationCurve(duration, actualEaseing);

			target.forEach(function(el){
				self.actualAnimation(el, offset, duration, animationCurve, self.offset(el));
			});

			self.animated = false;
			},

		resetRows : function(target, duration, easeing){
			var self = this;

			if(self.animated) return false;
			self.animated = true;

			var animationCurve = self.getAnimationCurve(duration, easeing || getEaseing(self.easeing));

			target.forEach(function(el){
				self.actualAnimation(el, 0, duration, animationCurve, 0);
			});

			self.animated = false;
			},

		drag : function(target, length){
			var self = this;

			if(self.animated) return false;

			target.forEach(function(el){
				self.dragged = requestAnimationFrame(function(){
						self.offset(el, length);
				});
			});

			},

		stopDragging : function(){
			var self = this;
			//self.animated = true;
			cancelAnimationFrame(self.dragged);
			}	

	};


	/* 
	====================================================
	FUNCTIONS DEALING WITH THE ACTUAL SLIDING ANIMATION
	====================================================*/
	function getEaseing(easeing){
		return easeingObj.hasOwnProperty(easeing) ? easeingObj[easeing] : easeingObj.easeInOutSine;
	}

	function getBezier(easeingArr, epsilon){
		return bezier(easeingArr[0], easeingArr[1], easeingArr[2], easeingArr[3], epsilon);
	}

	// from https://github.com/arian/cubic-bezier
	function bezier(x1, y1, x2, y2, epsilon){

	  	var curveX = function(t){
		    var v = 1 - t;
		    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
	    };

	  	var curveY = function(t){
		    var v = 1 - t;
		    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
	    };

	  	var derivativeCurveX = function(t){
		    var v = 1 - t;
		    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
	    };

	  	return function(t){
	    	var x = t, t0, t1, t2, x2, d2, i;

		    // First try a few iterations of Newton's method -- normally very fast.
		    for (t2 = x, i = 0; i < 8; i++){
		      x2 = curveX(t2) - x;
		      if (Math.abs(x2) < epsilon) return curveY(t2);
		      d2 = derivativeCurveX(t2);
		      if (Math.abs(d2) < 1e-6) break;
		      t2 = t2 - x2 / d2;
		    }

		    t0 = 0;
		    t1 = 1; 
		    t2 = x;

		    if (t2 < t0) return curveY(t0);
		    if (t2 > t1) return curveY(t1);
		    // Fallback to the bisection method for reliability.
		    while (t0 < t1){
		      x2 = curveX(t2);
		      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
		      if (x > x2) t0 = t2;
		      else t1 = t2;
		      t2 = (t1 - t0) * 0.5 + t0;
		    }
		    // Failure
		    return curveY(t2);
	    };
	}
	var msPointerEnabled = !!navigator.pointerEnabled || navigator.msPointerEnabled,
		msEventType = function(type) {
			var lo = type.toLowerCase(),
				ms = 'MS' + type;
			return navigator.msPointerEnabled ? ms : lo;
		},
		touchEvents = {
			start: msEventType('PointerDown') + ' touchstart mousedown',
			end: msEventType('PointerUp') + ' touchend mouseup',
			move: msEventType('PointerMove') + ' touchmove mousemove'
		},
		getPointerEvent = function(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		};

	var Toucher = {

		points : {
			cachedX : null,
			cachedY : null,
			currX : null,
			currY : null
		},

	    touchStarted : false,

	    touchEvents : touchEvents,

	    getPointerEvent : getPointerEvent,

	    onTouchStart : function(e) {

			var self = this,
				pointer = self.getPointerEvent(e);

			// caching the current x
			self.points.cachedX = self.points.currX = pointer.pageX;
			// caching the current y
			self.points.cachedY = self.points.currY = pointer.pageY;
			// a touch event is detected
			self.touchStarted = true;

			return self.points;

		},

		onTouchEnd : function() {

			var self = this,
				deltaY = self.points.cachedY - self.points.currY,
				deltaX = self.points.cachedX - self.points.currX;

				self.touchStarted = false;

			return {
				deltaX : deltaX,
				deltaY : deltaY
			};

		},

		onTouchMove : function(e) {
			var self = this;

			if(self.touchStarted === false) return false;

			var pointer = self.getPointerEvent(e);

			self.points.currX = pointer.pageX;
			self.points.currY = pointer.pageY;

			return self.points;
		}
	};






var TabellaBuilder = {
		
		options : null,

		el : null,

		setUpPeriods : function(){

			var self = this;
			
			var periods = self.options.periods;

			var docfrag = document.createDocumentFragment();

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var tRow = createHTMLEl('div', 't-row', docfrag);

				var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

				var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);
				
				var tRowDescHTML = '<div class="t-element">';
					tRowDescHTML +='<div class="t-cell-desc-l">';
					tRowDescHTML += self.options.from;
					tRowDescHTML += '<br>';
					tRowDescHTML += self.options.to;
					tRowDescHTML += '</div>';
					tRowDescHTML += '</div>';  

				var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

				var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

				var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);

				for(var i = 0; i < numberOfPeriods; i++){

					var tRowCell = document.createElement('div');
					tRowCell.className = 't-row-cell';

					//From - to Div	
					var periodHTML = '<div class="t-cell-desc-s">';
						periodHTML += self.options.from;
					if(typeof periods[i][1] !== 'undefined'){	
						periodHTML += '<br>';
						periodHTML += self.options.to;
					}	
						periodHTML += '</div>'; 	

					//Period actual dates
					periodHTML += '<div class="t-cell-value t-bold">';
					periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					if(typeof periods[i][1] !== 'undefined'){
						periodHTML += '<br>';
						periodHTML += periods[i][1];
					}
					periodHTML += '</div>'; 

					var tEl = createHTMLEl( 'div', 't-element', tRowCell, periodHTML);

					tSlidingRow.appendChild(tRowCell);

				}

				self.el.appendChild(docfrag);

				return tRow;

			}else{
				return false;
			}
		},

		setUpRows : function (){

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

							var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

							var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);	

								if(!matchingPeriodCells) break;

								var tRowDescHTML = '<div class="t-element">';
									tRowDescHTML +='<div class="t-cell-desc-l">';
									tRowDescHTML += rows[i].pricesDesc[j];
									tRowDescHTML += '</div>';
									tRowDescHTML += '</div>';

								var descClass = 't-row-desc';
								if(j >= 1) descClass += ' t-cell-border-top';	  

								var tRowDesc = createHTMLEl('div', descClass, tRowContent, tRowDescHTML);

								var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

								var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);
							
								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var tRowCell = document.createElement('div');

										var cellClass = 't-row-cell';
										if(j >= 1) cellClass += ' t-cell-border-top';

										tRowCell.className = cellClass;

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

										tSlidingRow.appendChild(tRowCell);
									
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

		},

		setUpArrows : function(periodRow){

			var self = this;

			var arrowRight = createHTMLEl('div','t-arr-right t-hide', periodRow, self.options.arrowRight);

			var arrowLeft = createHTMLEl('div','t-arr-left t-hide', periodRow, self.options.arrowLeft);
			
			return {
				arrowRight : arrowRight,

				arrowLeft : arrowLeft
			};
		}

	};

	
	function init(context, el, options){
		var self = context;

		if(typeof el !== 'undefined'){
			if(typeof options !== 'undefined'){
				self.options = extend(self.defaults, options);
				}else{
				throw new TabellaException('You did not pass any options to the constructor');
			}
		}else{
				throw new TabellaException('You did not pass a valid target element to the constructor');
			}

		self.periodRow = null;
		self.slidingRows = null;
		self.arrows = null;
		self.pointer = 0;
		self.animator = null;
		//An object that has to hold the cellBreakpoint and descBreakpoint
		self.currentBreakpoint = {};
		self.currentCellWidth = 0;

		self.el = el;

		if(self.options.periods !== null && self.options.rows !== null){

		TabellaBuilder.el = self.el;	
		TabellaBuilder.options = self.options;
	
		self.periodRow = TabellaBuilder.setUpPeriods();

		if(self.periodRow){
	
			if(TabellaBuilder.setUpRows()){

				self.arrows = TabellaBuilder.setUpArrows(self.periodRow);
				self.slidingRows = getArray(self.el.querySelectorAll('.t-sliding-row'));
				// Returns a function, that, as long as it continues to be invoked, will not
				// be triggered. The function will be called after it stops being called for
				// N milliseconds. If `immediate` is passed, trigger the function on the
				// leading edge, instead of the trailing.
				var debounce = function(func, wait, immediate) {
					var timeout;
					//var context = self;
					return function() {
						var args = arguments;
						var later = function() {
							timeout = null;
							if (!immediate) func.apply(context, args);
						};
						var callNow = immediate && !timeout;
						clearTimeout(timeout);
						timeout = setTimeout(later, wait);
						if (callNow) func.apply(context, args);
					};
				};

				var firstSet = function(){
					self.currentBreakpoint = self.getBreakpoint();
					self.currentCellWidth = self.getCellWidth(self.currentBreakpoint);
					self.refreshSize();
				};

				window.addEventListener('load', debounce(firstSet, 50));

				window.addEventListener('resize', debounce(self.refreshSize, 250));

				self.attachEvents();
				//attachEvents(context, el, self.options);

			}else{
				throw new TabellaException('There is a mismatch between periods and prices cells');
			}
		}else{
			throw new TabellaException('Periods is not an Array');
		}
		
	}else{
		throw new TabellaException('Periods or rows are null');
	}
				
	}

	function Tabella(el, options){
			init(this, el, options);
		}
			
Tabella.prototype.attachEvents = function(){

	var self = this;

	//Animator = new Animator(options.easing);
	Animator.easing = self.options.easing;

	self.arrows.arrowLeft.addEventListener('click', function(){
		self.move('left');
	});
	self.arrows.arrowRight.addEventListener('click', function(){
		self.move('right');
	});

	var position,
		cachedPosition,
		startingOffset,
		numberOfPeriods = self.options.periods.length,
		slidingPeriodRow = self.periodRow.querySelector('.t-sliding-row'),
		legalPosition = true,
		delta,
		offsetMultiplier = 0;

	//setting the events listeners
	setListener(slidingPeriodRow, Toucher.touchEvents.start, function(e){
		e.preventDefault();
		startingOffset = Animator.offset(slidingPeriodRow);
		cachedPosition = Toucher.onTouchStart(e);
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.move, function(e){
		e.preventDefault();
		position = Toucher.onTouchMove(e);
		
		if(position && legalPosition){

			delta = position.currX - cachedPosition.cachedX;

			//Let's drag the sliding rows around
			Animator.drag(self.slidingRows, (delta + parseInt(startingOffset)));

			//Swipe right
			if(delta >= 0){
				if(self.pointer === 0 && Math.abs(delta) >= 150){
					legalPosition = false;
				}
				//Swipe left	
				}else{
					
					if(Math.abs(delta) >= (parseInt(self.currentCellWidth) + 150)){
						legalPosition = false;
						console.log('troppo a destraaa');
						//if(self.pointer + 1 + self.currentBreakpoint.cellBreakpoint[1] + numberOfPeriods){

						//}
					}
					//if(self.pointer + self.currentBreakpoint.cellBreakpoint[1] + 1 >= numberOfPeriods){

					//}
					
				}
			cachedPosition = position;
		}
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.end, function(e){
		e.preventDefault();
		Toucher.onTouchEnd();
		startingOffset = 0;

		if(legalPosition && Math.abs(delta) >= (self.currentCellWidth / 2)){
			offsetMultiplier++;
		}

		//if(!legalPosition){
			var offset = parseInt(Animator.offset(slidingPeriodRow));
			self.resetDragging(parseInt(offset + offsetMultiplier * self.currentCellWidth));
			legalPosition = true;
			//}else{
				//Animator.stopDragging();
			//}

					
	});
};


Tabella.prototype.resetDragging = function(offset){
	var self = this;
	Animator.stopDragging();
	Animator.animate(self.slidingRows, offset, getReboundTime(offset, self.options.reboundSpeed), 'easeOutBack');
};


Tabella.prototype.defaults = {
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
				medium : [640,3],
				large : [820,4],
				xlarge : [1080,5]
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
			currency : '&euro;',
			arrowLeft : '\u2190',
			arrowRight : '\u2192',
			easing : 'easeInOutSine',
			duration : 600,
			reboundSpeed : 200
		};

Tabella.prototype.refreshSize = function(){
	var self = this,
		oldBreakpoint = self.currentBreakpoint,
		breakpoint = self.currentBreakpoint = self.getBreakpoint();

	var oldCellWidth = self.currentCellWidth,
		cellWidth = self.currentCellWidth = self.getCellWidth(breakpoint),
		descWidth = breakpoint.descBreakpoint[1],
		numberOfPeriods = self.options.periods.length;

		self.refreshArrowPosition(descWidth);

	var rows = getArray(self.el.querySelectorAll('.t-row'));

	rows.forEach(function(el){

		var tContent = getArray(el.querySelectorAll('.t-row-content'));

			if(breakpoint.descBreakpoint[1] > 0){

				tContent.forEach(function(el){

					el.style.width = descWidth + (numberOfPeriods * cellWidth) + 'px';

					var tDescL = el.querySelector('.t-row-desc');

					tDescL.style.width = descWidth + 'px';

					classie.remove(tDescL, 't-hide');

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

	

	if(self.pointer > 0){ 
		if(oldBreakpoint.cellBreakpoint[0] != breakpoint.cellBreakpoint[0] || 
			oldBreakpoint.descBreakpoint[1] != breakpoint.descBreakpoint[1]){
			self.move();
		}else{
			if(oldCellWidth != cellWidth ){
				self.move(parseInt(cellWidth - oldCellWidth) * parseInt(self.pointer));
			}
		}
	}

};

Tabella.prototype.getCellWidth = function(breakpoint){
			var self = this,
				numberOfCells = self.options.periods.length,
				cellBreakpoint = breakpoint.cellBreakpoint,
				descBreakpoint = breakpoint.descBreakpoint,
				cellWidth;

			if(cellBreakpoint[1] > numberOfCells ){
				cellWidth = (self.el.clientWidth - descBreakpoint[1]) / numberOfCells;
			}else{
				cellWidth = (self.el.clientWidth - descBreakpoint[1]) / cellBreakpoint[1];
			}

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

Tabella.prototype.refreshArrowPosition = function(descriptionWidth){

	var self = this,
		descWidth = descriptionWidth || self.currentBreakpoint.descBreakpoint[1];

	self.arrows.arrowLeft.style.left = descWidth + 'px';
	self.updateArrows();
};

Tabella.prototype.updateArrows = function(){

	var self = this,
		breakpoint = self.currentBreakpoint || self.getBreakpoint(),
		numberOfPeriods = self.options.periods.length;

		if(numberOfPeriods > breakpoint.cellBreakpoint[1]){

			if(self.pointer === 0){
				classie.add(self.arrows.arrowLeft, 't-hide');
				classie.remove(self.arrows.arrowRight, 't-hide');
			}else{
				if(self.pointer === numberOfPeriods - breakpoint.cellBreakpoint[1]){
					classie.remove(self.arrows.arrowLeft, 't-hide');
					classie.add(self.arrows.arrowRight, 't-hide');
				}else{
					classie.remove(self.arrows.arrowLeft, 't-hide');
					classie.remove(self.arrows.arrowRight, 't-hide');
				}
			}
			
		}else{
			classie.add(self.arrows.arrowLeft, 't-hide');
			classie.add(self.arrows.arrowRight, 't-hide');
		}
};

Tabella.prototype.move = function(x){

	var self = this,
		cellWidth = self.getCellWidth(self.currentBreakpoint),
		numberOfPeriods = self.options.periods.length;
		//slidingRows = getArray(self.el.querySelectorAll('.t-sliding-row'));

	if(x === 'right'){
		Animator.animate(self.slidingRows, cellWidth, self.options.duration);
		self.pointer++;
	}else{
		if(x === 'left'){
			Animator.animate(self.slidingRows, -cellWidth, self.options.duration);
			self.pointer--;
		}else{

			if(typeof x === 'number'){
				Animator.animate(self.slidingRows, x, getReboundTime(x, self.options.reboundSpeed));
			}else{
				Animator.resetRows(self.slidingRows, 200);
				self.pointer = 0;
			}
			
		}
	}

	self.updateArrows();
};

	
	// Register TabellaException on window
    window.TabellaException = TabellaException;

	return Tabella;
});