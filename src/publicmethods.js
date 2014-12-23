
Tabella.prototype.refreshSize = function(){
	var self = this,
		breakpoint = self.getBreakpoint();
		console.log('resized');

	var cellWidth = self.getCellWidth(breakpoint),
		descWidth = breakpoint.descBreakpoint[1],
		numberOfPeriods = self.options.periods.length;


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
