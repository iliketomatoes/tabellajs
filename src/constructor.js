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

function Tabella(el, options) {
    var self = this;

    var defaults = {
        tableHeader: null,
        rows: null,
        /**
         * BREAKPOINTS :
         * 1st element in array is the row width,
         * the 2nd is the number of cells to be shown
         * Default breakpoint is from [0,1], just one element is shown
         */
        cellBreakpoints: {
            default: [0, 1],
            small: [360, 2],
            medium: [640, 3],
            large: [820, 4],
            xlarge: [1080, 5]
        },
        /**
         * DESCRIPTION BREAKPOINTS :
         * 1st element in array is the row width,
         * the 2nd is the description cell width,
         * Default breakpoint is from [0,0]
         */
        descBreakpoints: {
            default: [0, 0],
            medium: [460, 160],
            large: [900, 200]
        },
        from: 'from',
        to: 'to',
        currency: '&euro;',
        easing: 'easeInOutSine',
        duration: 600,
        reboundSpeed: 300,
        edgeThreshold: 150,
        swipeThreshold: 60,
        swipeSingleTick: true,
        onRefreshSize: false,
        headerRowDevider: '-',
        emptyCell: 'not set',
        fixedHeader: true,
        fixedHeaderBottomThreshold: 80,
        fixedHeaderTop: '0'
    };

    try {

        if (typeof el !== 'undefined') {

            if (typeof options !== 'undefined') {

                self.options = extend(defaults, options);

                if (!self.options.tableHeader || !self.options.rows) {
                    throw new TabellaException('tableHeader or rows are undefined or null');
                }

            } else {

                throw new TabellaException('You did not pass any options to the constructor');
            }

        } else {
            throw new TabellaException('You did not pass a valid target element to the constructor');
        }

    } catch (err) {
        console.error(err.toString());
        return false;
    }

    self.tableHeaderRow = null;
    self.slidingRows = null;
    self.arrows = null;
    self.pointer = 0;
    //An object that has to hold the cellBreakpoint and descBreakpoint
    self.currentBreakpoint = {};
    self.currentCellWidth = 0;
    self.currentWindowWidth = window.innerWidth;

    self.el = el;

    self.tableHeaderRow = TabellaBuilder.setUpTableHeader(self.el, self.options);

    if (self.tableHeaderRow) {

        try {

            if (TabellaBuilder.setUpRows(self.el, self.options)) {

                self.arrows = TabellaBuilder.setUpArrows(self.tableHeaderRow);
                self.slidingRows = getArray(self.el.querySelectorAll('.t-sliding-row'));
                // Returns a function, that, as long as it continues to be invoked, will not
                // be triggered. The function will be called after it stops being called for
                // N milliseconds. If `immediate` is passed, trigger the function on the
                // leading edge, instead of the trailing.
                var debounce = function(func, wait, immediate) {
                    var timeout;

                    return function() {
                        var args = arguments;
                        var later = function() {
                            timeout = null;
                            if (!immediate) func.apply(self, args);
                        };
                        var callNow = immediate && !timeout;
                        clearTimeout(timeout);
                        timeout = setTimeout(later, wait);
                        if (callNow) func.apply(self, args);
                    };
                };

                var firstSet = function() {
                    self.currentBreakpoint = self.getBreakpoint();
                    self.currentCellWidth = self.getCellWidth(self.currentBreakpoint);
                    self.refreshSize();
                };

                if (typeof define === 'function' && define.amd) {
                    firstSet();
                } else {
                    window.addEventListener('load', debounce(firstSet, 50));
                }

                window.addEventListener('resize', debounce(self.refreshSize, 250));

                self.attachEvents();

            } else {
                throw new TabellaException('Number of rows is zero');
            }

        } catch (err) {
            console.error(err.toString());
            return false;
        }

    }

}
