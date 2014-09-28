
$(document).ready(function(){

	$('#bienvenida').fadeIn();
	
	$('a[href="#solicitar_reserva"]').click(function(){
		
		$('#bienvenida').fadeOut('fast', function() {
			$('#contenido').toggleClass('max', 250).promise().done(function() {
				$('#nuevaReserva_div').fadeIn();
			});
		});
		
	});
	
	$('a[href="#cerrar_sesion"]').click(function(){
		
		$('#nuevaReserva_div').fadeOut('fast', function() {
			$('#contenido').toggleClass('max', 250).promise().done(function() {
				$('#bienvenida').fadeIn();
			});
		});
		
	});
	
	
	bindearTodasLasHoverboxes();
	bindearTodosLosDatepickers();	
	
	cant_fechas = 1;
	cant_inicial_nodos_fechas = document.getElementById("fechas").childNodes.length;
	id_input_texto_ultima_fecha = "datepicker1";
	
	
	// $("#agregar_fecha").click(function () {
	   $("#agregar_fecha").on('click', function () {
		var fechaAnterior_string = "";
		
		cant_fechas = cant_fechas + 1;
		
		$('#fechas').append('<br><label id="l_fecha' + cant_fechas.toString() + '">Fecha&nbsp;' + cant_fechas.toString() + ': </label><input type="text" class="form_text datepicker_recurring_start" id="datepicker' + cant_fechas.toString() + '" name="fecha' + cant_fechas.toString() + '" maxlength="10" />');   
		
		/*
		 * Luego de actualizar el DOM, es necesario que JS vuelva a buscar
		 * todos los datepickers que existen para bindearles a todos
		 * el codigo para el evento change.
		 */
		bindearTodosLosDatepickers();
		
		var fechaAnterior_string = document.getElementById(id_input_texto_ultima_fecha).value; // eg. "04/10/2014"
		
		var fechaSiguiente_date = $.datepicker.parseDate('dd/mm/yy', fechaAnterior_string);
		// La fecha agregada se autocompleta con la fecha anterior mas una semana, que es la que el docente mas probablemente quiera
		fechaSiguiente_date.setDate(fechaSiguiente_date.getDate() + 7);
		
		
    
		id_input_texto_ultima_fecha = incrementarIdDeInputFecha(id_input_texto_ultima_fecha);
		
		document.getElementById(id_input_texto_ultima_fecha).value = $.datepicker.formatDate('dd/mm/yy', fechaSiguiente_date).toString();
		
		// Se autoselecciona el dia y el mes de la fecha nueva para agilizar un posible ajuste
		createSelection( document.getElementById(id_input_texto_ultima_fecha) , 0, 5);
		
    });
	
	// Cuando se pone el foco en un campo de texto para fechas,
	$('body').on('focus',".datepicker_recurring_start", function(){
		/* 
		 * se inicializan los datepickers configurados
		 * para que no permitan seleccionar fechas pasadas, y
		 * para excluir los domingos.
		*/
		$(this).datepicker({ minDate: 0, maxDate: "+5Y", beforeShowDay: function(date) { return [(date.getDay() != 0), '']; } });
	});
	
	
	$("#boton_borrar").click(function () {
		reiniciar();		
    });

});


reiniciar = function() {
		
	// Se borran los campos de las fechas extra
	$(document.getElementById("fechas").childNodes).each(function(indice, nodoHijo) {
		if (indice >= cant_inicial_nodos_fechas) {
			nodoHijo.remove();
		}
	});
	
	cant_fechas = 1;
	
	// Se borran todos los datos ingresados
	document.getElementById("nuevaReserva_form").reset();
	document.getElementById("agregar_fecha").disabled = true;
}

// Funcion auxiliar para transformar el string "datepickerN" en "datepickerN+1"
incrementarIdDeInputFecha = function (idFecha) {
    return idFecha.replace(/\d+$/, function(s) {
        return +s+1;
    });
}

contieneFechaValida = function (campo) {
	return /^[0-3]?[0-9]\/[0-1]?[0-9]\/[2-3][0-9]{3}$/.test(campo.value);
}


bindearTodosLosDatepickers = function() {

	// Si cualquiera de las fechas ingresadas es invalida, se deshabilita el boton para agregar mas fechas
	$(".datepicker_recurring_start").on('change', function(){
		
		var todasFechasValidas = true;
		
		$(".datepicker_recurring_start").each(function(indice, campo) {
				todasFechasValidas = todasFechasValidas && ( contieneFechaValida(campo) );
		});
			
		if (todasFechasValidas == true) {
			document.getElementById("agregar_fecha").disabled = false;
		} else {
			document.getElementById("agregar_fecha").disabled = true;
		}		
	});
}

bindearTodasLasHoverboxes = function() {
	
	$('#hover_labs').on('click', '#radio_cualquiera', function() {
		$('.hoverbox').css('z-index', 10);
		$('.hoverbox').fadeOut();
	});
	
	bindearHoverbox('verde');
	bindearHoverbox('azul');
	bindearHoverbox('rojo');
	bindearHoverbox('amarillo');
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

bindearHoverbox = function(color) {
	
	$('#hover_labs').on('mouseenter', '#radio_' + color, function() {
		$('#hoverbox_' + color).siblings('.hoverbox').css('z-index', 10);
		$('#hoverbox_' + color).css('z-index', 11);
		$('#hoverbox_' + color).fadeIn();
		$('#hoverbox_' + color).siblings('.hoverbox').css('display', 'none');
	});
	
	$('#hover_labs').on('mouseleave', '#radio_' + color, function() {
		
		$('.radios_lab').each(function(indice, radio) {
			if (radio.checked) {
				$(radio).next().fadeIn(0);
			}
		});
		
		if(!document.getElementById('radio_' + color).checked) {
			$('#hoverbox_' + color).fadeOut();
		}
	});
}