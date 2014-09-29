
// Cuando la pagina termina de cargar,
$(document).ready(function(){
	
	// Se definen e inicializan variables globales,
	
	/* -------- CONSTANTES -------- */
	PANTALLA_INICIO = document.getElementById('inicio_div');
	PANTALLA_SOLICITAR_RESERVAS = document.getElementById('solicitar_reservas_div');
	PANTALLA_VER_RESERVAS = document.getElementById('ver_reservas_div');
	
	BOTON_AGREGAR_FECHA = document.getElementById('agregar_fecha');
	/* ---------------------------- */
	
	pantallaActual = PANTALLA_INICIO;
	cant_fechas = 1;
	cant_inicial_nodos_fechas = document.getElementById('fechas').childNodes.length;
	id_input_texto_ultima_fecha = 'datepicker1';
	
	// y se establecen los eventos para las distintas acciones sobre los distintos elementos.
	bindearTodasLasOpciones();
	//bindearTodosLosRadios(); //reemplazar por crearElementosDeLaboratorios
	crearElementosDeLosLaboratorios();
	bindearTodosLosDatepickers();	
	bindearElBotonAgregarFecha();
	bindearElBotonBorrarTodo();
	
	inicializarDatepickers();

});

// Funcion auxiliar para transformar el string "datepickerN" en "datepickerN+1"
incrementarIdDeInputFecha = function (idFecha) {
    return idFecha.replace(/\d+$/, function(s) {
        return +s+1;
    });
}

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
		cambiarPantallaActualYLuego(PANTALLA_SOLICITAR_RESERVAS, function() {
			// se autocompleta el nombre del docente, que ya se conoce porque ya se logueo,
			$('#nombre').val('Cosme Fulanito'); // Pendiente: obtener el nombre del docente de la sesion actual
			// se prohibe modificar ese campo,
			$('#nombre').prop('readonly', 'readonly');
			// y se pone el foco en el cuadro de texto de la materia.
			$('#materia').focus();
		});
		
	});
}

bindearOpcionVerReservas = function() {
	$('a[href="#ver_reservas"]').click(function(){
		
		cambiarPantallaActualPor(PANTALLA_VER_RESERVAS);
		
		/*
		 * Se agrega una fila de ejemplo. Pendiente: un POST o GET por Ajax a PHP y que me devuelva
		 * todos los campos de todas las solicitudes/reservas para el docente logueado
		 * cuyas fechas de alta sean mayores o iguales a hoy.
		 * Luego $.each( append( la fila i-esima armada en html )) y sanseacabó.
		 */
		$('#cuerpo_tabla_reservas').append('<tr><td>19&#47;09&#47;2014</td><td>25</td><td><span class="nombre_lab_span lab_azul">Azul</span></td><td>Noche</td><td>01/10/2014</td><td class="solicitada">Solicitada</td></tr>');
		
		/* Capaz es demasiado complicado, pero lo ideal seria: mandar el pedido a php,
		 * mientras se espera la respuesta, se oculta la pantalla vieja (y quizas meter una tipo Loading...) . Luego de que responda,
		 * procesar, agregar la fila, y luego de eso mostrar la pantalla nueva.
		 */
		
	});
}

bindearOpcionCerrarSesion = function() {
	/* Pendiente: interaccion con phplogin. por ahora hace lo mismo que la opcion Inicio */
	$('a[href="#cerrar_sesion"]').click(function(){
		
		cambiarPantallaActualPor(PANTALLA_INICIO);
		
	});
}

cambiarPantallaActualYLuego = function(pantallaNueva, yLuego) {
		
	// se esconde la pantalla actual rapido, y luego
	$(pantallaActual).fadeOut('fast', function() {
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
				// y el flujo de ejecucion sigue con la funcion parametro.
				yLuego();
			});
		});
	});	
}

// Otra version, esta no hace nada luego de cambiar la pantalla.
cambiarPantallaActualPor = function(pantallaNueva) {
	cambiarPantallaActualYLuego(pantallaNueva, function() {});
}

