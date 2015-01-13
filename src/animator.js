	//Check the supported vendor prefix for transformations
	var vendorTransform  =  getSupportedTransform();				    

	//from http://easeings.net/
	var easeingObj = {
		easeInSine : [0.47, 0, 0.745, 0.715],
		easeOutSine : [0.39, 0.575, 0.565, 1],
		easeInOutSine : [0.445, 0.05, 0.55, 0.95],
		easeInQuad : [0.55, 0.085, 0.68, 0.53],
		easeOutQuad : [0.25, 0.46, 0.45, 0.94],
		easeInOutQuad : [0.455, 0.03, 0.515, 0.955],
		easeInCubic : [0.55, 0.055, 0.675, 0.19],
		easeOutCubic : [0.215, 0.61, 0.355, 1],
		easeInOutCubic : [0.645, 0.045, 0.355, 1],
		easeInQuart : [0.895, 0.03, 0.685, 0.22],
		easeOutQuart : [0.165, 0.84, 0.44, 1],
		easeInOutQuart : [0.77, 0, 0.175, 1],
		easeInQuint : [0.755, 0.05, 0.855, 0.06],
		easeOutQuint : [0.23, 1, 0.32, 1],
		easeInOutQuint : [0.86, 0, 0.07, 1],
		easeInExpo : [0.95, 0.05, 0.795, 0.035],
		easeOutExpo : [0.19, 1, 0.22, 1],
		easeInOutExpo : [1, 0, 0, 1],
		easeInCirc : [0.6, 0.04, 0.98, 0.335],
		easeOutCirc : [0.075, 0.82, 0.165, 1],
		easeInOutCirc : [0.785, 0.135, 0.15, 0.86],
		easeInBack : [0.6, -0.28, 0.735, 0.045],
		easeOutBack  : [0.175, 0.885, 0.32, 1.275],
		easeInOutBack  : [0.68, -0.55, 0.265, 1.55],
	};

	var lastTime = 0;

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	//rAF polyfill
	if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };

	var Animator = {
		easeing : 'easeInOutSine',
		
		animated : false,
		
		dragged : null,

		getAnimationCurve : function(duration, easeing){
			var self = this,
				epsilon = (1000 / 60 / duration) / 4;

			return getBezier(easeing, epsilon);
			},

		actualAnimation : function(el, offset, duration, animationCurve, startingOffset){

			var self = this,
				targetOffset = startingOffset - offset,
				start = null,
				myReq;

			function animationStep(timestamp){
			
				if (start === null) start = timestamp;

				var timePassed = (timestamp - start);
				var progress = timePassed / duration;

				if (progress >= 1) progress = 1;

				var delta = animationCurve(progress).toFixed(2);

				//console.log(delta);

				self.step(el, delta, startingOffset, targetOffset);

				if (progress === 1){
					cancelAnimationFrame(myReq);
					start = null;
					}else{
					requestAnimationFrame(animationStep);
				}

			}

			myReq = requestAnimationFrame(animationStep);

			},

		step : function(el, delta, startingOffset, targetOffset){
			this.offset(el,parseInt(startingOffset) + parseInt((targetOffset - startingOffset) * delta));
			},

		offset : function(elem, length){

			if(typeof length === 'undefined'){

				if(vendorTransform){
					/**
					* @return {Number} the x offset of the translation
					*/
					var parsedXOffset = elem.style[vendorTransform] ? elem.style[vendorTransform].match(/-?\d+/g)[0] : 0;

					return parsedXOffset;
					}else{
						return elem.style.left;
					}		

				}else{
					if(vendorTransform){
						elem.style[vendorTransform] = 'translate(' + length + 'px, 0px)';
					}else{
						elem.style.left = length + 'px';
					}	
				}
			},

		animate : function(target, offset, duration, easeing){

			var self = this,
				easeingVar = easeing || self.easeing;

			var actualEaseing = getEaseing(easeingVar);	

			if(self.animated) return false;
			self.animated = true;

			var animationCurve = self.getAnimationCurve(duration, actualEaseing);

			target.forEach(function(el){
				self.actualAnimation(el, offset, duration, animationCurve, self.offset(el));
			});

			self.animated = false;
			},

		resetRows : function(target, duration, easeing){
			var self = this;

			if(self.animated) return false;
			self.animated = true;

			var animationCurve = self.getAnimationCurve(duration, easeing || getEaseing(self.easeing));

			target.forEach(function(el){
				self.actualAnimation(el, 0, duration, animationCurve, 0);
			});

			self.animated = false;
			},

		drag : function(target, length){
			var self = this;

			if(self.animated) return false;

			target.forEach(function(el){
				self.dragged = requestAnimationFrame(function(){
						self.offset(el, length);
				});
			});

			},

		stopDragging : function(){
			var self = this;
			//self.animated = true;
			cancelAnimationFrame(self.dragged);
			}	

	};


	/* 
	====================================================
	FUNCTIONS DEALING WITH THE ACTUAL SLIDING ANIMATION
	====================================================*/
	function getEaseing(easeing){
		return easeingObj.hasOwnProperty(easeing) ? easeingObj[easeing] : easeingObj.easeInOutSine;
	}

	function getBezier(easeingArr, epsilon){
		return bezier(easeingArr[0], easeingArr[1], easeingArr[2], easeingArr[3], epsilon);
	}

	// from https://github.com/arian/cubic-bezier
	function bezier(x1, y1, x2, y2, epsilon){

	  	var curveX = function(t){
		    var v = 1 - t;
		    return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
	    };

	  	var curveY = function(t){
		    var v = 1 - t;
		    return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
	    };

	  	var derivativeCurveX = function(t){
		    var v = 1 - t;
		    return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
	    };

	  	return function(t){
	    	var x = t, t0, t1, t2, x2, d2, i;

		    // First try a few iterations of Newton's method -- normally very fast.
		    for (t2 = x, i = 0; i < 8; i++){
		      x2 = curveX(t2) - x;
		      if (Math.abs(x2) < epsilon) return curveY(t2);
		      d2 = derivativeCurveX(t2);
		      if (Math.abs(d2) < 1e-6) break;
		      t2 = t2 - x2 / d2;
		    }

		    t0 = 0;
		    t1 = 1; 
		    t2 = x;

		    if (t2 < t0) return curveY(t0);
		    if (t2 > t1) return curveY(t1);
		    // Fallback to the bisection method for reliability.
		    while (t0 < t1){
		      x2 = curveX(t2);
		      if (Math.abs(x2 - x) < epsilon) return curveY(t2);
		      if (x > x2) t0 = t2;
		      else t1 = t2;
		      t2 = (t1 - t0) * 0.5 + t0;
		    }
		    // Failure
		    return curveY(t2);
	    };
	}