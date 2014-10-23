angular.module('reservasApp').controller('pedidoDeReservaCtrl',function($scope, $state, comunicadorEntreVistasService){
	var vistaAnterior = comunicadorEntreVistasService;

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	//Un poco de hardcodeo provisorio para lo que deberá otorgar la vistaAnterior.
	//Sólo se enviarán la franja clickeada y todas las libres contiguas.
	$scope.franjasHorarias = [
		{de: 10, a: 14, tipo: 'libre', clickeada: false},
		{de: 14, a: 18, tipo: 'libre y coincide con su materia', clickeada: false},
		{de: 18, a: 20, tipo: 'libre', clickeada: true}//Supongamos que quiere reservar un rato LUEGO de su clase por X motivo.
	];
	
	
	// Para el rangeSlider, necesitamos que cada hora esté en formato 'minutos desde las 00:00 de ese dia'.
	// Copio aca el ejemplo de arriba con ese formato.
	$scope.franjasHorariasEnMinutos = [
		{de: 600, a: 840, tipo: 'libre', clickeada: false},
		{de: 840, a: 1080, tipo: 'libre y coincide con su materia', clickeada: false},
		{de: 1080, a: 1200, tipo: 'libre', clickeada: true}//Supongamos que quiere reservar un rato LUEGO de su clase por X motivo.
	];
	
	
	$scope.minimoPermitido = function() {
		return $scope.franjasHorariasEnMinutos[0].de;
	};
	
	$scope.maximoPermitido = function() {
		return $scope.franjasHorariasEnMinutos[$scope.franjasHorariasEnMinutos.length - 1].a;
	}
	
	var franjaClickeada = $scope.franjasHorariasEnMinutos.filter(
		function(unaFranja) {
			return unaFranja.clickeada;
		}
	)[0];
	
	var franjaSeleccionadaInicio = franjaClickeada.de;
	var franjaSeleccionadaFin = franjaClickeada.a;
	var franjaSeleccionadaTipo = franjaClickeada.tipo;
	var franjaSeleccionadaClickeada = franjaClickeada.clickeada;
	
	$scope.franjaSeleccionada = {de: franjaSeleccionadaInicio, a: franjaSeleccionadaFin, tipo: franjaSeleccionadaTipo, clickeada: franjaSeleccionadaClickeada};
	
	
	$scope.laFranjaEstaPerfecta = false;
	
	$scope.eseHorarioNoEsPropio = function(franjaSeleccionada) {
		
		var estaLibreYEsDeSuMateria = function(unaFranja) {
			return unaFranja.tipo == 'libre y coincide con su materia';
		};
		
		var franjaLibreYDeSuMateria = $scope.franjasHorariasEnMinutos.filter(estaLibreYEsDeSuMateria)[0];
		
		var estaContenidaEn = function(franjaContenida, franjaContenedora) {
			return (franjaContenida.de >= franjaContenedora.de && franjaContenida.a <= franjaContenedora.a);
		};
		
		if(estaContenidaEn(franjaSeleccionada, franjaLibreYDeSuMateria)) {
			
			$scope.laFranjaEstaPerfecta = true;
			return false;
		}
		else {
			
			$scope.laFranjaEstaPerfecta = false;
			return true;
		};
	}
	
	$scope.justificacionIngresada = '';
	
	$scope.pareceQueNoJustifico = function() {
		return !$scope.laFranjaEstaPerfecta && $scope.justificacionIngresada.length <= 2;
	}

	$scope.volver = function(){
		$state.go('planillaReservas');
	}
	
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