bindearTodosLosDatepickers = function() {

	// Cada vez que gana o pierde el foco un campo para fechas,
	$(".datepicker_recurring_start").on('change', function() {
				
		// si cualquiera de las fechas ingresadas es invalida, se deshabilita el boton para agregar mas fechas
		if( todosCumplen($(".datepicker_recurring_start"), contieneFechaValida) ) {
			BOTON_AGREGAR_FECHA.disabled = false;
		} else {
			BOTON_AGREGAR_FECHA.disabled = true;
		}
		
	});
}

// Una primera validacion para las fechas, hay que validar todo bien desde php.
contieneFechaValida = function (campo) {
	return /^[0-3]?[0-9]\/[0-1]?[0-9]\/[2-3][0-9]{3}$/.test(campo.value);
}

// Funcion auxiliar equivalente al allSatisfy: de Smalltalk
todosCumplen = function(jQo, condicion) {
	
	var cumplen = true;
	jQo.each(function(indice, campo) {
		if(!condicion(campo)) {
			cumplen = false;
			return false; // Esto es como 'break'; corta el each, no retorna la funcion
		}
	});
	return cumplen;
}

bindearElBotonAgregarFecha = function() {
	
	// Cuando se hace click en el boton de agregar fecha,
	$("#agregar_fecha").on('click', function () {
		
		var fechaAnterior_string = "";
		
		cant_fechas = cant_fechas + 1;
		
		// se agrega el label y el input para la nueva fecha en la pantalla.
		$('#fechas').append('<br><label id="l_fecha' + cant_fechas.toString() + '">Fecha&nbsp;' + cant_fechas.toString() + ': </label><input type="text" class="datepicker_recurring_start" id="datepicker' + cant_fechas.toString() + '" name="fecha' + cant_fechas.toString() + '" maxlength="10" />');   
		
		/*
		 * Luego de actualizar el DOM, es necesario que JS vuelva a buscar
		 * todos los datepickers que existen para bindearles a todos
		 * el codigo para el evento change.
		 */
		bindearTodosLosDatepickers();
		
		var fechaAnterior_string = document.getElementById(id_input_texto_ultima_fecha).value; // eg. "04/10/2014"
		
		var fechaSiguiente_date = $.datepicker.parseDate('dd/mm/yy', fechaAnterior_string);
		// El cuadro para la fecha extra se autocompleta con la fecha anterior mas una semana
		// (que es la que el docente mas probablemente quiera),
		fechaSiguiente_date.setDate(fechaSiguiente_date.getDate() + 7);		
		
		// el id de la ultima fecha pasa de "datepickerN" a "datepickerN+1",
		id_input_texto_ultima_fecha = incrementarIdDeInputFecha(id_input_texto_ultima_fecha);
		
		// se coloca la fecha nueva en el campo nuevo,
		document.getElementById(id_input_texto_ultima_fecha).value = $.datepicker.formatDate('dd/mm/yy', fechaSiguiente_date).toString();
		
		//  y se autoselecciona el dia y el mes de la fecha nueva para agilizar un posible ajuste
		createSelection(document.getElementById(id_input_texto_ultima_fecha) , 0, 5);
		
    });
}

bindearElBotonBorrarTodo = function() {
	$("#boton_borrar").click(function () {
		reiniciar();		
    });
}

reiniciar = function() {
		
	// Se borran los campos de las fechas extra
	$(document.getElementById("fechas").childNodes).each(function(indice, nodoHijo) {
		if (indice >= cant_inicial_nodos_fechas) {
			nodoHijo.remove();
		}
	});
	
	cant_fechas = 1;
	
	// Se borran todos los datos ingresados
	document.getElementById("solicitar_reservas_form").reset();
	document.getElementById("agregar_fecha").disabled = true;
}

inicializarDatepickers = function() {
	// Cuando se pone el foco en un campo de texto para fechas,
	$('body').on('focus',".datepicker_recurring_start", function(){
		/* 
		 * se inicializan los datepickers configurados
		 * para que no permitan seleccionar fechas pasadas, y
		 * para excluir los domingos.
		*/
		$(this).datepicker({ minDate: 0, maxDate: "+5Y", beforeShowDay: function(date) { return [(date.getDay() != 0), '']; } });
	});
}

// Funcion auxiliar para seleccionar texto dentro de un input
function createSelection(field, start, end) {
    if( field.createTextRange ) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end-start);
        selRange.select();
    } else if( field.setSelectionRange ) {
        field.setSelectionRange(start, end);
    } else if( field.selectionStart ) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}
