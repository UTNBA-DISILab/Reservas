
function Laboratorio(nombre, prestacionesLab) {
	
	this.nombre = nombre;
	this.prestaciones = prestacionesLab;
	
}

Laboratorio.prototype.setPrestaciones = function(prestaciones) {
	this.prestaciones = prestaciones;
}


function PrestacionesLab(capacidad, cantidadDePCs, procesadores, memoriaRAM, monitores) {
	this.capacidad = capacidad;
	this.cantidadDePCs = cantidadDePCs;
	this.procesadores = procesadores;
	this.memoriaRAM = memoriaRAM;
	this.monitores = monitores;
}


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
		
		// A todo el resto de las hoverboxes se le asigna un valor de profundidad determinado,
		esteRadio.hoverbox.setProfundidadDeTodasLasOtras(10);
		// a la hoverbox asociada se le asigna un valor de profundidad mayor,
		esteRadio.hoverbox.setProfundidad(11);
		// se muestra la hoverbox pasada por parametro,
		esteRadio.hoverbox.mostrar();
		// se oculta el resto de las hoverboxes, sin esperar
		// que la asociada se termine de mostrar
		// (la animacion de fadeIn dura 400ms por defecto).
		esteRadio.hoverbox.ocultarTodasLasOtras();
		
	});
}

