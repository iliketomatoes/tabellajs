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

Tabella.prototype.refreshSize = function() {
    var self = this,
        oldBreakpoint = self.currentBreakpoint,
        breakpoint = self.currentBreakpoint = self.getBreakpoint();

    var oldWindowdWidth = self.currentWindowWidth;
    self.currentWindowWidth = window.innerWidth;

    var oldCellWidth = self.currentCellWidth,
        cellWidth = self.currentCellWidth = self.getCellWidth(breakpoint),
        descWidth = breakpoint.descBreakpoint[1],
        tableHeaderLength = self.options.tableHeader.length;

    self.refreshArrowPosition(descWidth);

    //Unset fixed header before resizing everything
    if (self.options.fixedHeader && oldWindowdWidth !== self.currentWindowWidth) self.unsetFixedHeader();

    var rows = getArray(self.el.querySelectorAll('.t-row'));

    rows.forEach(function(el) {

        var tContent = getArray(el.querySelectorAll('.t-row-content'));

        if (breakpoint.descBreakpoint[1] > 0) {

            tContent.forEach(function(el) {

                el.style.width = descWidth + (tableHeaderLength * cellWidth) + 'px';

                var tDescL = el.querySelector('.t-row-desc');

                tDescL.style.width = descWidth + 'px';

                classie.remove(tDescL, 't-hide');

                getArray(el.querySelectorAll('.t-row-cell')).forEach(function(el) {
                    el.style.width = cellWidth + 'px';
                });

                getArray(el.querySelectorAll('.t-cell-desc-s')).forEach(function(innerEl) {
                    classie.add(innerEl, 't-hide');
                });

            });

        } else {

            tContent.forEach(function(el) {

                el.style.width = (tableHeaderLength * cellWidth) + 'px';

                classie.add(el.querySelector('.t-row-desc'), 't-hide');

                getArray(el.querySelectorAll('.t-row-cell')).forEach(function(el) {
                    el.style.width = cellWidth + 'px';
                });

                getArray(el.querySelectorAll('.t-cell-desc-s')).forEach(function(innerEl) {
                    classie.remove(innerEl, 't-hide');
                });

            });

        }

    });

    if (self.pointer > 0) {
        if (oldBreakpoint.cellBreakpoint[0] != breakpoint.cellBreakpoint[0] ||
            oldBreakpoint.descBreakpoint[1] != breakpoint.descBreakpoint[1]) {
            self.move();
        } else {
            if (oldCellWidth != cellWidth) {
                self.move(parseInt(cellWidth - oldCellWidth) * parseInt(self.pointer));
            }
        }
    }

    if (typeof self.options.onRefreshSize === 'function') {
        invokeCallback(self.options.onRefreshSize, self);
    }

    /**
     * Vertical centering the arrows
     */
    self.arrowsCentering();

};

Tabella.prototype.getCellWidth = function(breakpoint) {
    var self = this,
        numberOfCells = self.options.tableHeader.length,
        cellBreakpoint = breakpoint.cellBreakpoint,
        descBreakpoint = breakpoint.descBreakpoint,
        cellWidth;

    if (cellBreakpoint[1] > numberOfCells) {
        cellWidth = (self.el.clientWidth - descBreakpoint[1]) / numberOfCells;
    } else {
        cellWidth = (self.el.clientWidth - descBreakpoint[1]) / cellBreakpoint[1];
    }

    return Math.round(cellWidth);
};

Tabella.prototype.getBreakpoint = function() {

    var self = this,
        minWidth = 0,
        containerWidth = self.el.clientWidth,
        cellBreakpoints = self.options.cellBreakpoints,
        descBreakpoints = self.options.descBreakpoints;

    var cellBreakpoint = [0, 1],
        descBreakpoint = [0, 0];

    for (var cbp in cellBreakpoints) {

        var cbpWidth = cellBreakpoints[cbp][0];

        if (typeof cbpWidth === 'number' && cbpWidth > 0 && cbpWidth <= containerWidth) {

            if (Math.abs(containerWidth - cbpWidth) < Math.abs(containerWidth - minWidth)) {
                minWidth = cbpWidth;
                cellBreakpoint = cellBreakpoints[cbp];
            }

        }

    }

    minWidth = 0;

    for (var dbp in descBreakpoints) {

        var dbpWidth = descBreakpoints[dbp][0];

        if (typeof dbpWidth === 'number' && dbpWidth > 0 && dbpWidth <= containerWidth) {

            if (Math.abs(containerWidth - dbpWidth) < Math.abs(containerWidth - minWidth)) {
                minWidth = dbpWidth;
                descBreakpoint = descBreakpoints[dbp];
            }

        }

    }

    return {
        cellBreakpoint: cellBreakpoint,
        descBreakpoint: descBreakpoint
    };
};

Tabella.prototype.refreshArrowPosition = function(descriptionWidth) {

    var self = this,
        descWidth = descriptionWidth || self.currentBreakpoint.descBreakpoint[1];

    self.arrows.arrowLeft.style.left = descWidth + 'px';
    self.updateArrows();
};

Tabella.prototype.updateArrows = function() {

    var self = this,
        breakpoint = self.currentBreakpoint || self.getBreakpoint(),
        tableHeaderLength = self.options.tableHeader.length;

    if (tableHeaderLength > breakpoint.cellBreakpoint[1]) {

        if (self.pointer === 0) {
            classie.add(self.arrows.arrowLeft, 't-hide');
            classie.remove(self.arrows.arrowRight, 't-hide');
        } else {
            if (self.pointer === tableHeaderLength - breakpoint.cellBreakpoint[1]) {
                classie.remove(self.arrows.arrowLeft, 't-hide');
                classie.add(self.arrows.arrowRight, 't-hide');
            } else {
                classie.remove(self.arrows.arrowLeft, 't-hide');
                classie.remove(self.arrows.arrowRight, 't-hide');
            }
        }

    } else {
        classie.add(self.arrows.arrowLeft, 't-hide');
        classie.add(self.arrows.arrowRight, 't-hide');
    }
};

Tabella.prototype.move = function(x) {

    var self = this,
        cellWidth = self.getCellWidth(self.currentBreakpoint);
    if (x === 'right') {
        if (Animator.animate(self.slidingRows, cellWidth, self.options.duration)) self.pointer++;
    } else {
        if (x === 'left') {
            if (Animator.animate(self.slidingRows, -cellWidth, self.options.duration)) self.pointer--;
        } else {

            if (typeof x === 'number') {
                if (Animator.animate(self.slidingRows, x, getReboundTime(x, self.options.reboundSpeed))) self.pointer = x;
            } else {
                Animator.resetRows(self.slidingRows);
                self.pointer = 0;
            }

        }
    }

    self.updateArrows();
};


Tabella.prototype.setSingleTick = function(trueOrFalse) {
    this.options.swipeSingleTick = !!trueOrFalse;
};

Tabella.prototype.getCurrentBreakPoint = function() {
    return this.currentBreakpoint;
};

Tabella.prototype.arrowsCentering = function() {
    var self = this,
        parentHeight = self.tableHeaderRow.offsetHeight,
        arrowsHeight = self.arrows.arrowRight.offsetHeight;

    if (arrowsHeight && parentHeight > arrowsHeight) {

        // -1 because of the box-shadow
        var verticalMargin = parseInt(((parentHeight - arrowsHeight) / 2) - 1);

        self.arrows.arrowRight.style.marginTop = verticalMargin + 'px';
        self.arrows.arrowLeft.style.marginTop = verticalMargin + 'px';
    }
};
