	
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

				self.toucher = new Toucher();

				self.arrows.arrowLeft.addEventListener('click', function(){
					self.move('left');
				});
				self.arrows.arrowRight.addEventListener('click', function(){
					self.move('right');
				});

				//setting the events listeners
				setListener(self.periodRow, self.toucher.touchEvents.start, function(e){
					e.preventDefault();
					console.log(self.toucher.onTouchStart(e));
				});
				setListener(self.periodRow, self.toucher.touchEvents.move, function(e){
					e.preventDefault();
					console.log(self.toucher.onTouchMove(e));
				});
				setListener(self.periodRow, self.toucher.touchEvents.end, function(e){
					e.preventDefault();
					console.log(self.toucher.onTouchEnd(e));
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