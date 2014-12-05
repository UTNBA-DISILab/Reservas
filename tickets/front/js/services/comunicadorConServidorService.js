angular.module('reservasApp').service('comunicadorConServidorService',function($http){	
	
	// Pendiente: pensar un nombre para el sistema ej:"reservas" pero que no se llame igual que uno de nuestros recursos HTTP.
	// (porque sino puede quedar blah.edu.ar/reservas/reservas/bleh y no queda bien)
	// Para hacer pruebas, acá y sólo acá es donde hay que poner la IP del servidor
	var url = '../back';
	// Nosotros NO vamos a tener un index.html porque el index es el de la página de sistemas que ya existe.
	// Nuestra página principal será otra, ej disilab.html
	// Y el favicon también es el que ya existe en la pag de sistemas, el nuestro hay que sacarlo.
	
	return {
		obtenerLaboratorios: function(/*laboratorios, nombresDeLaboratorios*/){
			return $http.get( url + '/labs');
		},
		
		obtenerReservas: function(primerDiaSolicitado, cantDiasSolicitados){
			
			var from = primerDiaSolicitado.getTime();
			var to = from + cantDiasSolicitados * (24 * 60 * 60 * 1000);

			//return $http.get( url + '/reservas/' + primerDiaSolicitado.getFullYear() + '/' + ('0' + (primerDiaSolicitado.getMonth()+1)).slice(-2) + '/' + ('0' + primerDiaSolicitado.getDate()).slice(-2) + '?cant_dias=' + cantDiasSolicitados);
			return $http.get( url + '/reservas' + '?from=' + from + '&to=' + to);
			// El server NO debe leer la cookie. Siempre debe traer TODAS las reservas de la base
			// siempre en el rango de timestamps mandados.
		},

		obtenerPedidos: function (primerDiaSolicitado, cantDiasSolicitados) {
			
			var from = primerDiaSolicitado.getTime();
			var to = from + cantDiasSolicitados * (24 * 60 * 60 * 1000);
				
			return $http.get( url + '/reservas' + '?from=' + from + '&to=' + to + '&solo_a_confirmar=true');
			// El server debe leer la cookie. Si no hay usuario logueado, devuelve array vacio.
			// Si hay usuario y es docente, trae sus reservas solicitadas.
			// Si hay usuario y es encargado, trae TODAS las reservas solicitadas
			// siempre en el rango de timestamps mandados.
		},

		obtenerCursosDelDocente: function(cantDiasSolicitados, usuario){
			//El server debe traernos las materias que dicta el docente.
			//Los sistemas de la UTN aún no están preparados para esto,
			//así que quedará pendiente para otra fase.
		},
		
		obtenerMaterias: function() {
			return $http.get( url + '/materias');
		},
		
		cargarMateria: function(nombre, especialidad) {
			
			var materiaNueva = {};
			
			materiaNueva.nombre = nombre;
			materiaNueva.especialidad = especialidad;
			
			return $http.post( url + '/materias', materiaNueva);
		},
		
		enviarNuevaReserva: function(laboratorio, desde, hasta, estado) {
			
			var reservaNueva = {};
			
			reservaNueva.creation_date = new Date().getTime();
			reservaNueva.laboratorio = laboratorio;
			reservaNueva.from = desde.getTime();
			reservaNueva.to = hasta.getTime();
			reservaNueva.state = estado;
			// el teacher_id lo ponemos acá o lo saca el server viendo la cookie?
			
			return $http.post( url + '/reservas', reservaNueva);
		},
		
		confirmarReserva: function(id) {
			return $http.get( url + '/reservas/' + id + '?action=confirm');
		},
		
		rechazarReserva: function(id) {
			return $http.get( url + '/reservas/' + id + '?action=reject');
		},
		
		cancelarReserva: function(id) {
			return $http.delete( url + '/reservas/' + id);
		},
		
		obtenerDocentes: function() {
			return $http.get( url + '/docentes');
		}
		
	}

})