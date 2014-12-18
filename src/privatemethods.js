		function _setUpPeriods(options, container, cellWidth, elAdjustedWidth){
			
			var periods = options.periods;

			if(periods instanceof Array && periods.length){

				var numberOfPeriods = periods.length;

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				periodRow.style.width = elAdjustedWidth + 'px';
				container.appendChild(periodRow);

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

		function _setUpRows(options, container, cellWidth, elAdjustedWidth){

			var periods = options.periods,
				rows = options.rows,
				numberOfPeriods = periods.length,
				numberOfRows = rows.length;

			if(numberOfRows > 0){

					var matchingPeriodCells = true;

					for(var i = 0; i < numberOfRows; i++){

						var itemRow = document.createElement('div');
						itemRow.className = 'item-row';
						itemRow.style.width = elAdjustedWidth + 'px';
						container.appendChild(itemRow);

						for(var prop in rows[i]){
							if(typeof rows[i][prop] === 'string'){
								var itemDesc = document.createElement('section');
								itemDesc.className = 'item-desc';
								itemDesc.innerHTML = rows[i][prop];
								itemRow.appendChild(itemDesc);
							}else{
								if(typeof rows[i][prop] === 'object' && rows[i][prop].length === numberOfPeriods){

								for(var j = 0; j < rows[i][prop].length; j++){
									var itemCell = document.createElement('div');
									itemCell.className = 'item-cell';
									itemCell.style.width = cellWidth + 'px';

									itemCell.innerHTML = rows[i][prop][j];

									itemRow.appendChild(itemCell);
								}
									
								}else{
									matchingPeriodCells = false;
									break;
								}
							}
						}
					}

				return matchingPeriodCells;	

			}else{

				return false;

			}

		}