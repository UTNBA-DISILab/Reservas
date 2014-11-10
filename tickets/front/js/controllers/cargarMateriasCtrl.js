angular.module('reservasApp').controller('cargarMateriasCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
    
    var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	$scope.especialidades = [
		{
			nombre: "Sistemas",
			materias: ['Redes','Simulacion','Operativos']
		},
		{
			nombre: "Industrial",
			materias: ['Ruedas','Maquinas I','Industrias I']
		},
		{
			nombre: "Quimica",
			materias: ['Explosiones','Probetas','Acidos I']
		},
		{
			nombre: "Electrica",
			materias: ['Cables','Transformadores','Integracion II','oo','pp']
		},
		{
			nombre: "Naval",
			materias: ['Barcos','Muelles','Dibujo naval']
		},	
	
	];
	
});