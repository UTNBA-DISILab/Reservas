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
		// nunca entra en el else, porque solo se entra en esta vista si clickean pedidos
	}
	
	$scope.solicitudes.forEach(function(solicitud) {
		solicitud.listo = false;
	});
	
	var solicitudesOriginales = $scope.solicitudes;
	
	$scope.confirmar = function(reserva) {
		servidor.confirmarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Confirmada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + vistaAnterior.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al confirmar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + vistaAnterior.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.contraofertar = function(reserva) {
		
		reserva.begin.ajustarHoraYMinutos(reserva.beginContraofertable);
		reserva.end.ajustarHoraYMinutos(reserva.endContraofertable);
		reserva.lab_id = vistaAnterior.getIdDelLab(reserva.labContraofertable);

		servidor.modificarReserva(reserva.id, reserva.begin, reserva.end, reserva.lab_id)
		.success(function(data, status, headers, config) {
			console.log('Contraofertada la reserva ' + reserva.id + ' exitosamente' + ' (contraoferta: ' + reserva.subject + ' en el lab ' + vistaAnterior.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al contraofertar la reserva ' + reserva.id + ' (contraoferta: ' + reserva.subject + ' en el lab ' + vistaAnterior.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.rechazar = function(reserva) {
		servidor.cancelarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Rechazada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + vistaAnterior.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al rechazar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + vistaAnterior.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.seContraoferto = function(solicitud) {
		return vistaAnterior.getNombreDelLab(solicitud.lab_id) != solicitud.labContraofertable
				|| solicitud.begin.getMinutosDesdeMedianoche() != solicitud.beginContraofertable
				|| solicitud.end.getMinutosDesdeMedianoche() != solicitud.endContraofertable;
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