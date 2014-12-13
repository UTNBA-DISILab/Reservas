angular.module('reservasApp').controller('pedidosDeUnaFranjaCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
	
	var comunicador = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;
	
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	$scope.laboratorios = comunicador.getLaboratorios();
	
	$scope.nombresLabs = [];
	
	$scope.laboratorios.forEach(function(laboratorio){
		$scope.nombresLabs.push(laboratorio.nombre);
	});

	if(!comunicador.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};	
	
	var eventos = comunicador.getEventos();	
	if(eventos[0].tipo == 'pedido') {
		$scope.solicitudes = eventos;
	}
	else {
		$scope.solicitudes = porDefecto.getPedidos(comunicador.getUsuario());
		// nunca entra en el else, porque solo se entra en esta vista si clickean pedidos
	}

	var solicitudesOriginales = $scope.solicitudes;

	$scope.solicitudes.forEach(function(solicitud) {
		servidor.obtenerUnUsuario(solicitud.owner_id)
		.success(function(elUsuario, status, headers, config) {
			solicitud.nombreYApellidoDelDocente = elUsuario.name; // el apellido viene en el nombre, o + ' ' + elUsuario.surname;
			console.log('Obtenidos los datos del usuario con id ' + solicitud.owner_id + ' exitosamente');
		})
		.error(function(data, status, headers, config) {
			solicitud.nombreYApellidoDelDocente = '(no disponible)';
			console.log('Se produjo un error al obtener los datos del usuario con id ' + solicitud.owner_id);
		});
	});
	
	$scope.solicitudes.forEach(function(solicitud) {
		solicitud.listo = false;
	});	
	
	$scope.confirmar = function(reserva) {
		servidor.confirmarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Confirmada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			comunicador.getPlanilla().recargarPlanilla();
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al confirmar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');

			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.contraofertar = function(reserva) {
		
		reserva.begin.ajustarHoraYMinutos(reserva.beginContraofertable);
		reserva.end.ajustarHoraYMinutos(reserva.endContraofertable);
		reserva.lab_id = comunicador.getIdDelLab(reserva.labContraofertable);

		servidor.modificarReserva(reserva.id, reserva.begin, reserva.end, reserva.lab_id)
		.success(function(data, status, headers, config) {
			console.log('Contraofertada la reserva ' + reserva.id + ' exitosamente' + ' (contraoferta: ' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			comunicador.getPlanilla().recargarPlanilla();
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al contraofertar la reserva ' + reserva.id + ' (contraoferta: ' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.rechazar = function(reserva) {
		servidor.cancelarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Rechazada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			comunicador.getPlanilla().recargarPlanilla();
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al rechazar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			
			// TEMP
			reserva.listo = true;
		});
	};
	
	$scope.seContraoferto = function(solicitud) {
		return comunicador.getNombreDelLab(solicitud.lab_id) != solicitud.labContraofertable
				|| solicitud.begin.getMinutosDesdeMedianoche() != solicitud.beginContraofertable
				|| solicitud.end.getMinutosDesdeMedianoche() != solicitud.endContraofertable;
	};
	
	$scope.volver = function(){
		$scope.solicitudes = solicitudesOriginales;
		$state.go('planillaReservas');
	};

	$scope.seSuperponeConOtraSolicitud = function(solicitud){
		return comunicador.getPlanilla().laboratorios.filter(
			function(unLaboratorio) {
				return comunicador.getNombreDelLab(unLaboratorio.id) == solicitud.labContraofertable;
			})[0].dias.filter(function(unDia){
				return unDia.fecha.esElMismoDiaQue(solicitud.begin);
	        })[0].franjas.filter(function(unaFranja){
	        	//Se superpone con alguna franja que NO es libre
	        	return ((unaFranja.desde.getMinutosDesdeMedianoche() <= solicitud.beginContraofertable 
	        			&& unaFranja.hasta.getMinutosDesdeMedianoche() > solicitud.beginContraofertable) ||
	        		(unaFranja.desde.getMinutosDesdeMedianoche() > solicitud.beginContraofertable 
	        			&& unaFranja.hasta.getMinutosDesdeMedianoche() < solicitud.endContraofertable) ||
	        		(unaFranja.desde.getMinutosDesdeMedianoche() < solicitud.endContraofertable 
	        			&& unaFranja.hasta.getMinutosDesdeMedianoche() >= solicitud.endContraofertable)) &&
	        		unaFranja.eventos[0].tipo != 'libre' &&
	        		unaFranja.eventos.filter(function(evento){evento.id != solicitud.id;}).length
        	}).length;
	}
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