angular.module('reservasApp').controller('pedidoDeReservaCtrl',function($scope, $state, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
	$scope.vistaAnterior = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!$scope.vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};

	$scope.evento = $scope.vistaAnterior.getEventos()[0];
	
	// El rango libre es todo el tiempo libre contiguo al punto del click
	$scope.rangoLibre = {desde: $scope.evento.begin.getMinutosDesdeMedianoche(),
						 hasta: $scope.evento.end.getMinutosDesdeMedianoche()};
	
	$scope.hechoPorDocente = $scope.vistaAnterior.getUsuario().esEncargado && $scope.vistaAnterior.getUsuario().docenteElegido.name != "Ninguno";

	if($scope.hechoPorDocente && $scope.evento.subject) {
		$scope.docente = $scope.vistaAnterior.getUsuario().docenteElegido;
	}
	else {
		$scope.docente = $scope.vistaAnterior.getUsuario();
	};
	
	
	/* No tenemos info sobre cursos
	$scope.franjasHorariasEnMinutos = [
		{de: 600, a: 840, tipo: 'libre', clickeada: false},
		{de: 840, a: 1080, tipo: 'libre y coincide con su materia', clickeada: false},
		{de: 1080, a: 1200, tipo: 'libre', clickeada: true}//Supongamos que quiere reservar un rato LUEGO de su clase por X motivo.
	];
	*/	
	
	
	$scope.minimoPermitido = function() {
		//return $scope.franjasHorariasEnMinutos[0].de; No tenemos info sobre cursos
		return $scope.rangoLibre.desde;
	};
	
	$scope.maximoPermitido = function() {
		//return $scope.franjasHorariasEnMinutos[$scope.franjasHorariasEnMinutos.length - 1].a; No tenemos info sobre cursos
		return $scope.rangoLibre.hasta;
	}
	
	/* No tenemos info sobre cursos
	var franjaClickeada = $scope.franjasHorariasEnMinutos.filter(
		function(unaFranja) {
			return unaFranja.clickeada;
		}
	)[0];
	*/
	
	//var franjaSeleccionadaInicio = franjaClickeada.de; No tenemos info sobre cursos
	var franjaSeleccionadaInicio = $scope.rangoLibre.desde;
	//var franjaSeleccionadaFin = franjaClickeada.a; No tenemos info sobre cursos
	var franjaSeleccionadaFin = $scope.rangoLibre.hasta;
	//var franjaSeleccionadaTipo = franjaClickeada.tipo; No tenemos info sobre cursos
	var franjaSeleccionadaTipo = 'libre';
	//var franjaSeleccionadaClickeada = franjaClickeada.clickeada; No tenemos info sobre cursos
	var franjaSeleccionadaClickeada = true;
	
	$scope.franjaSeleccionada = {desde: franjaSeleccionadaInicio, hasta: franjaSeleccionadaFin, tipo: franjaSeleccionadaTipo, clickeada: franjaSeleccionadaClickeada};
	
	/* No tenemos info sobre cursos
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
	*/
	
	$scope.enviarSolicitud = function() {

		$scope.evento.begin.ajustarHoraYMinutos($scope.franjaSeleccionada.desde);
		$scope.evento.end.ajustarHoraYMinutos($scope.franjaSeleccionada.hasta);

		servidor.enviarNuevaReserva($scope.evento.begin, $scope.evento.end, $scope.evento.lab_id, $scope.evento.subject, $scope.evento.description)
		.success(function(data, status, headers, config) {
			console.log('Enviada la solicitud de reserva exitosamente' + ' (' + $scope.evento.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab($scope.evento.lab_id) + ' el d\xEDa ' + $scope.evento.begin + ')');
			alert('Su solicitud fue recibida exitosamente!');
			$state.go('planillaReservas');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al enviar la solicitud de reserva' + ' (' + $scope.evento.subject + ' en el lab ' + $scope.vistaAnterior.getNombreDelLab($scope.evento.lab_id) + ' el d\xEDa ' + $scope.evento.begin + ')');
			alert('Se produjo un error. Pruebe tocando Listo nuevamente.');
			
			// TEMP
			$state.go('planillaReservas');
		});
	}

	$scope.volver = function(){
		$window.history.back();
	}
	
});



// En otro archivo
angular.module('reservasApp').filter('hourMinFilter', function () {
    return function (fecha) {
		//return fecha.getHours().toString() + ':' + fecha.getMinutes().toString();
		return fecha.getHoraEnString();
    };
});
