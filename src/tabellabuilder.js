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
	        svgLeft.setAttribute('viewBox', '0 0 38.996 38.996');
	        var gLeft = document.createElementNS(svgURI, 'g');
	        //create circle
	        var circleLeft = document.createElementNS(svgURI, 'path');
	        circleLeft.setAttribute('d', 'M19.498,1c10.2,0,18.498,8.298,18.498,18.498c0,10.2-8.298,18.498-18.498,18.498 C9.298,37.996,1,29.698,1,19.498C1,9.298,9.298,1,19.498,1 M19.498,0C8.73,0,0,8.73,0,19.498c0,10.77,8.73,19.498,19.498,19.498 c10.77,0,19.498-8.729,19.498-19.498C38.996,8.73,30.268,0,19.498,0L19.498,0z');
	        // add class so it can be styled with CSS
	        circleLeft.setAttribute('class', 't-svg-arrow');
	        // create arrow
	        var pathLeft = document.createElementNS(svgURI, 'path');
	        pathLeft.setAttribute('d', 'M21.947,12.654c0.169,0,0.34,0.064,0.469,0.193c0.259,0.259,0.259,0.676,0,0.935l-5.991,5.995l5.991,6 c0.255,0.258,0.255,0.676,0,0.934c-0.258,0.26-0.68,0.26-0.938,0l-6.458-6.464c-0.258-0.259-0.258-0.676,0-0.936l6.458-6.464 C21.607,12.719,21.779,12.654,21.947,12.654L21.947,12.654z');
	        // add class so it can be styled with CSS
	        pathLeft.setAttribute('class', 't-svg-arrow');
	        
	        gLeft.appendChild(pathLeft);
	        gLeft.appendChild(circleLeft);
	        svgLeft.appendChild(gLeft);
	        // add svg to page
	        var svgRight = document.createElementNS(svgURI, 'svg');
	        // SVG attributes, like viewBox, are camelCased. That threw me for a loop
	        svgRight.setAttribute('viewBox', '0 0 38.996 38.996');
	        var gRight = document.createElementNS(svgURI, 'g');
	        //create circle
	        var circleRight = document.createElementNS(svgURI, 'path');
	        circleRight.setAttribute('d', 'M19.498,1c10.2,0,18.498,8.298,18.498,18.498c0,10.2-8.298,18.498-18.498,18.498 C9.298,37.996,1,29.698,1,19.498C1,9.298,9.298,1,19.498,1 M19.498,0C8.73,0,0,8.73,0,19.498c0,10.77,8.73,19.498,19.498,19.498 c10.77,0,19.498-8.729,19.498-19.498C38.996,8.73,30.268,0,19.498,0L19.498,0z');
	        // add class so it can be styled with CSS
	        circleRight.setAttribute('class', 't-svg-arrow');
	        // create arrow
	        var pathRight = document.createElementNS(svgURI, 'path');
	        pathRight.setAttribute('d', 'M17.049,26.342c-0.169,0-0.34-0.064-0.469-0.193c-0.259-0.258-0.259-0.676,0-0.935l5.99-5.995l-5.99-6 c-0.255-0.258-0.255-0.675,0-0.934c0.257-0.259,0.68-0.259,0.938,0l6.457,6.464c0.258,0.259,0.258,0.676,0,0.936l-6.457,6.463 C17.389,26.277,17.217,26.342,17.049,26.342L17.049,26.342z');
	        // add class so it can be styled with CSS
	        pathRight.setAttribute('class', 't-svg-arrow');
	        
	        gRight.appendChild(pathRight);
	        gRight.appendChild(circleRight)
	        svgRight.appendChild(gRight);

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
