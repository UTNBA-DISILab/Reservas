angular.module('reservasApp').controller('encabezadoCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
    
    var comunicador = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
    var ayuda = ayudaService;
    $scope.$state = $state;

    $scope.usuario = {id: '', username:'', password: '', nombre: '', apellido: '', inicioSesion: false, esEncargado: false};

    comunicador.setUsuario($scope.usuario);

    $scope.mostrarAyuda = true;
	
	$scope.soyEncargado = false;
	
	$scope.clickSoyDocente = function() {
		$scope.soyEncargado = false;
		iniciarSesionConSinap();
	};
	
	$scope.clickSoyEncargado = function() {
		$scope.soyEncargado = true;
		document.getElementById('nombreDeUsuarioGLPI').focus();
	};
	
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
			// el username ya lo tenemos
			//$scope.usuario.password = '';
			$scope.usuario.nombre = datosDeUsuario.name;
			// el apellido por ahora asumimos que viene en el nombre
			// $scope.usuario.apellido = datosDeUsuario.surname;
			$scope.usuario.inicioSesion = true;
			$scope.usuario.esEncargado = true; //porque todos los que se loguean en GLPI son encargados
			//$scope.esAdmin = (datosDeUsuario.access_level == 2); // por si nos sirve
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};

		var credencialesValidas = function (username, password) {
			return !(typeof username === 'undefined') && username != ''
			// && !(typeof password === 'undefined') && password != ''
		};

		if(!credencialesValidas($scope.usuario.username, $scope.usuario.password)) {
			alert('Debe ingresar sus credenciales');
			return;
		};
		
		servidor.iniciarSesionConGLPI($scope.usuario.username, $scope.usuario.password)
		.success(function(data, status, headers, config) {
			comportamientoSiRequestExitoso(data);
			console.log( $scope.usuario.nombre + ' ' + $scope.usuario.apellido + ' ha iniciado sesion con GLPI exitosamente');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al iniciar sesion con GLPI para el usuario ' + $scope.usuario.username);

			// TEMP
			loginViejoHardcodeado();
		});
		
    };
	
	iniciarSesionConSinap = function() {
		
		// Pendiente: ver como y que datos vienen
		var comportamientoSiRequestExitoso = function(datosDeUsuario) {
			
			$scope.usuario.id = datosDeUsuario.id;
			// el username no importa
			// la password tampoco
			$scope.usuario.nombre = datosDeUsuario.name;
			// el apellido por ahora asumimos que viene en el nombre
			// $scope.usuario.apellido = datosDeUsuario.surname;
			$scope.usuario.inicioSesion = true;
			$scope.usuario.esEncargado = false; //porque todos los que se loguean con Sinap son docentes
			//$scope.esAdmin = false; // por si nos sirve
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};
		
		
		servidor.iniciarSesionConSinap()
		.success(function(data, status, headers, config) {
			comportamientoSiRequestExitoso(data);
			console.log( $scope.usuario.nombre + ' ha iniciado sesion con Sinap exitosamente');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al iniciar sesion con Sinap');
			alert('Por ahora no redirige, siempre da error (ver consola)');
		});
	};
	
	// Esta funcion NO va a estar en produccion
	var loginViejoHardcodeado = function() {
		
		// Falta validar que hayan ingresado caracteres correctos.
        //Luego validar que el usuario y contraseña sean correctos con el servidor y mostrar aviso de no ser así.
        //El servidor sólo deberá informar si es un usuario y contraseña válidos, y qué tipo de usuario es.

        //Lo de acá abajo es sólo para probar mientras no nos comuniquemos con el servidor:
        var docentes = [{id: 31, nombre:"Juan"}, {id: 32, nombre:"Pedro"}, {id: 33, nombre:"Ignacio"} ];

        var encargados = [{id: 50, nombre: 'Gustavo'}];

        if (encargados.filter(function(unEncargado){return unEncargado.nombre == $scope.usuario.username}).length) {
            $scope.usuario.id = 50; // es Gustavo, no hay otros
            $scope.usuario.esEncargado = true;
            $scope.usuario.inicioSesion = true;
            $scope.usuario.docenteElegido = {};//Esto es para después hacer reservas y demás por ellos.
        }
        else {
            if (docentes.filter(function(unDocente){return unDocente.nombre == $scope.usuario.username}).length) {
                
            	if ($scope.usuario.username == 'Juan') {$scope.usuario.id = 31};
            	if ($scope.usuario.username == 'Pedro') {$scope.usuario.id = 32};
            	if ($scope.usuario.username == 'Ignacio') {$scope.usuario.id = 33};

                $scope.usuario.esEncargado = false;
                $scope.usuario.inicioSesion = true;
            }
        }

        $scope.usuario.nombre = $scope.usuario.username;
        
		ayuda.actualizarExplicaciones();
	};
    
	$scope.cerrarSesion = function(){
        
		var comportamientoSiRequestExitoso = function() {
			
			servidor.limpiarCredenciales();
			
			$scope.soyEncargado = false;
			
			$scope.usuario.id = '';
			$scope.usuario.username = '';
			$scope.usuario.password = '';
			$scope.usuario.nombre = '';
			$scope.usuario.apellido = '';
			$scope.usuario.inicioSesion = false;
			$scope.usuario.esEncargado = false;
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};
		
		servidor.cerrarSesion()
		.success(function(data, status, headers, config) {
			console.log('Cerrada la sesion de ' + $scope.usuario.nombre + ' ' + $scope.usuario.apellido + ' exitosamente');
			comportamientoSiRequestExitoso();
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al cerrar la sesion de ' + $scope.usuario.nombre + ' ' + $scope.usuario.apellido);

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