Tabella.prototype.attachEvents = function(){

	var self = this;

	self.animator = new Animator(self.options.easing);

	self.toucher = new Toucher();

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
	setListener(slidingPeriodRow, self.toucher.touchEvents.start, function(e){
		e.preventDefault();
		startingOffset = self.animator.offset(slidingPeriodRow);
		cachedPosition = self.toucher.onTouchStart(e);
	});

	setListener(slidingPeriodRow, self.toucher.touchEvents.move, function(e){
		e.preventDefault();
		position = self.toucher.onTouchMove(e);
		if(position){
				self.animator.drag(slidingRows, (position.currX - cachedPosition.cachedX + parseInt(startingOffset)));
				cachedPosition = position;
		}
	});

	setListener(slidingPeriodRow, self.toucher.touchEvents.end, function(e){
		e.preventDefault();
		startingOffset = 0;
		self.animator.stopDragging();
	});
};

