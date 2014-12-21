	
/*
SCHEMA: 

*-----------------------------------------------------------------------------------*
| this.el                                                                           |
| *-------------------------------------------------------------------------------* |
| | .t-row                                                                        | |
| | *---------------------------------------------------------------------------* | |
| | | .t-row-header /// OPTIONAL                                                | | |
| | *---------------------------------------------------------------------------* | |
| | *---------------------------------------------------------------------------* | |
| | | .t-row-content                                                            | | |
| | | *------------------------* *--------------------------------------------* | | |
| | | | .t-row-desc            | | .t-row-values <<<<<< SLIDING PART >>>>>>   | | | |
| | | | *--------------------* | | *----------------------------------------* | | | |
| | | | | .t-element	     | | | | .t-row-cell                            | | | | |
| | | | | *----------------* | | | |                                        | | | | |
| | | |	| | .t-cell-desc-l | | | | |                                        | | | | |
| | | | | *----------------* | | | |                                        | | | | |
| | | | *--------------------* | | | *------------------------------------* | | | | |
| | | |                        | | | | .t-element                         | | | | | |
| | | |                        | | | | *----------------* *---------------* | | | | | 
| | | |                        | | | | | .t-cell-desc-s | | .t-cell-value | | | | | | 
| | | |                        | | | | *----------------* *---------------* | | | | | 
| | | |                        | | | *------------------------------------* | | | | |
| | | |                        | | *----------------------------------------* | | | |
| | | *------------------------* *--------------------------------------------* | | |
| | *---------------------------------------------------------------------------* | |
| *-------------------------------------------------------------------------------* |
*-----------------------------------------------------------------------------------*

*/

		function _setUpPeriods(options, container, cellWidth){
			
			var periods = options.periods;

			var docfrag = document.createDocumentFragment();

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var tRow = createHTMLEl('div', 't-row', docfrag);

				var tRowContent = createHTMLEl('div', 't-row-content', tRow);

				tRowContent.style.width = cellWidth * (numberOfPeriods + 1) + 'px';
				
				var tRowDescHTML = '<div class="t-element">';
					tRowDescHTML +='<div class="t-cell-desc-l">';
					tRowDescHTML += options.from;
					tRowDescHTML += '<br>';
					tRowDescHTML += options.to;
					tRowDescHTML += '</div>';
					tRowDescHTML += '</div>';  

				var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

				tRowDesc.style.width = cellWidth + 'px';

				var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);

				tRowValues.style.width = cellWidth * numberOfPeriods + 'px';

				for(var i = 0; i < numberOfPeriods; i++){

					var tRowCell = document.createElement('div');
					tRowCell.className = 't-row-cell';
					tRowCell.style.width = cellWidth + 'px';

					//From - to Div	
					var periodHTML = '<div class="t-cell-desc-s">';
						periodHTML += options.from;
					if(typeof periods[i][1] !== 'undefined'){	
						periodHTML += '<br>';
						periodHTML += options.to;
					}	
						periodHTML += '</div>'; 	

					//Period actual dates
					periodHTML += '<div class="t-cell-value">';
					periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					if(typeof periods[i][1] !== 'undefined'){
						periodHTML += '<br>';
						periodHTML += periods[i][1];
					}
					periodHTML += '</div>'; 

					var tEl = createHTMLEl( 'div', 't-element', tRowCell, periodHTML);

					tRowValues.appendChild(tRowCell);

				}

				container.appendChild(docfrag);

				return tRow;

			}else{
				return false;
			}
		}	

		function _setUpRows(options, container, cellWidth){

			var periods = options.periods,
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

							var tRowContent = createHTMLEl('div', 't-row-content', tRow);

							tRowContent.style.width = cellWidth * (numberOfPeriods + 1) + 'px';

							for(var j = 0; j < rows[i].prices.length; j++){

								if(!matchingPeriodCells) break;

								var tRowDescHTML = '<div class="t-element">';
									tRowDescHTML +='<div class="t-cell-desc-l">';
									tRowDescHTML += rows[i].pricesDesc[j];
									tRowDescHTML += '</div>';
									tRowDescHTML += '</div>';  

								var tRowDesc = createHTMLEl('div', 't-row-desc', tRowContent, tRowDescHTML);

								tRowDesc.style.width = cellWidth + 'px';

								var tRowValues = createHTMLEl('div', 't-row-values', tRowContent);
								tRowValues.style.width = cellWidth * numberOfPeriods + 'px';
							
								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var tRowCell = document.createElement('div');

										var cellClass = 't-row-cell';
										if(j >= 1) cellClass += ' cell-border-top';

										tRowCell.className = cellClass;
										tRowCell.style.width = cellWidth + 'px';

										var cellHTML = '';

										//Cell description
										if(!!rows[i].pricesDesc[j]){
											cellHTML += '<div class="t-cell-desc-s">';
											if(!!rows[i].pricesDesc[j][k]){
												cellHTML += rows[i].pricesDesc[j][k];
											}else{
												if(!!rows[i].pricesDesc[j][0])
													cellHTML += rows[i].pricesDesc[j][0];
											}
											
											cellHTML += '</div>';
										}	

										//Item current price
										cellHTML += '<div class="t-cell-value">';
										cellHTML += typeof  rows[i].prices[j][k] !== 'undefined' ?  rows[i].prices[j][k] : 'not set';
										cellHTML += ' ' + options.currency;
										cellHTML+= '</div>'; 


										var tEl = createHTMLEl('div', 't-element', tRowCell, cellHTML);

										tRowValues.appendChild(tRowCell);
									
									}else{
										matchingPeriodCells = false;
										break;
									}
								}
							}
						}
					}

				container.appendChild(docfrag);	

				return matchingPeriodCells;	

			}else{

				return false;

			}

		}

		function _setUpArrows(options, container, periodRow){
			//TODO
		}

		function _attachEvents(){
			//TODO
		}