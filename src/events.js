function attachEvents(context, el, options){

	var self = context;

	//Animator = new Animator(options.easing);
	Animator.easing = options.easing;

	self.arrows.arrowLeft.addEventListener('click', function(){
		self.move('left');
	});
	self.arrows.arrowRight.addEventListener('click', function(){
		self.move('right');
	});

	var position,
		cachedPosition,
		startingOffset,
		slidingRows = getArray(el.querySelectorAll('.t-sliding-row')),
		slidingPeriodRow = self.periodRow.querySelector('.t-sliding-row');

	//setting the events listeners
	setListener(slidingPeriodRow, Toucher.touchEvents.start, function(e){
		e.preventDefault();
		startingOffset = Animator.offset(slidingPeriodRow);
		cachedPosition = Toucher.onTouchStart(e);
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.move, function(e){
		e.preventDefault();
		position = Toucher.onTouchMove(e);
		if(position){
				Animator.drag(slidingRows, (position.currX - cachedPosition.cachedX + parseInt(startingOffset)));
				cachedPosition = position;
		}
	});

	setListener(slidingPeriodRow, Toucher.touchEvents.end, function(e){
		e.preventDefault();
		Toucher.onTouchEnd();
		startingOffset = 0;
		Animator.stopDragging();
	});
}

