
		try{
			if(this.options.periods !== null && this.options.rows !== null){
				this.rows = _setUpRows(this.options.periods, this.options.rows[0]);
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