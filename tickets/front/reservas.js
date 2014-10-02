
// Cuando la pagina termina de cargar,
$(document).ready(function(){
	
	// Se definen e inicializan variables globales,
	
	/* -------- CONSTANTES -------- */
	PANTALLA_INICIO = document.getElementById('inicio_div');
	PANTALLA_SOLICITAR_RESERVAS = document.getElementById('solicitar_reservas_div');
	PANTALLA_VER_RESERVAS = document.getElementById('ver_reservas_div');
	/* ---------------------------- */
	
	pantallaActual = PANTALLA_INICIO;
	
	// y se establecen los eventos para las distintas acciones sobre los distintos elementos.
	bindearTodasLasOpciones();
	cargarElementosDeLaboratorios();
	cargarElementosDeFechas();

});

bindearTodasLasOpciones = function() {
	
	bindearOpcionInicio();
	bindearOpcionSolicitarReservas();
	bindearOpcionVerReservas();
	bindearOpcionCerrarSesion();
	
}

bindearOpcionInicio = function() {
	// Cuando se hace click en inicio,
	$('a[href="#inicio"]').click(function(){
		
		// se cambia la pantalla actual por la de inicio.
		cambiarPantallaActualPor(PANTALLA_INICIO);
		
	});
}

bindearOpcionSolicitarReservas = function() {
	// Cuando se hace click en solicitar reservas,
	$('a[href="#solicitar_reservas"]').click(function(){
		
		// se cambia la pantalla actual por la de solicitar reservas, y luego
		cambiarPantalla(PANTALLA_SOLICITAR_RESERVAS, function() {}, null, function() {
			// se autocompleta el nombre del docente, que ya se conoce porque ya se logueo,
			$('#nombre').val('Cosme Fulanito'); // Pendiente: obtener el nombre del docente de la sesion actual
			// se prohibe modificar ese campo,
			$('#nombre').prop('readonly', 'readonly');
			// y se pone el foco en el cuadro de texto de la materia.
			$('#materia').focus();
		});
		
	});
}

function Reserva(reservaJSON) {
	
	//this.docente = docente;
	this.fecha_alta = reservaJSON.fecha_alta;
	this.cant_alumnos = reservaJSON.cant_alumnos;
	this.laboratorio = reservaJSON.laboratorio;
	this.turno = reservaJSON.turno;
	this.fecha_pedida = reservaJSON.fecha_pedida;
	this.estado = reservaJSON.estado;
	this.lab_ofrecido = reservaJSON.lab_ofrecido;
}

Reserva.prototype.toHtml = function() {
	
	var estadoExtra = '';
	
	// Si el campo lab_ofrecido tiene datos, es decir, si se confirmó una reserva que era por cualquier lab, o si el estado de la reserva es contra-ofertada,
	if(this.lab_ofrecido) {
		estadoExtra = '<br>&#40;Lab&nbsp;<span class="nombre_lab_span lab_' + this.lab_ofrecido + '">' + this.lab_ofrecido + '</span>&#41;'
	}
	
	return '<tr><td>' + this.fecha_alta + '</td><td>' + this.cant_alumnos + '</td><td><span class="nombre_lab_span lab_' + this.laboratorio + '">' + this.laboratorio + '</span></td><td class="primera_mayus">' + this.turno + '</td><td>' + this.fecha_pedida + '</td><td class="' + this.estado + ' primera_mayus">' + this.estado + estadoExtra + '</td></tr>';
}

Reserva.celdaLoadingHtml = function() {
	
	var numColumnas = 6;
	var texto = 'Consultando la base de datos...';
	
	return '<tr><td colspan="' + numColumnas.toString() + '">' + texto + '</td></tr>';
}

