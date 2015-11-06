angular.module('reservasApp').controller('pedidosDeUnaFranjaCtrl', function($scope, $state, $interval, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){


	var comunicador = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;

	var todas_reservas = []; 

	$scope.contraofertas = [];

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


	$scope.aceptarJustificacion = function(pedido){
		pedido.requiereJustificacion = false;
		if(!pedido.r_flag){
			rechazar(pedido);
			alert('El pedido ha sido rechazado.');
		}else{
			contraofertar(pedido);
			alert('El pedido ha sido contraofertado.');
		}
	};
	
	$scope.cancelarJustificacion = function(pedido){
		pedido.requiereJustificacion = false;
	};

	
	$scope.iniciarContraofertar = function(reserva){
		reserva.requiereJustificacion = true;
		reserva.r_flag = 1;
	};

	$scope.iniciarRechazar = function(reserva){
		reserva.requiereJustificacion = true;
		reserva.r_flag = 0;
	};

	$scope.seContraoferto = function(solicitud) {
		return comunicador.getNombreDelLab(solicitud.lab_id) != solicitud.labContraofertable
				|| solicitud.begin.getMinutosDesdeMedianoche() != solicitud.beginContraofertable
				|| solicitud.end.getMinutosDesdeMedianoche() != solicitud.endContraofertable;
	};

	var contraofertar = function(reserva) {
		reserva.description = reserva.description + " ----- Se ofrece contraoferta de la reserva realizada. ----- \
		  ->Datos de la reserva original:\
		   Horario original de inicio: " + reserva.begin.getHours() + ":" + reserva.begin.getMinutes() +
		"  Horario original de finalizacion: " + reserva.end.getHours() + ":" + reserva.end.getMinutes() +
		"  Laboratorio original: " + comunicador.getNombreDelLab(reserva.lab_id) +
		" ->Motivo de Contraoferta: " + reserva.justificacion;


		if(reserva.begin.getMinutosDesdeMedianoche() != reserva.beginContraofertable){
			var newBegin = new Date(reserva.begin);
			newBegin.setHours(Math.floor(reserva.beginContraofertable/60),reserva.beginContraofertable % 60,0,0);

			reserva.begin = newBegin;
		}

		if(reserva.end.getMinutosDesdeMedianoche() != reserva.endContraofertable){
			var newEnd = new Date(reserva.end);
			newEnd.setHours(Math.floor(reserva.endContraofertable/60),reserva.endContraofertable % 60,0,0);

			reserva.end = newEnd;
		}

		if(reserva.labContraofertable != comunicador.getNombreDelLab(reserva.lab_id))
			reserva.lab_id = comunicador.getIdDelLab(reserva.labContraofertable);
	

		servidor.modificarReserva(reserva)
		.success(function(data, status, headers, config){
			console.log('La reserva: ' + reserva.id + ' ha sido contraofertada correctamente' + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
		})
		.error(function(data, status, headers, config){
			console.log('Se produjo un error al contraofertar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
		});


		actualizarPendientes();
	};

	var rechazar = function(reserva) {
		reserva.description = reserva.description + " ----- Motivo de Rechazo: " + reserva.justificacion;
		
		servidor.rechazarReserva(reserva.id, reserva.description, comunicador.getNombreDelLab(reserva.lab_id), comunicador.getCapacidadDelLab(reserva.lab_id))
		.success(function(data, status, headers, config) {
			console.log('La reserva ' + reserva.id + ' ha sido rechazada correctamente' + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al rechazar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
		});

		actualizarPendientes();
	};

	$scope.confirmar = function(reserva) {
		servidor.confirmarReserva(reserva.id, comunicador.getNombreDelLab(reserva.lab_id), comunicador.getCapacidadDelLab(reserva.lab_id), reserva.description)
		.success(function(data, status, headers, config) {
			console.log('Confirmada la reserva ' + reserva.id + ' exitosamente' + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			alert('El pedido ha sido confirmado!');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al confirmar la reserva ' + reserva.id + ' (' + reserva.subject + ' en el lab ' + comunicador.getNombreDelLab(reserva.lab_id) + ' el d\xEDa ' + reserva.begin + ')');
			alert('Se produjo un error al confirmar la reserva. Intente nuevamente');
		});

		actualizarPendientes();
	};



	$scope.seSuperponeConOtraReserva = function(pedido) {
		var temporal = todas_reservas.concat($scope.pedidos).concat($scope.contraofertas);
		var superpuestos = temporal.filter(function(s_pedido){
			return(pedido.begin < s_pedido.end) 
			   && (pedido.end > s_pedido.begin) 
			   && (pedido.lab_id == s_pedido.lab_id) 
			   && (pedido.id != s_pedido.id)
			   && (s_pedido.state != 1);
		});

		return superpuestos.length;
	}

	$scope.seSuperponeConOtroPedido = function(pedido) {
		var temporal = todas_reservas.concat($scope.pedidos).concat($scope.contraofertas);
		var superpuestos = temporal.filter(function(s_pedido){
			return(pedido.begin < s_pedido.end) 
			   && (pedido.end > s_pedido.begin) 
			   && (pedido.lab_id == s_pedido.lab_id) 
			   && (pedido.id != s_pedido.id)
			   && (s_pedido.state == 1);
		});
		return superpuestos.length;
	}

	var convertirTimestampADate = function(evento) {
		evento.begin = new Date(evento.begin);
		evento.end = new Date(evento.end);
		evento.creation_date = new Date(evento.creation_date);
	}

	var obtenerLaboratorios = function() {

		var comportamientoSiRequestExitoso = function(laboratoriosRecibidos) {
			
			$scope.laboratorios.splice(0,$scope.laboratorios.length); 
			laboratoriosRecibidos.forEach(function(laboratorio){
				$scope.laboratorios.push(laboratorio);
				$scope.nombresDeLaboratorios.push(laboratorio.nombre);
			});
			
			comunicador.setLaboratorios($scope.laboratorios);
			
			sePudieronTraerLaboratorios = true;
			sePudieronTraerLaboratoriosEstaVuelta = true;
		};
		
		
		if( comunicador.getLaboratorios().length < 1 ) {
			servidor.obtenerLaboratorios()
			.success(function(laboratoriosRecibidos, status, headers, config) {
				
				console.log('Obtenidos los laboratorios exitosamente');
				comportamientoSiRequestExitoso(laboratoriosRecibidos);
			})
			.error(function(laboratoriosRecibidos, status, headers, config) {
				
				console.log('Se produjo un error al obtener los laboratorios del servidor');
				
				comportamientoSiRequestExitoso(porDefecto.getLaboratorios());
			});
		}
		else {
			comportamientoSiRequestExitoso(comunicador.getLaboratorios());
		}
	};
	
	var obtenerDocentes = function() {

		var comportamientoSiRequestExitoso = function(docentesRecibidos) {
			$scope.docentes = [];
			
			docentesRecibidos.forEach(function(docente){
				$scope.docentes.push(docente);
			});
			
			$scope.usuario.docenteElegido = $scope.docentes[0];
			comunicador.setDocentes($scope.docentes);			
			sePudieronTraerDocentes = true;
			comunicador.getDocentes().forEach(function(a){
			});
		};
		
		
		if( comunicador.getDocentes().length < 1 ) {
			servidor.obtenerDocentes()
			.success(function(docentesRecibidos, status, headers, config) {
				console.log('Obtenidos los docentes exitosamente');
				comportamientoSiRequestExitoso(docentesRecibidos);
			})
			.error(function(docentesRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los docentes del servidor');
				
				comportamientoSiRequestExitoso(porDefecto.getDocentes());
			});
		}
		else {
			comportamientoSiRequestExitoso(comunicador.getDocentes());
		}
	};

	var obtenerPedidos = function() {

		var comportamientoSiRequestExitoso = function(pedidosRecibidos) {
			pedidosRecibidos.forEach(function(pedido) {
				convertirTimestampADate(pedido);
				pedido.labContraofertable = comunicador.getNombreDelLab(pedido.lab_id);
				pedido.beginContraofertable = pedido.begin.getMinutosDesdeMedianoche();
				pedido.endContraofertable = pedido.end.getMinutosDesdeMedianoche();
				pedido.docenteName = comunicador.getDocenteById(pedido.owner_id);
				pedido.justificacion = "";
				pedido.requiereJustificacion = false;
				if(pedido.state == 1){
					$scope.pedidos.push(pedido);
				}else{
					$scope.contraofertas.push(pedido);
				}
				
			});

			$scope.pedidos.sort(function(first, second){
				var a = new Date(first.begin);
				var b = new Date(second.begin);
				a.setHours(0,0,0,0);
				b.setHours(0,0,0,0);
				

				if (a < b) return -1;

  				else if (a > b) return 1;

  				else if (a.getTime() == b.getTime()){
  					if(first.lab_id <= second.lab_id) {
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
				console.log('Obtenidos los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes exitosamente');
				comportamientoSiRequestExitoso(pedidosRecibidos);
				
				
			})
			.error(function(pedidosRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes' );
			});

		servidor.obtenerReservas(primerDiaSolicitado, porDefecto.getCuantosDiasMas())
			.success(function(reservasRecibidas, status, headers, config) {
				console.log('Obtenidas las reservas desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes exitosamente');
				todas_reservas = reservasRecibidas;
				
				
			})
			.error(function(reservasRecibidas, status, headers, config) {
				console.log('Se produjo un error al obtener las reservas desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes' );
			});
	};


	 var actualizarPendientes = function (){

	 	$scope.pedidos = [];
	 	todas_reservas = [];

	 	$scope.docentes = [];
		sePudieronTraerDocentes = false;

		if(!sePudieronTraerLaboratorios) {
			sePudieronTraerLaboratoriosEstaVuelta = false;
			obtenerLaboratorios();
		};
		
		
		obtenerDocentes();
	
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

