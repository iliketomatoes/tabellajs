	
/*
SCHEMA: 

*---------------------------------------------------------------------------------------------*
| container                                                                                   |
| *-----------------------------------------------------------------------------------------* |
| | .t-row                                                                                  | |
| | *-------------------------------------------------------------------------------------* | |
| | | .t-row-header /// OPTIONAL                                                          | | |
| | *-------------------------------------------------------------------------------------* | | 
| |	*-------------------------------------------------------------------------------------* | |
| | | .t-row-content-wrapper  /// Overflow : hidden                                       | | |
| | | *---------------------------------------------------------------------------------* | | |
| | | | .t-row-content                                                                  | | | |
| | | | *------------------------* *--------------------------------------------------* | | | |								     *----------------------------------------------* | | | |
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
		
		options : null,

		el : null,

		setUpPeriods : function(){

			var self = this;
			
			var periods = self.options.periods;

			var docfrag = document.createDocumentFragment();

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var tRow = createHTMLEl('div', 't-row', docfrag);

				var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

				var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);
				
				var tRowDescHTML = '<div class="t-element">';
					tRowDescHTML +='<div class="t-cell-desc-l">';
					tRowDescHTML += self.options.from;
					tRowDescHTML += '<br>';
					tRowDescHTML += self.options.to;
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
						periodHTML += self.options.from;
					if(typeof periods[i][1] !== 'undefined'){	
						periodHTML += '<br>';
						periodHTML += self.options.to;
					}	
						periodHTML += '</div>'; 	

					//Period actual dates
					periodHTML += '<div class="t-cell-value t-bold">';
					periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					if(typeof periods[i][1] !== 'undefined'){
						periodHTML += '<br>';
						periodHTML += periods[i][1];
					}
					periodHTML += '</div>'; 

					var tEl = createHTMLEl( 'div', 't-element', tRowCell, periodHTML);

					tSlidingRow.appendChild(tRowCell);

				}

				self.el.appendChild(docfrag);

				return tRow;

			}else{
				return false;
			}
		},

		setUpRows : function (){

			var self = this,
				periods = self.options.periods,
				rows = self.options.rows,
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

							var tRowContentWrapper = createHTMLEl('div', 't-row-content-wrapper', tRow);

							var tRowContent = createHTMLEl('div', 't-row-content', tRowContentWrapper);	

								if(!matchingPeriodCells) break;

								var tRowDescHTML = '<div class="t-element">';
									tRowDescHTML +='<div class="t-cell-desc-l">';
									tRowDescHTML += rows[i].pricesDesc[j];
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
										cellHTML += ' ' + self.options.currency;
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

				self.el.appendChild(docfrag);	

				return matchingPeriodCells;	

			}else{

				return false;

			}

		},

		setUpArrows : function(periodRow){

			var self = this;

			var arrowRight = createHTMLEl('div','t-arr-right t-hide', periodRow, self.options.arrowRight);

			var arrowLeft = createHTMLEl('div','t-arr-left t-hide', periodRow, self.options.arrowLeft);
			
			return {
				arrowRight : arrowRight,

				arrowLeft : arrowLeft
			};
		}

	};
