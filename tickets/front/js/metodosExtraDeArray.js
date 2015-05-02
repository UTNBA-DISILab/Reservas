agregarMetodos(Array,[
	{nombre: "first", funcion: function(){return this[0];}},
	{nombre: "last", funcion: function(){return this[this.length-1];}},
	{nombre: "find", funcion: function(criterio){return this.filter(criterio)[0];}}
]);