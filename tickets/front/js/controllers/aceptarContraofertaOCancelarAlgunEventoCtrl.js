angular.module('reservasApp').controller('aceptarContraofertaOCancelarAlgunEventoCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService,valoresPorDefectoService){
	$scope.vistaAnterior = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
	var ayuda = ayudaService;
	var porDefecto = valoresPorDefectoService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!$scope.vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.eventos = $scope.vistaAnterior.getEventos();

	if($scope.eventos[0].begin.getDiaDeLaSemana() != "Sábado"){
		$scope.minimo = porDefecto.getHoraDeApertura().getMinutosDesdeMedianoche();
		$scope.maximo = porDefecto.getHoraDeCierre().getMinutosDesdeMedianoche();
	} else {
		$scope.minimo = porDefecto.getHoraDeAperturaSabados().getMinutosDesdeMedianoche();
		$scope.maximo = porDefecto.getHoraDeCierreSabados().getMinutosDesdeMedianoche();
	}

	$scope.eventos.forEach(function(unEvento) {
		servidor.obtenerUnUsuario(unEvento.owner_id)
		.success(function(elUsuario, status, headers, config) {
			unEvento.nombreYApellidoDelDocente = elUsuario.name; // el apellido viene en el nombre, o + ' ' + elUsuario.surname;
			console.log('Obtenidos los datos del usuario con id ' + unEvento.owner_id + ' exitosamente');
		})
		.error(function(data, status, headers, config) {
			unEvento.nombreYApellidoDelDocente = '(no disponible)';
			console.log('Se produjo un error al obtener los datos del usuario con id ' + unEvento.owner_id);
		});
	});

	$scope.aceptarContraoferta = function(evento) {
		servidor.confirmarReserva(evento.id)
		.success(function(data, status, headers, config) {
			console.log('Eliminada la reserva ' + evento.id + ' exitosamente' + ' (' + evento.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab(evento.lab_id) + ' el d\xEDa ' + evento.begin + ')');
			alert('La contraoferta se acept\xF3 exitosamente.');
			$state.go('planillaReservas');
			
		})
		.error(function(data, status, headers, config) {
			console.log(comienzo + evento.tipo + ' ' + evento.id + ' (' + evento.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab(evento.lab_id) + ' el d\xEDa ' + evento.begin + ') no se ha podido aceptar.');
			
			// TEMP
			alert('Se produjo un error al eliminar la reserva. Inténtelo más tarde.');
			$state.go('planillaReservas');
		});
};

	$scope.cancelar = function(evento) {
		var comienzo = "";
		if (evento.tipo == 'pedido'){
			comienzo = "El ";
		} else {
			comienzo = "La ";
		}

		var seguro = confirm(comienzo + evento.tipo + ' se eliminar\xE1 del sistema. ¿Desea continuar?');
		
		if(seguro) {
			servidor.cancelarReserva(evento.id)
			.success(function(data, status, headers, config) {
				console.log(comienzo + evento.tipo + ' se ha eliminado ' + evento.id + ' exitosamente' + ' (' + evento.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab(evento.lab_id) + ' el d\xEDa ' + evento.begin + ')');
				alert('La reserva se elimin\xF3 exitosamente.');
				$state.go('planillaReservas');
				
			})
			.error(function(data, status, headers, config) {
				console.log(comienzo + evento.tipo + ' ' + evento.id + ' (' + evento.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab(evento.lab_id) + ' el d\xEDa ' + evento.begin + ') no se ha podido eliminar.');
				
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