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

Tabella.prototype.attachEvents = function() {

    var self = this;

    Animator.easing = self.options.easing;

    self.arrows.arrowLeft.addEventListener('click', function() {
        self.move('left');
    });
    self.arrows.arrowRight.addEventListener('click', function() {
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

    self.slidingRows.forEach(function(el) {

        //setting the events listeners
        setListener(el, Toucher.touchEvents.start, function(e) {

            startingOffset = Animator.offset(slidingTableHeader);
            cachedPosition = Toucher.onTouchStart(e);
            currentCellWidth = parseInt(self.currentCellWidth);
            tick = 0;
            startingPointer = self.pointer;
        });

        setListener(el, Toucher.touchEvents.move, function(e) {

            position = Toucher.onTouchMove(e);

            if (position && legalPosition) {

                delta = position.currX - cachedPosition.cachedX;

                //Let's drag the sliding rows around
                Animator.drag(self.slidingRows, (delta + parseInt(startingOffset)));

                tick = Math.abs(Math.floor(delta / self.options.swipeThreshold));

                if (self.options.swipeSingleTick && tick >= 1) tick = 1;

                //Swipe right
                if (delta >= 0) {

                    if (self.pointer === 0) {

                        if (parseInt(Animator.offset(slidingTableHeader)) >= self.options.edgeThreshold) {
                            legalPosition = false;
                        }

                    } else {
                        self.pointer = startingPointer - tick;
                    }

                    //Swipe left
                } else {

                    if (self.pointer === tableHeaderLength - self.currentBreakpoint.cellBreakpoint[1] || tableHeaderLength < self.currentBreakpoint.cellBreakpoint[1]) {

                        var offset = Math.abs(parseInt(Animator.offset(slidingTableHeader)));

                        if (offset >= self.options.edgeThreshold + (currentCellWidth * self.pointer)) {
                            legalPosition = false;
                        }
                    } else {
                        self.pointer = startingPointer + tick;
                    }
                }
                cachedPosition = position;
            }
        });

        setListener(el, Toucher.touchEvents.end, function() {

            Toucher.onTouchEnd();
            startingOffset = 0;
            var offset = parseInt(Animator.offset(slidingTableHeader));
            self.resetDragging(parseInt(offset + self.pointer * currentCellWidth));
            legalPosition = true;
            self.updateArrows();
        });

    });


    /**
     * Handling scroll event for fixed header
     */

    if (self.options.fixedHeader) {
        setListener(window, 'scroll', function() {

            if (isElementCompletelyInViewport(self.el) && self.tableHeaderRow.getAttribute('data-position') === 'relative') {
                return false;
            }

            if (isElementCompletelyInViewport(self.el)) {
                self.unsetFixedHeader();
                return false;
            }

            if (isElementPartiallyInViewport(self.el, self.options.fixedHeaderBottomThreshold)) {

                //If the table is partially in the viewport we set the tableHeaderRow to fixed position
                self.setFixedHeader();

            } else {

                /**
                 * If table is out of viewport and tableHeaderRow isn't in fixed position we don't do anything.
                 * Otherwise we unset the tableHeaderRow
                 */
                if (self.tableHeaderRow.getAttribute('data-position') === 'relative') return false;

                self.unsetFixedHeader();
            }

        });
    }


};


Tabella.prototype.resetDragging = function(offset) {
    var self = this;
    Animator.stopDragging();
    Animator.animate(self.slidingRows, offset, getReboundTime(offset, self.options.reboundSpeed), 'easeOutBack');
};


/**
 * Setting fixed header
 */

Tabella.prototype.setFixedHeader = function() {

    var self = this;

    var fixedHeaderCtr = self.tableHeaderRow.parentElement;

    fixedHeaderCtr.style.width = fixedHeaderCtr.clientWidth + 'px';
    fixedHeaderCtr.style.height = fixedHeaderCtr.clientHeight + 'px';

    self.tableHeaderRow.style.top = self.options.fixedHeaderTop;
    self.tableHeaderRow.style.marginTop = 0;
    self.tableHeaderRow.style.width = fixedHeaderCtr.clientWidth + 'px';
    self.tableHeaderRow.style.height = fixedHeaderCtr.clientHeight + 'px';

    classie.add(self.tableHeaderRow, 't-shadow');

    self.tableHeaderRow.style.position = 'fixed';
    self.tableHeaderRow.setAttribute('data-position', 'fixed');
};


/**
 * Unsetting fixed header
 */

Tabella.prototype.unsetFixedHeader = function() {
    var self = this;

    self.tableHeaderRow.style.position = 'relative';
    self.tableHeaderRow.setAttribute('data-position', 'relative');

    classie.remove(self.tableHeaderRow, 't-shadow');

    var fixedHeaderCtr = self.tableHeaderRow.parentElement;

    fixedHeaderCtr.style.width = 'auto';
    fixedHeaderCtr.style.height = 'auto';

    self.tableHeaderRow.style.top = '';
    self.tableHeaderRow.style.marginTop = '';
    self.tableHeaderRow.style.width = 'auto';
    self.tableHeaderRow.style.height = 'auto';

};
