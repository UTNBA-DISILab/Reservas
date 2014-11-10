angular.module('reservasApp').service('comunicadorConServidorService',function($http){	
	
	// Pendiente: pensar un nombre para el sistema ej:"reservas" pero que no se llame igual que uno de nuestros recursos HTTP.
	// (porque sino puede quedar blah.edu.ar/reservas/reservas/bleh y no queda bien)
	// Para hacer pruebas, acá y sólo acá es donde hay que poner la IP del servidor
	var url = 'sistemas.frba.utn.edu.ar/disilab';
	// Nosotros NO vamos a tener un index.html porque el index es el de la página de sistemas que ya existe.
	// Nuestra página principal será otra, ej disilab.html
	// Y el favicon también es el que ya existe en la pag de sistemas, el nuestro hay que sacarlo.
	
	return {
		obtenerLaboratorios: function(){
			return $http.get( url + '/labs');
		},
		
		obtenerReservas: function(primerDiaSolicitado, cantDiasSolicitados){
			
			var from = primerDiaSolicitado.getTime() - ( primerDiaSolicitado.getTime() % (1000 * 60 * 60 * 24) ) // las 00:00 de ese dia
			var to = from + cantDiasSolicitados * (24 * 60 * 60 * 1000);
			
			//return $http.get( url + '/reservas/' + primerDiaSolicitado.getFullYear() + '/' + ('0' + (primerDiaSolicitado.getMonth()+1)).slice(-2) + '/' + ('0' + primerDiaSolicitado.getDate()).slice(-2) + '?cant_dias=' + cantDiasSolicitados);
			return $http.get( url + '/reservas/' + '?from=' + from + '&to=' + to);
		},

		// TEMP Pendiente: unificar con obtenerReservas, usando el estado de la reserva. Si es 'confirmada' es reserva, si no es pedido.
		obtenerPedidosSegun: function (primerDiaSolicitado, cantDiasSolicitados, usuario) {
			
			// el parametro usuario no se usa; el usuario logueado se obtiene de la cookie.
			
			var from = primerDiaSolicitado.getTime() - ( primerDiaSolicitado.getTime() % (1000 * 60 * 60 * 24) ) // las 00:00 de ese dia
			var to = from + cantDiasSolicitados * (24 * 60 * 60 * 1000);
			
			return $http.get( url + '/reservas/' + '?from=' + from + '&to=' + to + '&solo_a_confirmar=true');
			
			// Si solo_a_confirmar=true, la logica del servidor debe ser la siguiente:
				// el servidor debe traer todas las reservas que NO esten confirmadas.
				// si no hay usuario logueado (cookie vacia o invalida),
					//devolver un array vacio.
				// si el usuario logueado (cookie) es docente, solo traer SUS reservas no confirmadas.
				// si el usuario NO es docente (ej. encargado), traer TODAS las reservas no confirmadas de la base.
				// siempre entre los timestamps mandados en la query string.
			// Si solo_a_confirmar no aparece en la query string (función anterior), entonces
				// traer TODAS las reservas de la base entre from y to.
			
			
		},

		// ***** Resulta que no contamos con los datos necesarios para esto *****
		obtenerCursosDelDocente: function(cantDiasSolicitados, usuario){
			//El server debe traernos las materias que dicta el docente.
			//Y en caso de haberse logueado un encargado, devolver un array vacío
			materiasDeJuan = [
				{nombre: 'Álgebra y Geometría Analítica',
				codigoDeMateria: '088888',
				codigoDeCurso: 'K1111',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Lunes',
					horario: {de: 840, a: 1080}}, // de 14 a 18
					{diaDeLaSemana: 'Viernes',
					horario: {de: 840, a: 1080}} // de 14 a 18
				]},
				{nombre: 'Análisis Matemático I',
				codigoDeMateria: '087777',
				codigoDeCurso: 'K0000',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Miércoles',
					horario: {de: 840, a: 1080}}, // de 14 a 18
					{diaDeLaSemana: 'Viernes',
					horario: {de: 480, a: 720}} // de 8 a 12
				]},
				{nombre: 'Física II',
				codigoDeMateria: '089999',
				codigoDeCurso: 'K2222',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Martes',
					horario: {de: 1140, a: 1380}}, // de 19 a 23
					{diaDeLaSemana: 'Sábado',
					horario: {de: 540, a: 720}} // de 9 a 12
				]},
			]
		},
		// **************************************************
		
		obtenerMaterias: function() {
			return $http.get( url + '/materias');
		},
		
		enviarNuevaReserva: function(reserva) {
			
		}
	}

})