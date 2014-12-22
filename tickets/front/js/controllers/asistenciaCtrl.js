angular.module('reservasApp').controller('asistenciaCtrl',function($scope, $state, comunicadorEntreVistasService, ayudaService, comunicadorConServidorService, valoresPorDefectoService){
	var vistaAnterior = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
	var ayuda = ayudaService;
	var porDefecto = valoresPorDefectoService;
	var primerDiaSolicitado = new Date();
	primerDiaSolicitado.setHours(0,0,0,0);
	var cuantosDiasMasCargar = porDefecto.getCuantosDiasMas();
	$scope.sesiones = [];
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	var obtenerSesiones = function() {
		
		var comportamientoSiRequestExitoso = function(sesionesRecibidas) {
			
			sesionesRecibidas.forEach(function(sesion) {
				evento.date = new Date(evento.date);
				$scope.sesiones.push(sesion);
			});
		};
		
		servidor.obtenerSesiones(primerDiaSolicitado, cuantosDiasMasCargar)
		.success(function(sesionesRecibidas, status, headers, config) {
			console.log('Obtenidas las sesiones en ' + primerDiaSolicitado + ' y en los ' + (cuantosDiasMasCargar - 1) + ' d\xEDas siguientes exitosamente');
			comportamientoSiRequestExitoso(sesionesRecibidas);
		})
		.error(function(sesionesRecibidas, status, headers, config) {
			console.log('Se produjo un error al obtener las sesiones en ' + primerDiaSolicitado + ' y en los ' + (cuantosDiasMasCargar - 1) + ' d\xEDas siguientes' );
		});
	};
	
	obtenerSesiones();

	$scope.cargarMasDias = function(){
		primerDiaSolicitado.setDate(primerDiaSolicitado.getDate() + cuantosDiasMasCargar);
		obtenerSesiones();
	};

	$scope.nombreDeUsuario = function(idDeUsuario){
		servidor.obtenerUnUsuario(idDeUsuario)
		.success(function(elUsuario, status, headers, config) {
			return elUsuario.name; // el apellido viene en el nombre, o + ' ' + elUsuario.surname;
			console.log('Obtenidos los datos del usuario con id ' + idDeUsuario + ' exitosamente');
		})
		.error(function(data, status, headers, config) {
			return '(no disponible)';
			console.log('Se produjo un error al obtener los datos del usuario con id ' + idDeUsuario);
		});
	};

	$scope.nombreDeTerminal = function(idDeTerminal){
		servidor.obtenerUnaTerminal(idDeTerminal)
		.success(function(terminal, status, headers, config) {
			return terminal.name;
			console.log('Obtenidos los datos de la terminal con id ' + idDeTerminal + ' exitosamente');
		})
		.error(function(data, status, headers, config) {
			return '(no disponible)';
			console.log('Se produjo un error al obtener los datos de la terminal con id ' + idDeTerminal);
		});
	}

	$scope.getOperacion = function(id){
		return porDefecto.getOperacionDeSesion(id);
	}

});