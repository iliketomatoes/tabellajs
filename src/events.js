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
		slidingPeriodRow = self.periodRow.querySelector('.t-sliding-row'),
		legalPosition = true;

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
				var delta = position.currX - cachedPosition.cachedX;
				Animator.drag(self.slidingRows, (delta + parseInt(startingOffset)));
				if(delta >= 0){
					if(self.pointer === 0 && Math.abs(delta) >= 150){
						legalPosition = false;
						var offset = parseInt(Animator.offset(slidingPeriodRow));
						self.resetDragging(offset);
					}
				}else{
					console.log('swipe left');
				}
				cachedPosition = position;
		}
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.end, function(e){
		e.preventDefault();
		Toucher.onTouchEnd();
		startingOffset = 0;

		if(self.pointer === 0 && legalPosition){
			var offset = parseInt(Animator.offset(slidingPeriodRow));
			self.resetDragging(offset);
			
			}

		legalPosition = true;			
	});
};


Tabella.prototype.resetDragging = function(offset){
	var self = this;
	Animator.stopDragging();
	Animator.animate(self.slidingRows, offset, getReboundTime(offset, self.options.reboundSpeed), 'easeOutBack');
};

