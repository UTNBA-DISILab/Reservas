angular.module('reservasApp').controller('cargarMateriasCtrl',function($scope, $state, $window, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){
    
    var ayuda = ayudaService;
	var servidor = comunicadorConServidorService;
	var porDefecto = valoresPorDefectoService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();    
	
	$scope.obtenerMaterias = function() {
		servidor.obtenerMaterias()
		.success(function(materiasObtenidas, status, headers, config) {
			
			console.log(materiasObtenidas[0]);

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
			return $scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].subjects.filter(function(materia) {
				return materia.name == $scope.materiaIngresada
			}).length;
		}

		var yaEstaCargadoCodigo = function() {
			return $scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].subjects.filter(function(materia) {
				return materia.code == $scope.codigoIngresado
			}).length;
		}
		
		if(!yaEstaCargada() && !yaEstaCargadoCodigo()) {

			$scope.cargando = true;
			
			console.log($scope.especialidadSeleccionada);

			//si no se ingreso el codigo para que no tire error
			if (!$scope.codigoIngresado){
				$scope.codigoIngresado = '';
			}

			servidor.cargarMateria($scope.materiaIngresada, $scope.especialidadSeleccionada.name, $scope.codigoIngresado)
			.success(function(data, status, headers, config) {
				
				// Se agrega a la lista visible de materias la nueva
				var materiaNueva = new Array();
				materiaNueva.name = $scope.materiaIngresada;
				materiaNueva.code = $scope.codigoIngresado;
				$scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].subjects.push(materiaNueva);
				
				console.log('Se ha cargado exitosamente la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada.name + ').');
				

				alert('Se ha cargado exitosamente la materia: ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada.name + ').');
				//$scope.obtenerMaterias();
				$scope.materiaIngresada = '';
				$scope.codigoIngresado = '';

				$scope.cargando = false;
			})
			.error(function(data, status, headers, config) {
				//alert('Se produjo un error al cargar la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada + ').');
				console.log('Se produjo un error al cargar la materia ' + $scope.materiaIngresada + ' (' +  $scope.especialidadSeleccionada.name + ').');
				
				// TEMP
				$scope.especialidades[$scope.especialidades.indexOf($scope.especialidadSeleccionada)].subjects.push($scope.materiaIngresada);
				$scope.materiaIngresada = '';
				document.getElementById("materia").focus();
				
				$scope.cargando = false;
				
			});
		}
		else {
			if (yaEstaCargada())
			alert('Esa materia ya est\xE1 cargada.');
			else
			alert('Ese codigo ya est\xE1 cargado.');
				
			$scope.materiaIngresada = '';
			$scope.codigoIngresado = '';
		}
		
	};
	
	$scope.obtenerMaterias();
	
});