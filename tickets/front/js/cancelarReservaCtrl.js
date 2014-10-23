angular.module('reservasApp').controller('cancelarReservaCtrl',function($scope, $state, comunicadorEntreVistasService){
	var vistaAnterior = comunicadorEntreVistasService;

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.reserva = vistaAnterior.getEvento();
	console.log($scope.reserva);

});