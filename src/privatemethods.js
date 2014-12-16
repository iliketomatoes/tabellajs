		function _setUpPeriods(periods, container){
			
			if(periods instanceof Array && periods.length){

				var returnedPeriods = [];

				var periodRow = document.createElement('div');
				periodRow.className = 'period-row';
				container.appendChild(periodRow);

				for(var i = 0; i < periods.length; i++){

					console.log(periods[i]);
				}

				return true;

			}else{
				return false;
			}
		}	

		function _setUpRows(periods, rows){

			var returnedRows = [];

			var numberOfPeriods = periods.length;

			var numberOfRows = rows.length;

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