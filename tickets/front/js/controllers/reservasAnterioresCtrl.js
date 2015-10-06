angular.module('reservasApp').controller('reservasAnterioresCtrl',function($scope, $state, $interval, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
	var comunicador = comunicadorEntreVistasService;
	var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;
    ayuda.actualizarExplicaciones();


    $scope.margen = ayuda.getMargen();

    $scope.historial = [];

	$scope.laboratorios = [];
	var sePudieronTraerLaboratoriosEstaVuelta = false;
	var sePudieronTraerLaboratorios = false;
	$scope.nombresDeLaboratorios = [];

    var id_usuario = comunicador.getUsuario().id;

    var primerDiaSolicitado = new Date();
    primerDiaSolicitado.setDate(primerDiaSolicitado.getDay() - 30);
	primerDiaSolicitado.setHours(0,0,0,0);

	var estados_completos = ["Rechazado", "Pedido sin confirmar", "Contra-Ofertado", "Confirmado"];
	var estados =["rechazada", "solicitada", "contra-ofertada", "confirmada"];

	if(!comunicador.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};
	

	var convertirTimestampADate = function(evento) {
		evento.begin = new Date(evento.begin);
		evento.end = new Date(evento.end);
		evento.creation_date = new Date(evento.creation_date);
	}

	$scope.historialVacio = function(){
		return  $scope.historial.length >= 1;
	}

	var obtenerPedidos = function() {

		var comportamientoSiRequestExitoso = function(responseArray) {
			responseArray.forEach(function(node){
				if(node.owner_id == id_usuario){
					convertirTimestampADate(node);
					node.laboratorio = comunicador.getNombreDelLab(node.lab_id);
					node.hora_inicio = node.begin.getHoraEnString();
					node.hora_fin = node.end.getHoraEnString();
					node.fecha_pedida = node.begin.getFechaCorta();
					node.fecha_alta = node.creation_date.getFechaCorta();
					if(node.state == -1){
						node.state = 0;
					}
					node.estado_completo = estados_completos[node.state];
					node.estado = estados[node.state]
					
					console.log(node)
					$scope.historial.push(node);
				}
			});

			

			$scope.historial.sort(function(first, second){
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
		};

		servidor.obtenerTodos(primerDiaSolicitado, 60)
			.success(function(recibidos, status, headers, config) {
				console.log('Obtenidos los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes exitosamente');
				comportamientoSiRequestExitoso(recibidos);
				
				
			})
			.error(function(recibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes' );
			});
	};


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

	var actualizarPendientes = function (){

	 	$scope.historial = [];

		if(!sePudieronTraerLaboratorios) {
			sePudieronTraerLaboratoriosEstaVuelta = false;
			obtenerLaboratorios();
		};
		
	
		sePudieronTraerPedidosEstaVuelta = false;
		obtenerPedidos();
    };

    actualizarPendientes();
});