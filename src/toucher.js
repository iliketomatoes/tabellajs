/*
 *  Copyright (C) 2014-2016  Interpromotion <info@interpromotion.com>
 *  Copyright (C) 2014-2016  Giancarlo Soverini <giancarlosoverini@gmail.com>
 *
 *  This file is part of Tabellajs.
 *
 *  Tabellajs is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  Tabellajs is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

var msEventType = function(type) {
        var lo = type.toLowerCase(),
            ms = 'MS' + type;
        return window.navigator.msPointerEnabled ? ms : lo;
    },
    touchEvents = {
        start: msEventType('PointerDown') + ' touchstart mousedown',
        end: msEventType('PointerUp') + ' touchend mouseup',
        move: msEventType('PointerMove') + ' touchmove mousemove'
    },
    getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    };

var Toucher = {

    points: {
        cachedX: null,
        cachedY: null,
        currX: null,
        currY: null
    },

    touchStarted: false,

    touchEvents: touchEvents,

    getPointerEvent: getPointerEvent,

    onTouchStart: function(e) {

        var self = this,
            pointer = self.getPointerEvent(e);

        // caching the current x
        self.points.cachedX = self.points.currX = pointer.pageX;
        // caching the current y
        self.points.cachedY = self.points.currY = pointer.pageY;
        // a touch event is detected
        self.touchStarted = true;

        return self.points;

    },

    onTouchEnd: function() {

        var self = this,
            deltaY = self.points.cachedY - self.points.currY,
            deltaX = self.points.cachedX - self.points.currX;

        self.touchStarted = false;

        return {
            deltaX: deltaX,
            deltaY: deltaY
        };

    },

    onTouchMove: function(e) {
        var self = this;

        if (self.touchStarted === false) return false;

        var pointer = self.getPointerEvent(e);

        self.points.currX = pointer.pageX;
        self.points.currY = pointer.pageY;

        //We just want horizontal movements
        if (Math.abs(self.points.cachedY - self.points.currY) >= (Math.abs(self.points.cachedX - self.points.currX) / 2)) return false;

        return self.points;
    }
};
