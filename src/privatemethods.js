		
		function _setUpPeriods(options, container, cellWidth){
			
			var periods = options.periods;

			var docfrag = document.createDocumentFragment();

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var periodWrapper = createHTMLEl('div', 'period-wrapper', docfrag);

				var rowWrapper = createHTMLEl('div', 'row-wrapper', periodWrapper);

				rowWrapper.style.width = cellWidth * (numberOfPeriods + 1) + 'px';
				
				var periodDescHTML = '<div class="period-element">';
					periodDescHTML +='<div class="period-large-fromto">';
					periodDescHTML += options.from;
					periodDescHTML += '<br>';
					periodDescHTML += options.to;
					periodDescHTML += '</div>';
					periodDescHTML += '</div>';  

				var periodDescription = createHTMLEl('div', 'period-description', rowWrapper, periodDescHTML);

				periodDescription.style.width = cellWidth + 'px';

				var periodRow = createHTMLEl('div', 'period-row', rowWrapper);

				periodRow.style.width = cellWidth * numberOfPeriods + 'px';

				for(var i = 0; i < numberOfPeriods; i++){

					var periodCell = document.createElement('div');
					periodCell.className = 'period-cell';
					periodCell.style.width = cellWidth + 'px';

					//From - to Div	
					var periodHTML = '<div class="period-fromto">';
						periodHTML += options.from;
					if(typeof periods[i][1] !== 'undefined'){	
						periodHTML += '<br>';
						periodHTML += options.to;
					}	
						periodHTML += '</div>'; 	

					//Period actual dates
					periodHTML += '<div class="period-date">';
					periodHTML += typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					if(typeof periods[i][1] !== 'undefined'){
						periodHTML += '<br>';
						periodHTML += periods[i][1];
					}
					periodHTML += '</div>'; 

					var periodEl = createHTMLEl( 'div', 'period-element', periodCell, periodHTML);

					periodRow.appendChild(periodCell);

				}

				container.appendChild(docfrag);

				return periodRow;

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

						var itemWrapper = createHTMLEl('div', 'item-wrapper', docfrag);
					
						if(!!rows[i].desc){
							var itemDesc = createHTMLEl('section','item-desc', itemWrapper, rows[i].desc);
						}

						if(!!rows[i].prices){

							for(var j = 0; j < rows[i].prices.length; j++){

								if(!matchingPeriodCells) break;

						
								var itemRow = createHTMLEl('div', 'item-row', itemWrapper);
								itemRow.style.width = cellWidth * numberOfPeriods + 'px';
							
								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var itemCell = document.createElement('div');

										var itemClass = 'item-cell';
										if(j >= 1) itemClass += ' cell-border-top';

										itemCell.className = itemClass;
										itemCell.style.width = cellWidth + 'px';

										var itemHTML = '';

										//Cell description
										if(!!rows[i].pricesDesc[j]){
											itemHTML += '<div class="item-cell-desc">';
											if(!!rows[i].pricesDesc[j][k]){
												itemHTML += rows[i].pricesDesc[j][k];
											}else{
												if(!!rows[i].pricesDesc[j][0])
													itemHTML += rows[i].pricesDesc[j][0];
											}
											
											itemHTML += '</div>';
										}	

										//Item current price
										itemHTML += '<div class="item-value">';
										itemHTML += typeof  rows[i].prices[j][k] !== 'undefined' ?  rows[i].prices[j][k] : 'not set';
										itemHTML += ' ' + options.currency;
										itemHTML+= '</div>'; 


										var itemEl = createHTMLEl('div', 'item-element', itemCell, itemHTML);

										itemRow.appendChild(itemCell);
									
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