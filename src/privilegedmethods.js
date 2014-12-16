
		this.init = function(){
			var self = this;

			self.rows = _setUpRows(self.options.periods, self.options.rows[0]);

			console.log(self.rows);

		};

		this.init();

	//Close Tabella constructor
	}