
function RadioLab(hoverbox) {
	
	this.hoverbox = hoverbox;
}


RadioLab.prototype.bindear = function () {
	
	this.bindearEntrada();
	this.bindearSalida();	
	
}

RadioLab.prototype.bindearEntrada = function() {
	
	var esteRadio = this;
	
	// Cuando el radio se selecciona o se le pasa el cursor por encima,
	this.getJQueryObject().on('mouseenter change', function() {
		
		// la hoverbox asociada
		esteRadio.hoverbox
		// le asigna un valor de profundidad determinado a todo el resto de las hoverboxes,
		.setProfundidadDeTodasLasOtras(10)
		// se asigna a ella misma un valor de profundidad mayor (tapando a las otras),
		.setProfundidad(11)
		// se muestra,
		.mostrar()
		// y oculta a todas las demás, sin esperar a terminar de mostrarse
		// (la animacion de fadeIn dura 400ms por defecto).
		.ocultarTodasLasOtras();
		
	});
}

RadioLab.prototype.bindearSalida = function() {

	var esteRadio = this;
	
	// Cuando el cursor deja de estar encima del radio,
	this.getJQueryObject().on('mouseleave', function() {
		
		// se muestra la hoverbox del radio seleccionado actualmente
		// (puede ser el correspondiente u otro distinto),
		RadioLab.mostrarHoverboxDelSeleccionado();
		// y si el seleccionado no es este,
		// (es decir, si se fue el cursor sin hacer click),
		if(!this.checked) {
			// se oculta la hoverbox correspondiente
			// (y quedara visible la del radio seleccionado,
			// si no es el de cualquier lab).
			esteRadio.ocultarHoverbox();
		}
		
	});	
}

RadioLab.prototype.mostrarHoverboxSinAnimar = function() {
	this.hoverbox.mostrarSinAnimar();
}

RadioLab.prototype.ocultarHoverbox = function() {
	this.hoverbox.ocultar();
}


RadioLab.prototype.toHtml = function() {
	return '<input type="radio" id="radio_' + this.hoverbox.laboratorio.nombre + '" class="radio_lab" name="laboratorio" value="' + this.hoverbox.laboratorio.nombre + '"/><label for="radio_' + this.hoverbox.laboratorio.nombre + '" class="nombre_radio primera_mayus">' + this.hoverbox.laboratorio.nombre + '</label>';
}

// precondicion: el objeto debe existir en la pagina html
RadioLab.prototype.getJQueryObject = function() {
	return $('#radio_' + this.hoverbox.laboratorio.nombre);
}


RadioLab.mostrarHoverboxDelSeleccionado = function() {
	RadioLab.getHoverboxDelSeleccionado().fadeIn(0);
}

RadioLab.getHoverboxDelSeleccionado = function() {
	return RadioLab.getJQoDelRadioSeleccionado().nextAll('.hoverbox:first');
}

RadioLab.getJQoDelRadioSeleccionado = function() {
	
	var jQoDelRadioSeleccionado = $('#radio_medrano');
	
	RadioLab.getJQoConTodos().each(function(indice, radio) {
		if (radio.checked) {
			jQoDelRadioSeleccionado = $(radio);
			return false; //break
		}
	});
	
	return jQoDelRadioSeleccionado;
}

RadioLab.getJQoConTodos = function() {
	return $('.radio_lab');
}


function RadioLabMedrano(hoverbox) {
	
	this.hoverbox = hoverbox;
}
RadioLabMedrano.prototype = new RadioLab();


RadioLabMedrano.prototype.bindearEntrada = function() { // "property shadowing"
	
	// Cuando se hace click en el radio,
	this.getJQueryObject().on('click', function() {
		
		// se igualan las profundidades de todas las hoverboxes,
		Hoverbox.setProfundidadDeTodas(10);
		// y se ocultan todas rápido.
		Hoverbox.ocultarTodasRapido();
		// El lugar de las hoverboxes queda vacío.
	});
	// Ademas del click detecta también la seleccion. Viene bien pero es misterioso.
	
}

RadioLabMedrano.prototype.mostrarHoverboxSinAnimar = function() {
	// nada, no tiene hoverbox
}

RadioLabMedrano.prototype.ocultarHoverbox = function() {
	// nada, no tiene hoverbox
}

RadioLabMedrano.prototype.toHtml = function() {
	return '<input type="radio" id="radio_medrano" name="laboratorio" value="medrano" checked="true" /><label for="radio_medrano" class="nombre_radio">Cualquiera en Medrano con capacidad suficiente</label>';
}

RadioLabMedrano.prototype.getJQueryObject = function() {
	return $('#radio_medrano');
}
