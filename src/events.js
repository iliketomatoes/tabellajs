Tabella.prototype.attachEvents = function(){

	var self = this;

	self.animator = new Animator(self.options.easing);

	self.arrows.arrowLeft.addEventListener('click', function(){
		self.move('left');
	});
	self.arrows.arrowRight.addEventListener('click', function(){
		self.move('right');
	});

	var position,
		cachedPosition,
		startingOffset,
		slidingRows = getArray(self.el.querySelectorAll('.t-sliding-row')),
		slidingPeriodRow = self.periodRow.querySelector('.t-sliding-row');

	//setting the events listeners
	setListener(slidingPeriodRow, Toucher.touchEvents.start, function(e){
		e.preventDefault();
		startingOffset = self.animator.offset(slidingPeriodRow);
		cachedPosition = Toucher.onTouchStart(e);
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.move, function(e){
		e.preventDefault();
		position = Toucher.onTouchMove(e);
		if(position){
				self.animator.drag(slidingRows, (position.currX - cachedPosition.cachedX + parseInt(startingOffset)));
				cachedPosition = position;
		}
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.end, function(e){
		e.preventDefault();
		Toucher.onTouchEnd();
		startingOffset = 0;
		self.animator.stopDragging();
	});
};

