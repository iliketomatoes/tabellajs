	
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
| | | | |					     | | | | | *----------------* *---------------* | | | | | | | |
| | | | | 					     | | | | | |.t-cell-desc-s  | | .t-cell-value | | | | | | | | |
| | | | |  						 | | | | | *----------------* *---------------* | | | | | | | | 
| | | | |						 | | | | *--------------------------------------* | | | | | | |                                      
| | | | |                     	 | | | *------------------------------------------* | | | | | |
| | | | |                        | | *----------------------------------------------* | | | | |
| | | | *------------------------* *--------------------------------------------------* | | | |
| | | *---------------------------------------------------------------------------------* | | |
| | *-------------------------------------------------------------------------------------* | |
| *-----------------------------------------------------------------------------------------* |
*---------------------------------------------------------------------------------------------*

*/

	var TabellaBuilder = {

		setUpPeriods : function(el, options){

			var self = this,
					periods = options.periods,
					docfrag = document.createDocumentFragment(),
					tRow;

			try{

				if(periods instanceof Array && periods.length){

					var numberOfPeriods = periods.length;

					tRow = createHTMLEl('div', 't-row t-first-row', docfrag);

					var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

					var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);
					
					var tRowDescHTML = '<div class="t-element">';
						tRowDescHTML +='<div class="t-cell-desc-l">';
						tRowDescHTML += options.from;
						
						if(typeof periods[0][1] !== 'undefined'){	
							tRowDescHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
							tRowDescHTML += options.to;
						}

						tRowDescHTML += '</div>';
						tRowDescHTML += '</div>';  

					var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

					var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

					var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);

					for(var i = 0; i < numberOfPeriods; i++){

						var tRowCell = document.createElement('div');
						tRowCell.className = 't-row-cell';

						//From - to Div	
						var periodHTML = '<div class="t-cell-desc-s">';
							periodHTML += options.from;
						if(typeof periods[i][1] !== 'undefined'){	
							periodHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
							periodHTML += options.to;
						}	
							periodHTML += '</div>'; 	

						//Period actual dates
						periodHTML += '<div class="t-cell-value t-bold">';
						periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
						if(typeof periods[i][1] !== 'undefined'){
							periodHTML += '<span class="t-header-devider">' + options.headerRowDevider + '</span>';
							periodHTML += periods[i][1];
						}
						periodHTML += '</div>'; 

						var tEl = createHTMLEl( 'div', 't-element', tRowCell, periodHTML);

						tSlidingRow.appendChild(tRowCell);

					}

					el.appendChild(docfrag);

					
				}else{
					throw new TabellaException('Periods is not an Array');
				}

			}catch(err){

				tRow = false;
				console.error(err.toString());

			}finally{
				return tRow;
			}
		},

		setUpRows : function (el, options){

			var self = this,
				periods = options.periods,
				rows = options.rows,
				numberOfPeriods = periods.length,
				numberOfRows = rows.length;

			var docfrag = document.createDocumentFragment();

			if(numberOfRows > 0){

					var matchingPeriodCells = true;

					for(var i = 0; i < numberOfRows; i++){

						if(!matchingPeriodCells) break;

						var tRow = createHTMLEl('div', 't-row', docfrag);
					
						if(!!rows[i].desc){
							var tHeader = createHTMLEl('section','t-row-header', tRow, rows[i].desc);
						}

						if(!!rows[i].prices){

							for(var j = 0; j < rows[i].prices.length; j++){

								console.log(rows[i]);
								console.log(typeof rows[i].pricesDesc);

								var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

								var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);	

								if(!matchingPeriodCells) break;

								var cellDescription;

								var tRowDescHTML = '<div class="t-element">';
									tRowDescHTML +='<div class="t-cell-desc-l">';
									tRowDescHTML += (typeof rows[i].pricesDesc !== 'undefined' && !!rows[i].pricesDesc[j]) ? rows[i].pricesDesc[j] : '';
									tRowDescHTML += '</div>';
									tRowDescHTML += '</div>';

								var descClass = 't-row-desc';
								if(j >= 1) descClass += ' t-cell-border-top';	  

								var tRowDesc = createHTMLEl('div', descClass, tRowContent, tRowDescHTML);
			
								
								var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

								var tSlidingRow = createHTMLEl('div', 't-sliding-row', tRowValues);
							
								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var tRowCell = document.createElement('div');

										var cellClass = 't-row-cell';
										if(j >= 1) cellClass += ' t-cell-border-top';

										tRowCell.className = cellClass;

										var cellHTML = '';

										//Cell description
										if(typeof rows[i].pricesDesc !== 'undefined' && !!rows[i].pricesDesc[j]){
							
											cellHTML += '<div class="t-cell-desc-s">';
										
											cellHTML += rows[i].pricesDesc[j];
											
											cellHTML += '</div>';
										}	

										//Item current price
										cellHTML += '<div class="t-cell-value">';
										cellHTML += typeof  rows[i].prices[j][k] !== 'undefined' ?  rows[i].prices[j][k] : 'not set';
										cellHTML += ' ' + options.currency;
										cellHTML+= '</div>'; 


										var tEl = createHTMLEl('div', 't-element', tRowCell, cellHTML);

										tSlidingRow.appendChild(tRowCell);
									
									}else{
										matchingPeriodCells = false;
										break;
									}
								}
							}
						}
					}

				el.appendChild(docfrag);	

				return matchingPeriodCells;	

			}else{

				return false;

			}

		},

		setUpArrows : function(periodRow){

			var self = this;
			// create svg
			var svgURI = 'http://www.w3.org/2000/svg';
			var svgLeft = document.createElementNS( svgURI, 'svg' );
			// SVG attributes, like viewBox, are camelCased. That threw me for a loop
			svgLeft.setAttribute( 'viewBox', '0 0 100 100' );
			// create arrow
			var pathLeft = document.createElementNS( svgURI, 'path' );
			pathLeft.setAttribute( 'd', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z' );
			pathLeft.setAttribute( 'transform', 'translate(15,0)' );
			// add class so it can be styled with CSS
			pathLeft.setAttribute( 'class', 't-svg-arrow' );
			svgLeft.appendChild( pathLeft );
			// add svg to page
			var svgRight = document.createElementNS( svgURI, 'svg' );
			// SVG attributes, like viewBox, are camelCased. That threw me for a loop
			svgRight.setAttribute( 'viewBox', '0 0 100 100' );
			// create arrow
			var pathRight = document.createElementNS( svgURI, 'path' );
			pathRight.setAttribute( 'd', 'M 50,0 L 60,10 L 20,50 L 60,90 L 50,100 L 0,50 Z' );
			// add class so it can be styled with CSS
			pathRight.setAttribute( 'class', 't-svg-arrow' );
			pathRight.setAttribute( 'transform', 'translate(85,100) rotate(180)' );
			svgRight.appendChild( pathRight );

			var rightArrowClasses, leftArrowClasses;

			var arrowRight = createHTMLEl('div', 't-arr-right t-hide', periodRow);

			var arrowLeft = createHTMLEl('div', 't-arr-left t-hide', periodRow);

			arrowRight.appendChild(svgRight);

			arrowLeft.appendChild(svgLeft);
			
			return {
				arrowRight : arrowRight,

				arrowLeft : arrowLeft
			};

		}

	};
