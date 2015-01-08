	var msPointerEnabled = !!navigator.pointerEnabled || navigator.msPointerEnabled,
		msEventType = function(type) {
			var lo = type.toLowerCase(),
				ms = 'MS' + type;
			return navigator.msPointerEnabled ? ms : lo;
		};

	function Toucher(){
		
		this.points = {
			cachedX : null,
			cachedY : null,
			currX : null,
			currY : null
		};
		this.touchStarted = false;
	}

	Toucher.prototype.touchEvents = {
			start: msEventType('PointerDown') + ' touchstart mousedown',
			end: msEventType('PointerUp') + ' touchend mouseup',
			move: msEventType('PointerMove') + ' touchmove mousemove'
		};

	Toucher.prototype.getPointerEvent = function(event) {
			return event.targetTouches ? event.targetTouches[0] : event;
		};

	Toucher.prototype.onTouchStart = function(e) {

			var self = this,
				pointer = self.getPointerEvent(e);

			// caching the current x
			self.points.cachedX = self.points.currX = pointer.pageX;
			// caching the current y
			self.points.cachedY = self.points.currY = pointer.pageY;
			// a touch event is detected
			self.touchStarted = true;

			return self.points;

		};

	Toucher.prototype.onTouchEnd = function() {

			var self = this,
				deltaY = self.points.cachedY - self.points.currY,
				deltaX = self.points.cachedX - self.points.currX;

				self.touchStarted = false;

			return {
				deltaX : deltaX,
				deltaY : deltaY
			};

		};

	Toucher.prototype.onTouchMove = function(e) {
			var self = this;

			if(self.touchStarted === false) return false;

			var pointer = self.getPointerEvent(e);

			self.points.currX = pointer.pageX;
			self.points.currY = pointer.pageY;

			return self.points;
		};			




