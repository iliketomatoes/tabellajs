
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



