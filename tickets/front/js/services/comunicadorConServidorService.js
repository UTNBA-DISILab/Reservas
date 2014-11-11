angular.module('reservasApp').service('comunicadorConServidorService',function($http, valoresPorDefectoService){	
	
	var porDefecto = valoresPorDefectoService;
	// Pendiente: pensar un nombre para el sistema ej:"reservas" pero que no se llame igual que uno de nuestros recursos HTTP.
	// (porque sino puede quedar blah.edu.ar/reservas/reservas/bleh y no queda bien)
	// Para hacer pruebas, acá y sólo acá es donde hay que poner la IP del servidor
	var url = 'sistemas.frba.utn.edu.ar/disilab';
	// Nosotros NO vamos a tener un index.html porque el index es el de la página de sistemas que ya existe.
	// Nuestra página principal será otra, ej disilab.html
	// Y el favicon también es el que ya existe en la pag de sistemas, el nuestro hay que sacarlo.
	var hoy = new Date();

	var sePudieronTraerLaboratorios = false;
	var sePudieronTraerReservas = false;
	var sePudieronTraerPedidos = false;
	var algoTuvoUnError = false;
	var scope = {};

	var transaccionFinalizada = function(){
		return sePudieronTraerLaboratorios && sePudieronTraerPedidos && sePudieronTraerReservas && !algoTuvoUnError;
	}
	
	return {
		obtenerLaboratorios: function(laboratorios, nombresDeLaboratorios){
			$http.get( url + '/labs')
				.success(function(laboratoriosRecibidos, status, headers, config) {
					// Esta devolución se llamará asincrónicamente cuando la respuesta esté disponible.
					console.log('Obtenidos los laboratorios exitosamente');
					laboratorios.splice(0,laboratorios.length);
					laboratoriosRecibidos.forEach(function(laboratorio){
						laboratorios.push(laboratorio);
						nombresDeLaboratorios.push(laboratorio.nombre);
					});
					sePudieronTraerLaboratorios = true;
					if(transaccionFinalizada()){
						scope.insertarDatos();
					}
				})
				.error(function(laboratoriosRecibidos, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('Se produjo un error al obtener los laboratorios');
					//algoTuvoUnError = true; -> Esto va descomentado cuando probemos con el server.

					//Esto es para pruebas. Sin esto actualizado se debería abortar,
					//mostrando un mensaje de error en vez de lo que está acá abajo.
					laboratorios.splice(0,laboratorios.length);
					laboratoriosRecibidos = porDefecto.getLaboratorios();
					laboratoriosRecibidos.forEach(function(laboratorio){
						laboratorios.push(laboratorio);
						nombresDeLaboratorios.push(laboratorio.nombre);
					});
					sePudieronTraerLaboratorios = true;
					if(transaccionFinalizada()){
						scope.insertarDatos();
					};
				});
		},
		
		obtenerReservas: function(primerDiaSolicitado, cantDiasSolicitados, reservas){
			
			var from = primerDiaSolicitado.getTime() - ( primerDiaSolicitado.getTime() % (1000 * 60 * 60 * 24) ) // las 00:00 de ese dia
			var to = from + cantDiasSolicitados * (24 * 60 * 60 * 1000);

			//return $http.get( url + '/reservas/' + primerDiaSolicitado.getFullYear() + '/' + ('0' + (primerDiaSolicitado.getMonth()+1)).slice(-2) + '/' + ('0' + primerDiaSolicitado.getDate()).slice(-2) + '?cant_dias=' + cantDiasSolicitados);
			$http.get( url + '/reservas/' + '?from=' + from + '&to=' + to)
				.success(function(reservasRecibidas, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available	
					console.log('Obtenidas las reservas en ' + primerDiaSolicitado + ' y en los ' + cantDiasSolicitados + ' dias siguientes exitosamente');
					
					reservas.splice(0,reservas.length);
					reservasRecibidas.forEach(function(reserva){reservas.push(reserva)});
					sePudieronTraerReservas = true;
				})
				.error(function(reservasRecibidas, status, headers, config) {
					console.log('Se produjo un error al obtener las reservas en ' + primerDiaSolicitado + ' y en los ' + cantDiasSolicitados + ' dias siguientes' );
					//algoTuvoUnError = true; -> Esto va descomentado cuando probemos con el server.

					//Esto es para pruebas. Sin esto actualizado se debería abortar,
					//mostrando un mensaje de error en vez de lo que está acá abajo.
					reservasRecibidas = porDefecto.getReservas();
					reservas.splice(0,reservas.length);
					reservasRecibidas.forEach(function(reserva){reservas.push(reserva)});
					sePudieronTraerReservas = true;
					if(transaccionFinalizada()){
						scope.insertarDatos();
					};
				});
		},

		// TEMP Pendiente: unificar con obtenerReservas, usando el estado de la reserva. Si es 'confirmada' es reserva, si no es pedido.
		obtenerPedidosSegun: function (primerDiaSolicitado, cantDiasSolicitados, usuario, pedidosDeReservas) {
			
			// el parametro usuario no se usa; el usuario logueado se obtiene de la cookie.
			//Pero mientras tanto:
			if(usuario.inicioSesion){
				var from = primerDiaSolicitado.getTime() - ( primerDiaSolicitado.getTime() % (1000 * 60 * 60 * 24) ) // las 00:00 de ese dia
				var to = from + cantDiasSolicitados * (24 * 60 * 60 * 1000);
				
				$http.get( url + '/reservas/' + '?from=' + from + '&to=' + to + '&solo_a_confirmar=true')
					.success(function(pedidosRecibidos, status, headers, config) {
						console.log('Obtenidos los pedidos en ' + primerDiaSolicitado + ' y en los ' + cantDiasSolicitados + ' dias siguientes exitosamente');
						pedidosDeReservas.splice(0,pedidosDeReservas.length);
						pedidosRecibidos.forEach(function(reserva){pedidosDeReservas.push(pedidoDeReserva)});
						sePudieronTraerPedidos = true;
						if(transaccionFinalizada()){
							scope.insertarDatos();
						};
					})
				
					.error(function(pedidosRecibidos, status, headers, config) {
						console.log('Se produjo un error al obtener los pedidos en ' + primerDiaSolicitado + ' y en los ' + cantDiasSolicitados + ' dias siguientes' );
						//algoTuvoUnError = true; -> Esto va descomentado cuando probemos con el server.

						//Esto es para pruebas. Sin esto actualizado se debería abortar,
						//mostrando un mensaje de error en vez de lo que está acá abajo.
						var pedidosDeJuan = porDefecto.getPedidosDeJuan();
						var pedidosDeTodos = porDefecto.getPedidosDeTodos();
						pedidosRecibidos = usuario.esEncargado ? pedidosDeTodos : pedidosDeJuan;
						pedidosDeReservas.splice(0,pedidosDeReservas.length);
						pedidosRecibidos.forEach(function(pedidoDeReserva){pedidosDeReservas.push(pedidoDeReserva)});
						sePudieronTraerPedidos = true;
						if(transaccionFinalizada()){
							scope.insertarDatos();
						};
					});
			} else {
				pedidosDeReservas.splice(0,pedidosDeReservas.length);
				sePudieronTraerPedidos = true;
				if(transaccionFinalizada()){
					scope.insertarDatos();
				};
			};			
		},

		obtenerCursosDelDocente: function(cantDiasSolicitados, usuario){
			//El server debe traernos las materias que dicta el docente.
			//Los sistemas de la UTN aún no están preparados para esto,
			//así que quedará pendiente para otra fase.
		},
		
		obtenerMaterias: function() {
			return $http.get( url + '/materias');
		},
		
		enviarNuevaReserva: function(reserva) {
			
		},
		inicializar: function(scopeActual){
			scope = scopeActual;
			sePudieronTraerLaboratorios = false;
			sePudieronTraerPedidos = false;
			sePudieronTraerReservas = false;
			algoTuvoUnError = false;
		}
	}

})