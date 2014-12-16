
	function Tabella(el, options){

		this.defaults = {
			periods : null,
			rows : null
		};

		this.rows = null;

		this.el = el;

		this.options = extend(this.defaults, options);
