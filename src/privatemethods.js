		function _setUpPeriods(periods, container){
			
			if(periods instanceof Array && periods.length){

				var returnedPeriods = [],
					numberOfPeriods = periods.length;

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				container.appendChild(periodRow);

				for(var i = 0; i < numberOfPeriods; i++){

					var periodEl = document.createElement('div');
					periodEl.className = 'period-element';

					var periodDesc = typeof periods[i][0] !== 'undefined' ? periods[i][0] : 'not set';
					
					if(typeof periods[i][1] !== 'undefined'){
						periodDesc += '<br>';
						periodDesc += periods[i][1];
					}

					periodEl.innerHTML = periodDesc;

					periodRow.appendChild(periodEl);

				}

				return true;

			}else{
				return false;
			}
		}	

		function _setUpRows(periods, rows){

			var returnedRows = [],
				numberOfPeriods = periods.length,
				numberOfRows = rows.length;

			if(numberOfRows > 0){

					for(var i = 0; i < numberOfRows; i++){
						for(var prop in rows[i]){

						}
					}

				return true;	

			}else{

				return false;

			}

		}