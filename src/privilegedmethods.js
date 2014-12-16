
		try{
			if(this.options.periods !== null && this.options.rows !== null){

				this.periods = _setUpPeriods(this.options.periods, this.el);

				if(this.periods){
					this.rows = _setUpRows(this.options.periods, this.options.rows);

					if(!!this.rows){

					}else{
						throw new TabellaException('There is a mismatch between periods and prices cells');
					}
				}else{
					throw new TabellaException('Periods is not an Array');
				}
				
			}else{
				throw new TabellaException('Periods or rows are null');
			}
		}catch(e){
			console.error(e.toString());
			return e;
		}

		//this.init();

	//Close Tabella constructor
	}