var agregarMetodo = function(clase, nombreDelMetodo, funcionDelMetodo){
	if (typeof clase.prototype[nombreDelMetodo] !== 'function') {
	    clase.prototype[nombreDelMetodo] = funcionDelMetodo
	}
};

var agregarMetodos = function(clase,nombresYFunciones){
	nombresYFunciones.forEach(function(nombreYFuncion){
		agregarMetodo(clase,nombreYFuncion.nombre,nombreYFuncion.funcion);
	});
};

var agregarMetodoAClase = function(clase, nombreDelMetodo, funcionDelMetodo){
	if (typeof clase[nombreDelMetodo] !== 'function') {
	    clase[nombreDelMetodo] = funcionDelMetodo
	}
};

var agregarMetodosAClase = function(clase,nombresYFunciones){
	nombresYFunciones.forEach(function(nombreYFuncion){
		agregarMetodoAClase(clase,nombreYFuncion.nombre,nombreYFuncion.funcion);
	});
};