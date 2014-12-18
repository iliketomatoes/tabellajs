
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

			if(breakpoint[1] > numberOfPeriods){
				cellWidth = self.getElAdjustedWidth() / numberOfPeriods;
			}else{
				cellWidth = self.getElAdjustedWidth() / breakpoint[1];
			}
	
			return Math.floor(cellWidth);
		};

		this.getElAdjustedWidth = function(){
			return this.el.clientWidth - ( this.options.borderWidth * 2 );
		};

