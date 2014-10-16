angular.module('reservasApp').controller('cancelarReservaCtrl',function($scope, comunicadorEntreVistasService){
	var vistaAnterior = comunicadorEntreVistasService;
	$scope.reserva = vistaAnterior.getEvento();
	console.log($scope.reserva);

});