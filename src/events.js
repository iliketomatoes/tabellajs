Tabella.prototype.attachEvents = function(){

	var self = this;

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
		tableHeaderLength = self.options.tableHeader.length,
		slidingTableHeader = self.tableHeaderRow.querySelector('.t-sliding-row'),
		legalPosition = true,
		delta,
		currentCellWidth,
		tick = 0,
		startingPointer;

	self.slidingRows.forEach(function(el){

		//setting the events listeners
		setListener(el, Toucher.touchEvents.start, function(e){
			//e.preventDefault();
			startingOffset = Animator.offset(slidingTableHeader);
			cachedPosition = Toucher.onTouchStart(e);
			currentCellWidth = parseInt(self.currentCellWidth);
			tick = 0;
			startingPointer = self.pointer;
		});

		setListener(el, Toucher.touchEvents.move, function(e){
			//e.preventDefault();
			position = Toucher.onTouchMove(e);
			
			if(position && legalPosition){

				delta = position.currX - cachedPosition.cachedX;

				//Let's drag the sliding rows around
				Animator.drag(self.slidingRows, (delta + parseInt(startingOffset)));

				tick = Math.abs(Math.floor(delta / self.options.swipeThreshold));

				if(self.options.swipeSingleTick && tick >= 1) tick = 1;

				//Swipe right
				if(delta >= 0){ 

					if(self.pointer === 0){                  

						if(Math.abs(parseInt(Animator.offset(slidingTableHeader))) >= self.options.edgeThreshold) legalPosition = false;
						
					}else{
						self.pointer = startingPointer - tick;
					}

					//Swipe left	
					}else{
						
						if(self.pointer === tableHeaderLength - self.currentBreakpoint.cellBreakpoint[1] || tableHeaderLength < self.currentBreakpoint.cellBreakpoint[1]){
		
							var offset = Math.abs(parseInt(Animator.offset(slidingTableHeader)));
							var slidingRowWidth = slidingTableHeader.clientWidth;

							if(offset >= self.options.edgeThreshold + (currentCellWidth * self.pointer)){
								legalPosition = false;
							}
						}else{
							self.pointer = startingPointer + tick;
						}
					}
				cachedPosition = position;
			}
		});

		setListener(el, Toucher.touchEvents.end, function(){
			//e.preventDefault();
			Toucher.onTouchEnd();
			startingOffset = 0;
			var offset = parseInt(Animator.offset(slidingTableHeader));
			self.resetDragging(parseInt(offset + self.pointer * currentCellWidth));
			legalPosition = true;
			self.updateArrows();					
		});

	});	

};


Tabella.prototype.resetDragging = function(offset){
	var self = this;
	Animator.stopDragging();
	Animator.animate(self.slidingRows, offset, getReboundTime(offset, self.options.reboundSpeed), 'easeOutBack');
};

