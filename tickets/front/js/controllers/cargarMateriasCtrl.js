angular.module('reservasApp').controller('cargarMateriasCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
    
    var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	$scope.obtenerMaterias = function() {
		servidor.obtenerMaterias()
		.success(function(materiasObtenidas, status, headers, config) {
			
			$scope.especialidades = materiasObtenidas;
			console.log('Obtenidas las materias y especialidades exitosamente!');
		})
		.error(function(data, status, headers, config) {
			
			console.log('Se produjo un error al obtener las materias del servidor.');
			
			// TEMP
			$scope.especialidades = porDefecto.getEspecialidades();
		});
	};
	
	$scope.cargarMateria = function() {
		
		$scope.cargando = true;
		servidor.cargarMateria($scope.materiaIngresada, $scope.especialidadSeleccionada)
			.success(function(data, status, headers, config) {
				
				// Se agrega a la lista visible de materias la nueva
				$scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].materias.push($scope.materiaIngresada);
				
				$scope.cargando = false;
			})
			.error(function(data, status, headers, config) {
				//alert('Se produjo un error al cargar la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada + ').');
				
				// TEMP
				$scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].materias.push($scope.materiaIngresada);
				$scope.materiaIngresada = '';
				document.getElementById("materia").focus();
				
				$scope.cargando = false;
				
			});
	};
	
	$scope.obtenerMaterias();
	
});