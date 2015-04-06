angular.module('reservasApp').controller('agregarOModificarTerminalCtrl',function($scope, $state, $window, comunicadorEntreVistasService, ayudaService, comunicadorConServidorService, valoresPorDefectoService){
	var otraVista = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
	var ayuda = ayudaService;
	var porDefecto = valoresPorDefectoService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

    $scope.terminal = otraVista.getTerminal();
    console.log($scope.terminal);

	if(!otraVista.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.volver = function(){
		$window.history.back();
	};

	$scope.agregarOModificarTerminal = function(){
		if($scope.terminal.id){
			servidor.modificarTerminal($scope.terminal)
			.success(function(terminal, status, headers, config) {
				console.log('Se modificó la terminal con id ' + terminal.id + ' exitosamente');
			})
			.error(function(data, status, headers, config) {
				console.log('Se produjo un error al intentar modificar la terminal con id ' + idDeTerminal);
			});
		} else {
			servidor.agregarTerminal($scope.terminal)
			.success(function(terminal, status, headers, config) {
				console.log('Se agregó la terminal exitosamente');
			})
			.error(function(terminal, status, headers, config) {
				console.log('Se produjo un error al intentar agregar la terminal');
			});
		};
	};

});