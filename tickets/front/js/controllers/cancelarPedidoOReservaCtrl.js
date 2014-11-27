angular.module('reservasApp').controller('cancelarPedidoOReservaCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
	var vistaAnterior = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
	var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.pedidosOReservas = vistaAnterior.getEventos();
	
	$scope.cancelar = function(pedidoOReserva) {
		var seguro = confirm('Esta reserva se eliminar\xE1 del sistema. Desea continuar?');
		
		if(seguro) {
			servidor.cancelarReserva(pedidoOReserva.id)
			.success(function(data, status, headers, config) {
				console.log('Eliminada la reserva ' + pedidoOReserva.id + ' exitosamente' + ' (' + pedidoOReserva.subject + ' en el lab ' + pedidoOReserva.laboratorio + ' el d\xEDa ' + pedidoOReserva.desde + ')');
				alert('La reserva se elimin\xF3 exitosamente.');
				$state.go('planillaReservas');
				
			})
			.error(function(data, status, headers, config) {
				console.log('Se produjo un error al eliminar la reserva ' + pedidoOReserva.id + ' (' + pedidoOReserva.subject + ' en el lab ' + pedidoOReserva.laboratorio + ' el d\xEDa ' + pedidoOReserva.desde + ')');
				
				// TEMP
				alert('Se produjo un error al eliminar la reserva. Inténtelo más tarde.');
				$state.go('planillaReservas');
			});
		};
	};
	
	$scope.nuevoDate = function(fecha) {
		return new Date(fecha);
	};
	
	$scope.volver = function(){
		$state.go('planillaReservas');
	};

});