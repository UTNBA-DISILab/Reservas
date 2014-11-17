angular.module('reservasApp').controller('pedidosDeUnDiaCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
	
	var vistaAnterior = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;
	
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};	
	
	var evento = vistaAnterior.getEvento();	
	if(evento.tipo == 'pedido') {
		$scope.solicitudes = [];
		$scope.solicitudes.push(evento);
	}
	else {
		$scope.solicitudes = porDefecto.getPedidos(vistaAnterior.getUsuario());
		//$scope.solicitudes = vistaAnterior.getPedidos()); deberia ser asi
	}
	
	$scope.solicitudes.forEach(function(solicitud) {
		solicitud.listo = false;
	});
	
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
	
	
	
	$scope.volver = function(){
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