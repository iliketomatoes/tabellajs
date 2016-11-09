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

	/*
	SCHEMA:

	*---------------------------------------------------------------------------------------------*
	| container                                                                                   |
	| *-----------------------------------------------------------------------------------------* |
	| | .t-row   /// first row has: .t-first-row                                                | |
	| | *-------------------------------------------------------------------------------------* | |
	| | | .t-row-header /// OPTIONAL                                                          | | |
	| | *-------------------------------------------------------------------------------------* | |
	| |	*-------------------------------------------------------------------------------------* | |
	| | | .t-row-content-wrapper  /// Overflow : hidden                                       | | |
	| | | *---------------------------------------------------------------------------------* | | |
	| | | | .t-row-content                                                                  | | | |
	| | | | *------------------------* *--------------------------------------------------* | | | |
	| | | | | .t-row-desc            | | .t-row-values                                    | | | | |
	| | | | | *--------------------* | | *----------------------------------------------* | | | | |
	| | | |	| | .t-element	       | | | |  .t-sliding-row   <<<<<< SLIDING PART >>>>>> | | | | | |
	| | | | | | *----------------* | | | | *------------------------------------------* | | | | | |
	| | | | | |	| .t-cell-desc-l | | | | | | .t-row-cell                              | | | | | | |
	| | | | | |	*----------------* | | | | | *--------------------------------------* | | | | | | |
	| | | | | *--------------------* | | | | | .t-element                           | | | | | | | |
	| | | | |					               | | | | | *----------------* *---------------* | | | | | | | |
	| | | | | 					             | | | | | |.t-cell-desc-s  | | .t-cell-value | | | | | | | | |
	| | | | |  						           | | | | | *----------------* *---------------* | | | | | | | |
	| | | | |						             | | | | *--------------------------------------* | | | | | | |
	| | | | |                     	 | | | *------------------------------------------* | | | | | |
	| | | | |                        | | *----------------------------------------------* | | | | |
	| | | | *------------------------* *--------------------------------------------------* | | | |
	| | | *---------------------------------------------------------------------------------* | | |
	| | *-------------------------------------------------------------------------------------* | |
	| *-----------------------------------------------------------------------------------------* |
	*---------------------------------------------------------------------------------------------*

	*/

	var TabellaBuilder = {

	    setUpTableHeader: function(el, options) {

	        var tableHeader = options.tableHeader,
	            docfrag = document.createDocumentFragment(),
	            tRow,
							tRowDesc,
							tEl;

	        try {

	            if (tableHeader instanceof Array && tableHeader.length) {

	                //Table header row's container
	                var fixedHeader = createHTMLEl('div', 't-fixed-header', docfrag);

	                tRow = createHTMLEl('div', 't-row t-first-row', fixedHeader);

	                var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

	                var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);

	                var tRowDescHTML = '<div class="t-element">';
	                tRowDescHTML += '<div class="t-cell-desc-l">';
	                tRowDescHTML += options.from;

	                if (typeof tableHeader[0][1] !== 'undefined') {
	                    tRowDescHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
	                    tRowDescHTML += options.to;
	                }

	                tRowDescHTML += '</div>';
	                tRowDescHTML += '</div>';

	                tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

	                var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

	                var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);

	                for (var i = 0; i < tableHeader.length; i++) {

	                    var tRowCell = document.createElement('div');
	                    tRowCell.className = 't-row-cell';

	                    //From - to Div
	                    var tableHeaderCellHTML = '<div class="t-cell-desc-s">';
	                    tableHeaderCellHTML += options.from;
	                    if (typeof tableHeader[i][1] !== 'undefined') {
	                        tableHeaderCellHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
	                        tableHeaderCellHTML += options.to;
	                    }
	                    tableHeaderCellHTML += '</div>';

	                    //Table headr cell actual value
	                    tableHeaderCellHTML += '<div class="t-cell-value t-bold">';
	                    tableHeaderCellHTML += typeof tableHeader[i][0] !== 'undefined' ? tableHeader[i][0] : 'not set';
	                    if (typeof tableHeader[i][1] !== 'undefined') {
	                        tableHeaderCellHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
	                        tableHeaderCellHTML += tableHeader[i][1];
	                    }
	                    tableHeaderCellHTML += '</div>';

	                    tEl = createHTMLEl('div', 't-element', tRowCell, tableHeaderCellHTML);

	                    tSlidingRow.appendChild(tRowCell);

	                }

	                el.appendChild(docfrag);


	            } else {
	                throw new TabellaException('tableHeader is not an Array');
	            }

	        } catch (err) {

	            tRow = false;
	            console.error(err.toString());

	        } finally {
	            return tRow;
	        }
	    },

	    setUpRows: function(el, options) {

	        var tableHeader = options.tableHeader,
	            rows = options.rows,
	            numberOfRows = rows.length,
							tHeader,
							tRowDesc,
							tEl;

	        var docfrag = document.createDocumentFragment();

	        if (numberOfRows > 0) {

	            for (var i = 0; i < numberOfRows; i++) {

	                var tRow = createHTMLEl('div', 't-row', docfrag);

	                if (!!rows[i].rowHeader) {
	                    tHeader = createHTMLEl('section', 't-row-header', tRow, rows[i].rowHeader);
	                }

	                if (!!rows[i].rowVal) {

	                    for (var j = 0; j < rows[i].rowVal.length; j++) {

	                        var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

	                        var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);

	                        var tRowDescHTML = '<div class="t-element">';
	                        tRowDescHTML += '<div class="t-cell-desc-l">';
	                        tRowDescHTML += (typeof rows[i].rowDesc !== 'undefined' && !!rows[i].rowDesc[j]) ? rows[i].rowDesc[j] : '';
	                        tRowDescHTML += '</div>';
	                        tRowDescHTML += '</div>';

	                        var descClass = 't-row-desc';
	                        if (j >= 1) descClass += ' t-cell-border-top';

	                        tRowDesc = createHTMLEl('div', descClass, tRowContent, tRowDescHTML);


	                        var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

	                        var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);

	                        for (var k = 0; k < tableHeader.length; k++) {

	                            var tRowCell = document.createElement('div');

	                            var cellClass = 't-row-cell';
	                            if (j >= 1) cellClass += ' t-cell-border-top';

	                            tRowCell.className = cellClass;

	                            var cellHTML = '';

	                            //Cell description
	                            if (typeof rows[i].rowDesc !== 'undefined' && !!rows[i].rowDesc[j]) {

	                                cellHTML += '<div class="t-cell-desc-s">';

	                                cellHTML += rows[i].rowDesc[j];

	                                cellHTML += '</div>';
	                            }

	                            //Item current value
	                            cellHTML += '<div class="t-cell-value">';

	                            if (typeof rows[i].rowVal[j][k] !== 'undefined') {

	                                cellHTML += rows[i].rowVal[j][k];

	                                //If it's a number we add the currency
	                                if (!isNaN(rows[i].rowVal[j][k])) {
	                                    cellHTML += ' ' + options.currency;
	                                }

	                            } else {
	                                cellHTML += options.emptyCell;
	                            }
	                            cellHTML += '</div>';


	                            tEl = createHTMLEl('div', 't-element', tRowCell, cellHTML);

	                            tSlidingRow.appendChild(tRowCell);
	                        }
	                    }
	                }
	            }

	            el.appendChild(docfrag);

	            return numberOfRows;

	        } else {

	            return false;

	        }

	    },

	    setUpArrows: function(tableHeaderRow) {

	        // create svg
	        var svgURI = 'http://www.w3.org/2000/svg';
	        var svgLeft = document.createElementNS(svgURI, 'svg');
	        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
	        svgLeft.setAttribute('viewBox', '0 0 100 100');
	        // create arrow
	        var pathLeft = document.createElementNS(svgURI, 'path');
	        pathLeft.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
	        pathLeft.setAttribute('transform', 'translate(15,0)');
	        // add class so it can be styled with CSS
	        pathLeft.setAttribute('class', 't-svg-arrow');
	        svgLeft.appendChild(pathLeft);
	        // add svg to page
	        var svgRight = document.createElementNS(svgURI, 'svg');
	        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
	        svgRight.setAttribute('viewBox', '0 0 100 100');
	        // create arrow
	        var pathRight = document.createElementNS(svgURI, 'path');
	        pathRight.setAttribute('d', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z');
	        // add class so it can be styled with CSS
	        pathRight.setAttribute('class', 't-svg-arrow');
	        pathRight.setAttribute('transform', 'translate(85,100) rotate(180)');
	        svgRight.appendChild(pathRight);

	        var arrowRight = createHTMLEl('div', 't-arr-right t-hide', tableHeaderRow);

	        var arrowLeft = createHTMLEl('div', 't-arr-left t-hide', tableHeaderRow);

	        arrowRight.appendChild(svgRight);

	        arrowLeft.appendChild(svgLeft);

	        return {
	            arrowRight: arrowRight,

	            arrowLeft: arrowLeft
	        };

	    }

	};
