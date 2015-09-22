angular.module('reservasApp').controller('cargarMateriasCtrl',function($scope, $state, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
    
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
		
		var yaEstaCargada = function() {
			return $scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].materias.filter(function(materia) {
				return materia == $scope.materiaIngresada
			}).length;
		}
		
		if(!yaEstaCargada()) {
			
			$scope.cargando = true;
			
			servidor.cargarMateria($scope.materiaIngresada, $scope.especialidadSeleccionada)
			.success(function(data, status, headers, config) {
				
				// Se agrega a la lista visible de materias la nueva
				$scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].materias.push($scope.materiaIngresada);
				
				console.log('Se ha cargado exitosamente la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada.nombre + ').');
				
				$scope.cargando = false;
			})
			.error(function(data, status, headers, config) {
				//alert('Se produjo un error al cargar la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada + ').');
				console.log('Se produjo un error al cargar la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada.nombre + ').');
				
				// TEMP
				$scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].materias.push($scope.materiaIngresada);
				$scope.materiaIngresada = '';
				document.getElementById("materia").focus();
				
				$scope.cargando = false;
				
			});
		}
		else {
			alert('Esa materia ya est\xE1 cargada.');
		}
		
	};
	
	$scope.volver = function(){
		$window.history.back();
	};
	
	$scope.obtenerMaterias();
	
});