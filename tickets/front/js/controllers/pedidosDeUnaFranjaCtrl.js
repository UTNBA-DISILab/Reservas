angular.module('reservasApp').controller('pedidosDeUnaFranjaCtrl',function($scope, $state, $interval, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
	
	var comunicador = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;

	$scope.pedidos = [];
    var sePudieronTraerPedidosEstaVuelta = false;
    var pedidosAuxiliares = [];

    $scope.laboratorios = [];
	var sePudieronTraerLaboratoriosEstaVuelta = false;
	var sePudieronTraerLaboratorios = false;
	
	$scope.docentes = [];
	var sePudieronTraerDocentes = false;
	
	$scope.nombresDeLaboratorios = [];

    var primerDiaSolicitado = new Date();
	primerDiaSolicitado.setHours(0,0,0,0);

	var diasSolicitados = porDefecto.getDiasMostradosIniciales();
	var cuantosDiasMasCargar = porDefecto.getCuantosDiasMas();
    var horaDeApertura = porDefecto.getHoraDeApertura();
    var horaDeCierre = porDefecto.getHoraDeCierre();

    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

    $scope.minimo = porDefecto.getHoraDeApertura().getMinutosDesdeMedianoche();
	$scope.maximo = porDefecto.getHoraDeCierre().getMinutosDesdeMedianoche();
	
	if(!comunicador.getUsuario().inicioSesion){
		$state.go('planillaReservas');

	};

	



	var convertirTimestampADate = function(evento) {
		evento.begin = new Date(evento.begin);//Las fechas vienen en timestamp y es mucho más fácil manejarlas como Date.
		evento.end = new Date(evento.end);
		evento.creation_date = new Date(evento.creation_date);
	}

	var obtenerLaboratorios = function() {

		var comportamientoSiRequestExitoso = function(laboratoriosRecibidos) {
			
			$scope.laboratorios.splice(0,$scope.laboratorios.length); // Acá sí va esto, porque en este caso el server devuelve siempre lo mismo y no quiero tener labs repetidos.
			laboratoriosRecibidos.forEach(function(laboratorio){
				
				$scope.laboratorios.push(laboratorio);
				$scope.nombresDeLaboratorios.push(laboratorio.nombre);
				console.log("Laboratorio " + $scope.nombresDeLaboratorios)
			});
			
			comunicador.setLaboratorios($scope.laboratorios);
			
			sePudieronTraerLaboratorios = true;
			sePudieronTraerLaboratoriosEstaVuelta = true;
		};
		
		// primero se los pedimos al comunicador entre vistas, que viene a actuar como cache
		if( comunicador.getLaboratorios().length < 1 ) {
			servidor.obtenerLaboratorios()
			.success(function(laboratoriosRecibidos, status, headers, config) {
				// Esta devolución se llamará asincrónicamente cuando la respuesta esté disponible.
				console.log('Obtenidos los laboratorios exitosamente');
				comportamientoSiRequestExitoso(laboratoriosRecibidos);
			})
			.error(function(laboratoriosRecibidos, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log('Se produjo un error al obtener los laboratorios del servidor');
				//algoTuvoUnError = true; -> Esto va descomentado cuando probemos con el server.
	
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getLaboratorios());
			});
		}
		else {
			comportamientoSiRequestExitoso(comunicador.getLaboratorios());
		}
	};
	
	var obtenerDocentes = function() {

		var comportamientoSiRequestExitoso = function(docentesRecibidos) {
			//$scope.docentes.splice(0,$scope.docentes.length); // Acá sí va esto, porque en este caso el server devuelve siempre lo mismo y no quiero tener docentes repetidos.
			//$scope.docentes.push("Ninguno");
			$scope.docentes = [];
			docentesRecibidos.forEach(function(docente){
				$scope.docentes.push(docente);
			});
			
			$scope.usuario.docenteElegido = $scope.docentes[0];
			comunicador.setDocentes($scope.docentes);			
			sePudieronTraerDocentes = true;
		};
		
		// primero se los pedimos al comunicador entre vistas, que viene a actuar como cache
		if( comunicador.getDocentes().length < 1 ) {
			servidor.obtenerDocentes()
			.success(function(docentesRecibidos, status, headers, config) {
				console.log('Obtenidos los docentes exitosamente');
				comportamientoSiRequestExitoso(docentesRecibidos);
			})
			.error(function(docentesRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los docentes del servidor');
				//TODO:debería haber un alert acá, en lugar de cargarlo con valores hardcodeados en un js...
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getDocentes());
			});
		}
		else {
			comportamientoSiRequestExitoso(comunicador.getDocentes());
		}
	};

	var obtenerPedidos = function() {

		var comportamientoSiRequestExitoso = function(pedidosRecibidos) {
			
			//pedidos.splice(0,pedidos.length); //Por qué? cuando pida los de febrero, no quiero que se vayan del calendario los de maniana que ya tenia.
			pedidosRecibidos.forEach(function(pedido) {
				//pedido.tipo = 'pedido';
				convertirTimestampADate(pedido);
				pedido.labContraofertable = comunicador.getNombreDelLab(pedido.lab_id);
				pedido.beginContraofertable = pedido.begin.getMinutosDesdeMedianoche();
				pedido.endContraofertable = pedido.end.getMinutosDesdeMedianoche();
				pedido.docenteName = comunicador.getDocenteById(pedido.owner_id);
				$scope.pedidos.push(pedido)
			});
			
			pedidosAuxiliares = $scope.pedidos;
			sePudieronTraerPedidosEstaVuelta = true;

			if($scope.pedidos[0]){
				if($scope.pedidos[0].begin.getDay() != "6"){
					$scope.minimo = porDefecto.getHoraDeApertura().getMinutosDesdeMedianoche();
					$scope.maximo = porDefecto.getHoraDeCierre().getMinutosDesdeMedianoche();
				} else {
					$scope.minimo = porDefecto.getHoraDeAperturaSabados().getMinutosDesdeMedianoche();
					$scope.maximo = porDefecto.getHoraDeCierreSabados().getMinutosDesdeMedianoche();
		}
	}
		};
		
		// el parametro usuario no se usa; el usuario logueado se obtiene de la cookie.
		//Pero mientras tanto:
		servidor.obtenerPedidos(primerDiaSolicitado, porDefecto.getCuantosDiasMas())
			.success(function(pedidosRecibidos, status, headers, config) {
				console.log('Obtenidas los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes exitosamente');
				comportamientoSiRequestExitoso(pedidosRecibidos);
				
			})
			.error(function(pedidosRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes' );
	
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getPedidos(comunicador.getUsuario()));
			});
	};


	 var actualizarPendientes = function (){

		if(!sePudieronTraerLaboratorios) {
			sePudieronTraerLaboratoriosEstaVuelta = false;
			obtenerLaboratorios();
		};
		
		if(!sePudieronTraerDocentes && $scope.usuario.esEncargado) {
			obtenerDocentes();
		};
		
	
		sePudieronTraerPedidosEstaVuelta = false;
		obtenerPedidos();
    };

    actualizarPendientes();

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

