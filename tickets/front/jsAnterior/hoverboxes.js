
function Hoverbox(laboratorio) {
	
	this.laboratorio = laboratorio;
}


Hoverbox.prototype.mostrar = function() {
	this.getJQueryObject().fadeIn();
	return this;
}

Hoverbox.prototype.mostrarSinAnimar = function() {
	this.getJQueryObject().fadeIn(0);
	return this;
}

Hoverbox.prototype.ocultar = function() {
	this.getJQueryObject().fadeOut();
	return this;
}
	
Hoverbox.prototype.ocultarRapido = function() {
	this.getJQueryObject().fadeOut('fast');
	return this;
}
	
Hoverbox.prototype.esVisible = function() {
	return this.getJQueryObject().css('display') != 'none';
}

Hoverbox.prototype.setProfundidad = function(profundidad) {
	this.getJQueryObject().css('z-index', profundidad);
	return this;
}

Hoverbox.prototype.getJQoDeTodasLasOtras = function() {
	return this.getJQueryObject().siblings('.hoverbox');
}

Hoverbox.prototype.setProfundidadDeTodasLasOtras = function(profundidad) {
	this.getJQoDeTodasLasOtras().css('z-index', profundidad);
	return this;
}

Hoverbox.prototype.ocultarTodasLasOtras = function() {
	this.getJQoDeTodasLasOtras().fadeOut(0);
	return this;
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
