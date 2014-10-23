angular.module('reservasApp').controller('reservasAnterioresCtrl',function($scope, $state, comunicadorEntreVistasService){
	var vistaAnterior = comunicadorEntreVistasService;

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};


});