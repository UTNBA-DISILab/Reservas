angular.module('reservasApp').controller('cancelarPedidoOReservaCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
	$scope.vistaAnterior = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
	var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!$scope.vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.pedidosOReservas = $scope.vistaAnterior.getEventos();

	$scope.pedidosOReservas.forEach(function(unPedidoOReserva) {
		servidor.obtenerUnUsuario(unPedidoOReserva.owner_id)
		.success(function(elUsuario, status, headers, config) {
			unPedidoOReserva.nombreYApellidoDelDocente = elUsuario.name; // el apellido viene en el nombre, o + ' ' + elUsuario.surname;
			console.log('Obtenidos los datos del usuario con id ' + unPedidoOReserva.owner_id + ' exitosamente');
		})
		.error(function(data, status, headers, config) {
			unPedidoOReserva.nombreYApellidoDelDocente = '(no disponible)';
			console.log('Se produjo un error al obtener los datos del usuario con id ' + unPedidoOReserva.owner_id);
		});
	});

	$scope.cancelar = function(pedidoOReserva) {
		var seguro = confirm('Esta reserva se eliminar\xE1 del sistema. Desea continuar?');
		
		if(seguro) {
			servidor.cancelarReserva(pedidoOReserva.id)
			.success(function(data, status, headers, config) {
				console.log('Eliminada la reserva ' + pedidoOReserva.id + ' exitosamente' + ' (' + pedidoOReserva.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab(pedidoOReserva.lab_id) + ' el d\xEDa ' + pedidoOReserva.begin + ')');
				alert('La reserva se elimin\xF3 exitosamente.');
				$state.go('planillaReservas');
				
			})
			.error(function(data, status, headers, config) {
				console.log('Se produjo un error al eliminar la reserva ' + pedidoOReserva.id + ' (' + pedidoOReserva.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab(pedidoOReserva.lab_id) + ' el d\xEDa ' + pedidoOReserva.begin + ')');
				
				// TEMP
				alert('Se produjo un error al eliminar la reserva. Inténtelo más tarde.');
				$state.go('planillaReservas');
			});
		};
	};
	
	$scope.nuevoDate = function(timestamp) {
		return new Date(timestamp);
	};
	
	$scope.volver = function(){
		$state.go('planillaReservas');
	};

});