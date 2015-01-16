	
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
			