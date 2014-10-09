
cargarElementosDeFechas = function() {
	bindearTodosLosDatepickers();
	
	inicializarDatepickers();
	bindearElBotonAgregarFecha();
}


bindearTodosLosDatepickers = function() {

	// Cada vez que gana o pierde el foco un campo para fechas u horas,
	$('.picker').on('change', function() {
				
		// si cualquiera de las fechas u horas ingresadas es invalida, se deshabilita el boton para agregar mas fechas
		if( todosCumplen($('.date'), contieneFechaValida) && todosCumplen($('.time'), contieneHoraValida) ) {
			document.getElementById('agregar_fecha').disabled = false;
		} else {
			document.getElementById('agregar_fecha').disabled = true;
		}
		
	});
}

// Una primera validacion para las fechas, hay que validar todo bien desde php.
contieneFechaValida = function (campo) {
	return /^[0-3]?[0-9]\/[0-1]?[0-9]\/[2-3][0-9]{3}$/.test(campo.value);
}

contieneHoraValida = function (campo) {
	return /^[0-2]?[0-9]:[0-5][0-9]$/.test(campo.value);
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
	$('#agregar_fecha').on('click', function () {
		
		var fechaAnterior_string = $('.date').last()[0].value;
		
		var cant_fechas = $('.date').length + 1;
		
		// se agrega el label y el input para la nueva fecha y el horario en la pantalla.
		$('#fechas').append('<br><label class="nombre_campo" for="datepicker' + cant_fechas.toString() + '">Fecha&nbsp;y&nbsp;horario&nbsp;' + cant_fechas.toString() + ': </label><input type="text" class="date picker" id="datepicker' + cant_fechas.toString() + '" name="fecha' + cant_fechas.toString() + '" maxlength="10" />');   
		$('#fechas').append('<label class="subnombre_campo" for="timepicker' + cant_fechas.toString() + '_comienzo">Desde:</label><input type="text" class="time picker" id="timepicker' + cant_fechas.toString() + '_comienzo" name="hora' + cant_fechas.toString() + '_comienzo" maxlength="5" />');
		$('#fechas').append('<label class="subnombre_campo" for="timepicker' + cant_fechas.toString() + '_fin">Hasta:</label><input type="text" class="time picker" id="timepicker' + cant_fechas.toString() + '_fin" name="hora' + cant_fechas.toString() + '_fin" maxlength="5" />');
		
		
		/*
		 * Luego de actualizar el DOM, es necesario que JS vuelva a buscar
		 * todos los datepickers que existen para bindearles a todos
		 * el codigo para el evento change.
		 */
		bindearTodosLosDatepickers();
		
		
		var fechaSiguiente_date = $.datepicker.parseDate('dd/mm/yy', fechaAnterior_string);
		// El cuadro para la fecha extra se autocompleta con la fecha anterior mas una semana
		// (que es la que el docente mas probablemente quiera),
		fechaSiguiente_date.setDate(fechaSiguiente_date.getDate() + 7);	
		
		// se coloca la fecha nueva en el campo nuevo,
		$('.date').last()[0].value = $.datepicker.formatDate('dd/mm/yy', fechaSiguiente_date).toString();
		
		
		//  y se autoselecciona el dia y el mes de la fecha nueva para agilizar un posible ajuste
		createSelection($('.date').last()[0] , 0, 5);
		
		// En los campos para el horario nuevo se copia el horario anterior
		$('.time').eq(-2)[0].value = $('.time').eq(-4)[0].value.toString();
		$('.time').eq(-1)[0].value = $('.time').eq(-3)[0].value.toString();
		
		
    });
}


inicializarDatepickers = function() {
	// Cuando se pone el foco en un campo de texto para fechas,
	$('body').on('focus','.date', function() {
		/* 
		 * se inicializan los datepickers configurados
		 * para que no permitan seleccionar fechas pasadas, y
		 * para excluir los domingos.
		*/
		$(this).datepicker(
			{
				minDate: 0,
				maxDate: "+5Y",
				beforeShowDay: function(date) {
					return [(date.getDay() != 0), ''];
				}
			}
		);
	});
	
	$('body').on('focus','.time', function() {
		
		$.timepicker.timeRange(
			$('.time').eq(-2), // el de la hora de inicio
			$('.time').eq(-1), // el de la hora de fin
			{
				minInterval: (1000*60*15), // un cuarto de hora
				timeFormat: 'HH:mm',
				start:
					{
						hourMin: 7,
						hourMax: 22,
						stepMinute: 5
					},
				end:
					{
						hourMin: 7,
						hourMax: 22,
						stepMinute: 5
					}
			}
		);
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
