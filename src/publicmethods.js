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