bindearOpcionVerReservas = function() {
	$('a[href="#ver_reservas"]').click(function(){
		
		var reservasDelDocente = getReservasDeDocente() // Si facilita algo, se puede pasar por parametro el nombre del docente, debe ser el logueado.
		
		llenarTablaConReservas = function(reservas) {
			
			// se vacía la tabla,
			$('#cuerpo_tabla_reservas').html(Reserva.celdaLoadingHtml());
			// Acá debería 'esperar' hasta que llegue la info del servidor. Si llega bien, sigue con la siguiente linea. Si no, se queda trabado acá. Habrá que ajustarlo a getJSON
			$('#cuerpo_tabla_reservas').html('');
			$.each(reservas, function(indice, reserva) {
				
				$('#cuerpo_tabla_reservas').append(reserva.toHtml());
				
			});
		}
		
		cambiarPantalla(PANTALLA_VER_RESERVAS, llenarTablaConReservas, reservasDelDocente, function() {});
		
	});
}

// Pendiente: un GET por Ajax a PHP que devuelva todos los campos de todas las solicitudes/reservas para el docente logueado (va por parametro o ya lo tiene?) cuyas fechas de alta sean mayores o iguales a hoy.
getReservasDeDocente = function() {
	var reservas_string = '[{"fecha_alta":"19/09/2014","cant_alumnos":"20","laboratorio":"verde","turno":"maniana","fecha_pedida":"29/09/2014","estado":"rechazada"},{"fecha_alta":"20/09/2014","cant_alumnos":"21","laboratorio":"rojo","turno":"tarde","fecha_pedida":"30/09/2014","estado":"contra-ofertada","lab_ofrecido":"amarillo"},{"fecha_alta":"20/09/2014","cant_alumnos":"21","laboratorio":"medrano","turno":"noche","fecha_pedida":"30/09/2014","estado":"confirmada","lab_ofrecido":"azul"},{"fecha_alta":"20/09/2014","cant_alumnos":"21","laboratorio":"campus","turno":"noche","fecha_pedida":"30/09/2014","estado":"solicitada"}]';
	
	var reservas_JSON = JSON.parse(reservas_string);
	
	var reservas_mias = new Array();
	
	$.each(reservas_JSON, function(indice, reserva_JSON) {
			
		reservas_mias[indice] = new Reserva(reserva_JSON);
			
	});
	
	return reservas_mias;
}

bindearOpcionCerrarSesion = function() {
	/* Pendiente: interaccion con phplogin. por ahora hace lo mismo que la opcion Inicio */
	$('a[href="#cerrar_sesion"]').click(function(){
		
		cambiarPantallaActualPor(PANTALLA_INICIO);
		
	});
}

cambiarPantalla = function(pantallaNueva, yLuegoDeOcultarLaAnterior, parametro, yLuegoDeMostrarLaNueva) {
		
	// se esconde la pantalla actual rapido, y luego
	$(pantallaActual).fadeOut('fast', function() {
		// se hace lo que quiera el llamador en esta instancia,
		yLuegoDeOcultarLaAnterior(parametro);
		// se determina el metodo a utilizar en la linea siguiente
		// en base a si el div 'contenido' debe quedar largo o corto,
		// lo cual depende a su vez de la clase de la pantalla nueva (chica o no chica);
		var metodo = $(pantallaNueva).hasClass('pantalla_chica') ? 'removeClass' : 'addClass';		
		// se ajusta el tamanio del contenedor, y luego
		$('#contenido')[metodo]('extendido', 250).promise().done(function() {
			// se muestra la pantalla nueva, y luego
			$(pantallaNueva).fadeIn(function() {
				// se actualiza la variable de la pantalla actual
				pantallaActual = pantallaNueva;
				// y se hace lo que quiera el llamador en esta instancia.
				yLuegoDeMostrarLaNueva();
			});
		});
	});	
}

// Otra version, esta no hace nada más que cambiar la pantalla.
cambiarPantallaActualPor = function(pantallaNueva) {
	cambiarPantalla(pantallaNueva, function() {}, null, function() {});
}
