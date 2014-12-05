angular.module('reservasApp').controller('encabezadoCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
    
    var comunicador = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
    var ayuda = ayudaService;
    $scope.$state = $state;

    $scope.usuario = {id: '', nombre: '', password: '', inicioSesion: false, esEncargado: false};

    comunicador.setUsuario($scope.usuario);

    $scope.mostrarAyuda = true;
	
    $scope.actualizarMargen = function(){
        if($scope.mostrarAyuda){
            ayuda.actualizarMargen();
        }
        else {
            ayuda.sinAyudas();
        };
        $scope.alturaDeAyudas = ayuda.getAlturaDeAyudas();
    };
    $scope.explicaciones = [];
    ayuda.setUsuarioYExplicaciones($scope.usuario, $scope.explicaciones);//Con esto siempre tendrá el usuario  y las explicaciones actualizadas
    $scope.actualizarMargen();

    $scope.iniciarSesionConGLPI = function() {

        var comportamientoSiRequestExitoso = function(datosDeUsuario) {
			
			// en datosDeUsuario tenemos Id, access_level y session_id.
			// access_level 0 es docente, 1 es encargado, 2 es admin (como Ramiro)
			// Distinguimos encargado de admin en algun momento en el frontend?
			// Pendiente: No estamos usando el session_id para nada. Para que hay que usarlo?
			
			$scope.usuario.id = datosDeUsuario.id;
			//$scope.usuario.nombre = datosDeUsuario.name;
			//$scope.usuario.password = '';
			$scope.usuario.inicioSesion = true;
			$scope.usuario.esEncargado = true; //porque todos los que se loguean en GLPI son encargados
			//$scope.esAdmin = (datosDeUsuario.access_level == 2); // por si nos sirve
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};
		
		servidor.iniciarSesionConGLPI($scope.usuario.nombre, $scope.usuario.password)
		.success(function(data, status, headers, config) {
			console.log( $scope.usuario.nombre + ' ha iniciado sesion exitosamente');
			comportamientoSiRequestExitoso(data);
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al iniciar sesion para ' + $scope.usuario.nombre);

			// TEMP
			loginViejoHardcodeado();
		});
		
    };
	
	var loginViejoHardcodeado = function() {
		
		// Falta validar que hayan ingresado caracteres correctos.
        //Luego validar que el usuario y contraseña sean correctos con el servidor y mostrar aviso de no ser así.
        //El servidor sólo deberá informar si es un usuario y contraseña válidos, y qué tipo de usuario es.

        //Lo de acá abajo es sólo para probar mientras no nos comuniquemos con el servidor:
        var docentes = ['Juan', 'Pedro', 'Ignacio'];
        var encargados = ['Gustavo'];

        if (encargados.filter(function(nombre){return nombre == $scope.usuario.nombre}).length) {
            $scope.usuario.esEncargado = true;
            $scope.usuario.inicioSesion = true;
            $scope.usuario.docenteElegido = {};//Esto es para después hacer reservas y demás por ellos.
        }
        else {
            if (docentes.filter(function(nombre){return nombre == $scope.usuario.nombre}).length) {
                $scope.usuario.esEncargado = false;
                $scope.usuario.inicioSesion = true;
            }
        }
        
		ayuda.actualizarExplicaciones();
	};
    
	$scope.cerrarSesion = function(){
        
		var comportamientoSiRequestExitoso = function() {
			
			servidor.limpiarCredenciales();
			
			$scope.usuario.id = '';
			$scope.usuario.nombre = '';
			$scope.usuario.password = '';
			$scope.usuario.inicioSesion = false;
			$scope.usuario.esEncargado = false;
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};
		
		servidor.cerrarSesion()
		.success(function(data, status, headers, config) {
			console.log('Cerrada la sesion de ' + $scope.usuario.nombre + ' exitosamente');
			comportamientoSiRequestExitoso();
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al cerrar la sesion de ' + $scope.usuario.nombre);

			// TEMP
			comportamientoSiRequestExitoso();
		});
		
    };
    
	$scope.irAlHistorial = function(){
        $state.go('reservasAnteriores');
    };
	
	$scope.irALasSolicitudesPendientes = function(){
        $state.go('pedidosDeUnaFranja');
    };
	
	$scope.irACargarMaterias = function(){
        $state.go('cargarMaterias');
    };
});