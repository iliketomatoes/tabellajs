
	function Tabella(el, options){

		this.defaults = {
			periods : null,
			rows : null
		};

		this.rows = null;

		this.el = el;

		try{
			if(typeof el !== 'undefined'){
				if(typeof options !== 'undefined'){
					this.options = extend(this.defaults, options);
				}else{
					throw new TabellaException('You did not pass any options to the constructor');
				}
			}else{
				throw new TabellaException('You did not pass a valid target element to the constructor');
			}		

		}catch(e){
			console.error(e.toString());
			return e;
		}

		