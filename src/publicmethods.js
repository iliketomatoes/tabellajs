
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