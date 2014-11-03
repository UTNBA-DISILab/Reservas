angular.module('reservasApp').controller('cancelarReservaCtrl',function($scope, $state, comunicadorEntreVistasService, ayudaService){
	var vistaAnterior = comunicadorEntreVistasService;
	var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.reserva = vistaAnterior.getEvento();

});