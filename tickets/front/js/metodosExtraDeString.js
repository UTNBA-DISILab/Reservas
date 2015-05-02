agregarMetodos(String,[
	{nombre: "endsWith", funcion: function(texto){return this.indexOf(texto, this.length - texto.length) !== -1;}},
	{nombre: "includes", funcion: function(texto){return this.indexOf(texto) != -1;}},
	{nombre: "obtenerParametrosDeURL", funcion: function(){
		if (this.includes("?")){
			return this.split("?").last().split("&").map(function(parametro){
				return {nombre: parametro.split("=").first(),valor: parametro.split("=").last()}
			});
		} else {
			return [];
		};
	}},
	{nombre: "obtenerUnParametroDeURL", funcion: function(nombre){
		return this.obtenerParametrosDeURL().find(function(parametro){return parametro.nombre == nombre});
	}}
]);