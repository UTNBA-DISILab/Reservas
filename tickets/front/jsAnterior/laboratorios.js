
cargarElementosDeLaboratorios = function() {
	
	cargarRadioMedrano();
	cargarLaboratorios();
}

cargarRadioMedrano = function() {
	
	var radioLabMedrano = new RadioLabMedrano( /* Nada, no tiene hoverbox */ );
	// se inserta despues del label "Laboratorio: " que es el primer hijo
	$('#hover_labs label:first-child').after(radioLabMedrano.toHtml());
	
	radioLabMedrano.bindear();
}

cargarLaboratorios = function() {
	
	var laboratorios = getLaboratorios();
	
	$.each(laboratorios, function(indice, laboratorio) {
		var hoverbox = new Hoverbox(laboratorio);
		var radio = new RadioLab(hoverbox);
		
		$('#colores').append(radio.toHtml());
		$('#colores').append(hoverbox.toHtml());
		
		radio.bindear();
	});	
}

// Pendiente: esta funcion debe hacer un GET request a PHP y obtener los laboratorios
// en formato JSON directamente en lugar de definir ese string y luego convertir.
getLaboratorios = function() {
	var laboratorios_string = '[{"nombre":"verde","prestaciones":{"capacidad":"20","cantidadDePCs":"15","procesadores":"13 Intel Core i5, 2 Intel Core i7","memoriaRAM":"4 GB","monitores":"19 pulgadas"}},{"nombre":"azul","prestaciones":{"capacidad":"20","cantidadDePCs":"15","procesadores":"13 Intel Core i5, 2 Intel Core i7","memoriaRAM":"4 GB","monitores":"19 pulgadas"}},{"nombre":"rojo","prestaciones":{"capacidad":"20","cantidadDePCs":"15","procesadores":"13 Intel Core i5, 2 Intel Core i7","memoriaRAM":"4 GB","monitores":"19 pulgadas"}},{"nombre":"amarillo","prestaciones":{"capacidad":"20","cantidadDePCs":"15","procesadores":"13 Intel Core i5, 2 Intel Core i7","memoriaRAM":"4 GB","monitores":"19 pulgadas"}},{"nombre":"campus","prestaciones":{"capacidad":"20","cantidadDePCs":"15","procesadores":"13 Intel Core i5, 2 Intel Core i7","memoriaRAM":"4 GB","monitores":"19 pulgadas"}}]';
	return JSON.parse(laboratorios_string);
}
