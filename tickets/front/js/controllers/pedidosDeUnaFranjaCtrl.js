angular.module('reservasApp').controller('pedidosDeUnaFranjaCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
	
	var vistaAnterior = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;
	
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	$scope.laboratorios = vistaAnterior.getLaboratorios();
	
	$scope.nombresLabs = [];
	
	$scope.laboratorios.forEach(function(laboratorio){
		$scope.nombresLabs.push(laboratorio.nombre);
	});

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};	
	
	var eventos = vistaAnterior.getEventos();	
	if(eventos[0].tipo == 'pedido') {
		$scope.solicitudes = eventos;
	}
	else {
		$scope.solicitudes = porDefecto.getPedidos(vistaAnterior.getUsuario());
		//$scope.solicitudes = vistaAnterior.getPedidos()); deberia ser asi
	}
	
	$scope.solicitudes.forEach(function(solicitud) {
		solicitud.listo = false;
	});
	
	var solicitudesOriginales = $scope.solicitudes;
	
	$scope.nuevoDate = function(fecha) {
		return new Date(fecha);
	};
	
	$scope.confirmar = function(reserva) {
		servidor.confirmarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Confirmada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + reserva.laboratorio + ' el d\xEDa ' + reserva.fecha + ')');
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al confirmar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + reserva.laboratorio + ' el d\xEDa ' + reserva.fecha + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.contraofertar = function(reserva) {
		//TODO
	};
	
	$scope.rechazar = function(reserva) {
		servidor.rechazarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Rechazada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + reserva.laboratorio + ' el d\xEDa ' + reserva.fecha + ')');
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al rechazar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + reserva.laboratorio + ' el d\xEDa ' + reserva.fecha + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.seContraoferto = function(solicitud) {
		return solicitud.laboratorio != solicitud.labContraofertable
				|| solicitud.desde.getMinutosDesdeMedianoche() != solicitud.desdeContraofertable
				|| solicitud.hasta.getMinutosDesdeMedianoche() != solicitud.hastaContraofertable;
	};
	
	$scope.volver = function(){
		$scope.solicitudes = solicitudesOriginales;
		$state.go('planillaReservas');
	};

});
	
// En otro archivo
angular.module('reservasApp').filter('hourMinFilter', function () {
    return function (minutosDesdeMedianoche) {
        var horaH = parseInt(minutosDesdeMedianoche / 60);
        var minutoM = parseInt(minutosDesdeMedianoche % 60);
		
		// Queremos ceros a la izquierda
		var horaHH = (horaH < 10) ? '0' + horaH : horaH;
		var minutoMM = (minutoM < 10) ? '0' + minutoM : minutoM;

		return horaHH + ':' + minutoMM;
    };
});