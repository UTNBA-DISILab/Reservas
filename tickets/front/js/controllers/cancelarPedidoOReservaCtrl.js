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
	
	$scope.cancelar = function() {
		var seguro = confirm('Esta reserva se eliminar\xE1 del sistema. Desea continuar?');
		
		if(seguro) {
			servidor.cancelarReserva($scope.reserva.id)
			.success(function(data, status, headers, config) {
				console.log('Eliminada la reserva ' + $scope.reserva.id + ' exitosamente' + ' (' + $scope.reserva.subject + ' en el lab ' + $scope.reserva.laboratorio + ' el d\xEDa ' + $scope.reserva.fecha + ')');
				alert('La reserva se elimin\xF3 exitosamente.');
				$state.go('planillaReservas');
				
			})
			.error(function(data, status, headers, config) {
				console.log('Se produjo un error al eliminar la reserva ' + $scope.reserva.id + ' (' + $scope.reserva.subject + ' en el lab ' + $scope.reserva.laboratorio + ' el d\xEDa ' + $scope.reserva.fecha + ')');
				
				// TEMP
				alert('La reserva se elimin\xF3 exitosamente.');
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