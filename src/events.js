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