RadioLab.prototype.bindearSalida = function() {

	var esteRadio = this;
	
	// Cuando el cursor deja de estar encima del radio,
	this.getJQueryObject().on('mouseleave', function() {
		
		// se muestra la hoverbox del radio seleccionado actualmente
		// (puede ser el correspondiente u otro distinto),
		// juju la ventana desaparece pero no esta abajo la seleccionada
		RadioLab.getRadioSeleccionado().next().next().fadeIn(0); //Pendiente: esto deberia ser "RadioLab.getRadioSeleccionado().mostrarHoverboxSinAnimar();". Cambiar cuando getRadioSeleccionado() devuelva un RadioLab y no un jQuery object
		
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
	return '<input type="radio" id="radio_' + this.hoverbox.laboratorio.nombre + '" class="radio_lab" name="laboratorio" value="' + this.hoverbox.laboratorio.nombre + '" /> <span class="primera_mayus">' + this.hoverbox.laboratorio.nombre + '</span>&nbsp;&nbsp';
}


// precondicion: el objeto debe existir en la pagina html
RadioLab.prototype.getJQueryObject = function() {
	return $('#radio_' + this.hoverbox.laboratorio.nombre);
}


RadioLab.getRadioSeleccionado = function() {
	
	var radioSeleccionado_jQo = $('#radio_cualquiera');
	
	$('.radio_lab').each(function(indice, radio) {
		if (radio.checked) {
			radioSeleccionado_jQo = $(radio);
			return false; //break
		}
	});
	
	return RadioLab.fromJQo(radioSeleccionado_jQo);		
}

RadioLab.fromJQo = function(radio_jQo) {
	return radio_jQo; //Pendiente. necesitamos una especie de diccionario para pasar del jQuery object a la instancia unica de RadioLab del lab correspondiente, por ejemplo por los ID de html.
}


function RadioLabCualquiera(hoverbox) {
	
	this.hoverbox = hoverbox;
}
RadioLabCualquiera.prototype = new RadioLab();

RadioLabCualquiera.prototype.bindearEntrada = function() { // "property shadowing"
	
	// Cuando se hace click en el radio,
	this.getJQueryObject().on('click', function() {
		
		// se igualan las profundidades de todas las hoverboxes,
		Hoverbox.setProfundidadDeTodas(10);
		// y se ocultan todas rapido.
		Hoverbox.ocultarTodasRapido();
		// El lugar de las hoverboxes queda vacio.
	});
	// Ademas del click detecta tambien la seleccion. Viene bien pero es misterioso.
	
}

RadioLabCualquiera.prototype.mostrarHoverboxSinAnimar = function() {
	// nada, no tiene hoverbox
}

RadioLabCualquiera.prototype.ocultarHoverbox = function() {
	// nada, no tiene hoverbox
}

RadioLabCualquiera.prototype.toHtml = function() {
	return '<input type="radio" id="radio_cualquiera" name="laboratorio" value="cualquiera" checked="true" /> Cualquiera con capacidad suficiente';
}

RadioLabCualquiera.prototype.getJQueryObject = function() {
	return $('#radio_cualquiera');
}



function Hoverbox(laboratorio) {
	
	this.laboratorio = laboratorio;	
}

Hoverbox.prototype.mostrar = function() {
	this.getJQueryObject().fadeIn();
}

Hoverbox.prototype.mostrarSinAnimar = function() {
	this.getJQueryObject().fadeIn(0);
}

Hoverbox.prototype.ocultar = function() {
	this.getJQueryObject().fadeOut();
}
	
Hoverbox.prototype.ocultarRapido = function() {
	this.getJQueryObject().fadeOut('fast');
}
	
Hoverbox.prototype.esVisible = function() {
	return this.getJQueryObject().css('display') != 'none';
}

Hoverbox.prototype.setProfundidad = function(profundidad) {
	this.getJQueryObject().css('z-index', profundidad);
}

Hoverbox.prototype.getJQoDeTodasLasOtras = function() {
	return this.getJQueryObject().siblings('.hoverbox');
}

Hoverbox.prototype.setProfundidadDeTodasLasOtras = function(profundidad) {
	this.getJQoDeTodasLasOtras().css('z-index', profundidad);
}

Hoverbox.prototype.ocultarTodasLasOtras = function() {
	this.getJQoDeTodasLasOtras().fadeOut(0);
}



Hoverbox.prototype.toHtml = function() {
	return '<div id="hoverbox_' + this.laboratorio.nombre + '" class="hoverbox lab_' + this.laboratorio.nombre + '"> \
				<div class="titulo_hoverbox" >Prestaciones del laboratorio <span class="primera_mayus">' + this.laboratorio.nombre + '</span></div> \
				<table> \
					<tr> \
						<td>Capacidad: </td> \
						<td>' + this.laboratorio.prestaciones.capacidad + '</td> \
					</tr> \
					<tr> \
						<td>Cantidad de PCs: </td> \
						<td>' + this.laboratorio.prestaciones.cantidadDePCs + '</td> \
					</tr> \
					<tr> \
						<td>Procesadores: </td> \
						<td>' + this.laboratorio.prestaciones.procesadores + '</td> \
					</tr> \
					<tr> \
						<td>Memoria RAM: </td> \
						<td>' + this.laboratorio.prestaciones.memoriaRAM + '</td> \
					</tr> \
					<tr> \
						<td>Monitores: </td> \
						<td>' + this.laboratorio.prestaciones.monitores + '</td> \
					</tr> \
				</table> \
			</div>';
}

// precondicion: el objeto debe existir en la pagina html
Hoverbox.prototype.getJQueryObject = function() {
	return $('#hoverbox_' + this.laboratorio.nombre);
}



Hoverbox.getJQoConTodas = function() {
	return $('.hoverbox');
}

Hoverbox.setProfundidadDeTodas = function(profundidad) {
	this.getJQoConTodas().css('z-index', profundidad);
}

Hoverbox.ocultarTodasRapido = function() {
	this.getJQoConTodas().fadeOut('fast');
}




laboratorios = {};
//hoverboxes = {};
//radios = {};


crearElementosDeLosLaboratorios = function() {
	
	var radioLabCualquiera = new RadioLabCualquiera( /* Nada, no tiene hoverbox */ );
	// se inserta despues del label "Laboratorio: " que es el primer hijo
	$('#hover_labs label:first-child').after(radioLabCualquiera.toHtml());
	
	radioLabCualquiera.bindear();
	
	
	laboratorios.verde = new Laboratorio('verde');  // trim, tolowercase si viene de php
	laboratorios.verde.prestaciones = new PrestacionesLab('20 personas', '15', '13 Intel Core i5, 2 Intel Core i7', '4 GB', '19 pulgadas');
	
	crearElementosDelLab(laboratorios.verde);	
	
	laboratorios.azul = new Laboratorio('azul');  // trim, tolowercase si viene de php
	laboratorios.azul.prestaciones = new PrestacionesLab('20 personas', '15', '13 Intel Core i5, 2 Intel Core i7', '4 GB', '19 pulgadas');
	
	crearElementosDelLab(laboratorios.azul);
	
	
	laboratorios.rojo = new Laboratorio('rojo');  // trim, tolowercase si viene de php
	laboratorios.rojo.prestaciones = new PrestacionesLab('20 personas', '15', '13 Intel Core i5, 2 Intel Core i7', '4 GB', '19 pulgadas');
	crearElementosDelLab(laboratorios.rojo);
	
	
	laboratorios.amarillo = new Laboratorio('amarillo');  // trim, tolowercase si viene de php
	laboratorios.amarillo.prestaciones = new PrestacionesLab('20 personas', '15', '13 Intel Core i5, 2 Intel Core i7', '4 GB', '19 pulgadas');
	
	crearElementosDelLab(laboratorios.amarillo);
	
}

crearElementosDelLab = function(lab) {
	
	var hoverbox = new Hoverbox(lab);
	var radio = new RadioLab(hoverbox);
	
	$('#colores').append(radio.toHtml());
	$('#colores').append(hoverbox.toHtml());
	
	radio.bindear();
}

