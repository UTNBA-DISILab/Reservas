angular.module('reservasApp').controller('nuevaReservaCtrl',function($scope, comunicadorEntreVistasService){
	var vistaAnterior = comunicadorEntreVistasService;

	//Un poco de hardcodeo provisorio para lo que deberá otorgar la vistaAnterior.
	//Sólo se enviarán la franja clickeada y todas las libres contiguas.
	$scope.franjasHorarias = [
		{de: 10, a: 14, tipo: 'libre', clickeada: false},
		{de: 14, a: 18, tipo: 'libre y coincide con su materia', clickeada: false},
		{de: 18, a: 20, tipo: 'libre', clickeada: true}//Supongamos que quiere reservar un rato LUEGO de su clase por X motivo.
	];
});