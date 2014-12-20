
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



