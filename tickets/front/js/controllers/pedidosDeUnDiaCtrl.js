angular.module('reservasApp').controller('pedidosDeUnDiaCtrl',function($scope, $state, comunicadorEntreVistasService, ayudaService){
	var vistaAnterior = comunicadorEntreVistasService;
	var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	
	// Para el rangeSlider, necesitamos que cada hora esté en formato 'minutos desde las 00:00 de ese dia'.
	$scope.franjasHorariasSolicitadas = [
		{docente: 'Cosme Fulanito', materia: 'Redes de Informacion', de: 600, a: 840},
		{docente: 'Cosme Fulanito', materia: 'Redes de Informacion', de: 840, a: 1080},
		{docente: 'Cosme Fulanito', materia: 'Redes de Informacion', de: 1080, a: 1200}
	];

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