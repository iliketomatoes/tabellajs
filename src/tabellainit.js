	
	var self = this;

	if(self.options.periods !== null && self.options.rows !== null){

		self.cellWidth = self.getCellWidth();	

		self.periodRow = TabellaBuilder.prototype.setUpPeriods(self.options, self.el, self.cellWidth, self.el.clientWidth);

		if(self.periodRow){
	
			if(TabellaBuilder.prototype.setUpRows(self.options, self.el, self.cellWidth, self.el.clientWidth)){

				TabellaBuilder.prototype.setUpArrows(self.options, self.el, self.periodRow);

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
	

		//self.init();

	//Close Tabella constructor
	}