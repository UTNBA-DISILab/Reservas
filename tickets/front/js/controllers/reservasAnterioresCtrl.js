angular.module('reservasApp').controller('reservasAnterioresCtrl',function($scope, $state, comunicadorEntreVistasService, ayudaService){
	var vistaAnterior = comunicadorEntreVistasService;
	var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();

	if(!vistaAnterior.getUsuario().inicioSesion){
		$state.go('planillaReservas');
	};
	
	// Pendiente: Interaccion con el servicio que habla con el servidor. un GET por Ajax a PHP que devuelva todos los campos de todas las solicitudes/reservas para el docente logueado (va por parametro o ya lo tiene?) cuyas fechas de alta sean mayores o iguales a hoy.
	var getReservas = function() {
		var reservas_string = '[{"fecha_alta":"19/09/2014","cant_alumnos":"20","laboratorio":"verde","fecha_pedida":"29/09/2014","hora_inicio":"08:15","hora_fin":"10:30","estado":"rechazada"},{"fecha_alta":"20/09/2014","cant_alumnos":"21","laboratorio":"rojo","fecha_pedida":"30/09/2014","hora_inicio":"14:15","hora_fin":"16:30","estado":"contra-ofertada","lab_ofrecido":"amarillo"},{"fecha_alta":"20/09/2014","cant_alumnos":"21","laboratorio":"amarillo","fecha_pedida":"30/09/2014","hora_inicio":"19:00","hora_fin":"21:30","estado":"confirmada","lab_ofrecido":"azul"},{"fecha_alta":"20/09/2014","cant_alumnos":"21","laboratorio":"campus","fecha_pedida":"30/09/2014","hora_inicio":"19:15","hora_fin":"20:30","estado":"solicitada"}]';
		
		var reservas_JSON = JSON.parse(reservas_string);
		
		$scope.reservas = reservas_JSON;
	};
	
	getReservas();


});