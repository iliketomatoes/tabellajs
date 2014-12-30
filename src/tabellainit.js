	
	var self = this;

	if(self.options.periods !== null && self.options.rows !== null){

		var builder = new TabellaBuilder(self.options, self.el);
	
		self.periodRow = builder.setUpPeriods();

		if(self.periodRow){
	
			if(builder.setUpRows()){

				self.arrows = builder.setUpArrows(self.periodRow);

				// Returns a function, that, as long as it continues to be invoked, will not
				// be triggered. The function will be called after it stops being called for
				// N milliseconds. If `immediate` is passed, trigger the function on the
				// leading edge, instead of the trailing.
				var debounce = function(func, wait, immediate) {
					var timeout;
					var context = self;
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

				self.animator = new Animator(self.options.easing);

				self.arrows.arrowLeft.addEventListener('click', function(){
					self.move('left');
				});
				self.arrows.arrowRight.addEventListener('click', function(){
					self.move('right');
				});

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