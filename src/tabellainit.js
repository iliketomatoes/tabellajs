	

	if(this.options.periods !== null && this.options.rows !== null){

		this.cellWidth = this.getCellWidth();	

		this.periodRow = _setUpPeriods(this.options, this.el, this.cellWidth, this.el.clientWidth);

		if(this.periodRow){
	
			if(_setUpRows(this.options, this.el, this.cellWidth, this.el.clientWidth)){

				_setUpArrows(this.options, this.el, this.periodRow);

				var self = this;

				window.onload = function(){
					self.refreshSize();
					};

			}else{
				throw new TabellaException('There is a mismatch between periods and prices cells');
			}
		}else{
			throw new TabellaException('Periods is not an Array');
		}
		
	}else{
		throw new TabellaException('Periods or rows are null');
	}
	

		//this.init();

	//Close Tabella constructor
	}