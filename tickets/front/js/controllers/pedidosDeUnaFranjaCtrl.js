angular.module('reservasApp').controller('pedidosDeUnaFranjaCtrl',function($scope, $state, $interval, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
	
	var comunicador = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;

	var todas_reservas = []; 

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


	$scope.confirmar = function(reserva) {
		servidor.confirmarReserva(reserva.id)
		.success(function(data, status, headers, config) {
			console.log('Confirmada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			reserva.listo = true;
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al confirmar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');

			// TEMP
			reserva.listo = true;
		});
	};



	$scope.seSuperponeConOtraReserva = function(pedido) {
		var temporal = todas_reservas.slice();
		var superpuestos = temporal.filter(function(s_pedido){
			return(pedido.begin < s_pedido.end) 
			   && (pedido.end > s_pedido.begin) 
			   && (pedido.lab_id == s_pedido.lab_id) 
			   && (pedido.id != s_pedido.id)
			   && (pedido.state != 1);
		});
		return superpuestos.length;
	}

	$scope.seSuperponeConOtroPedido = function(pedido) {
		var temporal = todas_reservas.slice();
		var superpuestos = temporal.filter(function(s_pedido){
			return(pedido.begin < s_pedido.end) 
			   && (pedido.end > s_pedido.begin) 
			   && (pedido.lab_id == s_pedido.lab_id) 
			   && (pedido.id != s_pedido.id)
			   && (pedido.state == 1);
		});
		return superpuestos.length;
	}

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
								
				todas_reservas.push(pedido)
			});

			$scope.pedidos = todas_reservas.filter(function(reserva){
					return reserva.state == 1;
				});


			$scope.pedidos.sort(function(first, second){
				var a = new Date(first.begin);
				var b = new Date(second.begin);
				a.setHours(0,0,0,0);
				b.setHours(0,0,0,0);
				console.log("1° : " + a + "  2° : " + b)

				if (a < b) return -1;

  				else if (a > b) return 1;

  				else if (a.getTime() == b.getTime()){
  					if(first.lab_id <= second.lab_id) {
							console.log("1° : " + a + " || " + first.lab_id +"  2° : " + b + " || " + first.lab_id);
							return -1;
						}
						else
							return 1;
  				}
  				
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

