		
		function _setUpPeriods(options, container, cellWidth){
			
			var periods = options.periods;

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var periodWrapper = document.createElement('div');
				periodWrapper.className = 'period-wrapper';
				container.appendChild(periodWrapper);

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				periodRow.style.width = cellWidth * numberOfPeriods + 'px';
				periodWrapper.appendChild(periodRow);

				for(var i = 0; i < numberOfPeriods; i++){

					var periodCell = document.createElement('div');
					periodCell.className = 'period-cell';
					periodCell.style.width = cellWidth + 'px';

					var periodEl = document.createElement('div');
						periodEl.className = 'period-element';

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

					periodEl.innerHTML = periodHTML;

					periodCell.appendChild(periodEl);

					periodRow.appendChild(periodCell);

				}

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

			if(numberOfRows > 0){

					var matchingPeriodCells = true;

					for(var i = 0; i < numberOfRows; i++){

						if(!matchingPeriodCells) break;

						var itemWrapper = document.createElement('div');
						itemWrapper.className = 'item-wrapper';
						container.appendChild(itemWrapper);
	
						if(!!rows[i].desc){
							var itemDesc = document.createElement('section');
							itemDesc.className = 'item-desc';
							itemDesc.innerHTML = rows[i].desc;
							itemWrapper.appendChild(itemDesc);
						}

						if(!!rows[i].prices){

							for(var j = 0; j < rows[i].prices.length; j++){

								if(!matchingPeriodCells) break;

								var itemRow = document.createElement('div');
								itemRow.className = 'item-row';
								itemRow.style.width = cellWidth * numberOfPeriods + 'px';
								itemWrapper.appendChild(itemRow);

								for(var k = 0; k < rows[i].prices[j].length; k++){

									if(rows[i].prices[j].length === numberOfPeriods){
										var itemCell = document.createElement('div');

										var itemClass = 'item-cell';
										if(j >= 1) itemClass += ' cell-border-top';

										itemCell.className = itemClass;
										itemCell.style.width = cellWidth + 'px';

										var itemEl = document.createElement('div');
										itemEl.className = 'item-element';

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

										itemEl.innerHTML = itemHTML;

										itemCell.appendChild(itemEl);

										itemRow.appendChild(itemCell);
									
									}else{
										matchingPeriodCells = false;
										break;
									}
								}
							}
						}
					}

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