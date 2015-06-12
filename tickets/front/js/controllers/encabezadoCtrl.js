angular.module('reservasApp').controller('encabezadoCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
    
    var comunicador = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
    var ayuda = ayudaService;
    $scope.$state = $state;

    if(comunicador.getUsuario().inicioSesion){
    	$scope.usuario = comunicador.getUsuario();
    } else {
    	$scope.usuario = {id: '', username:'', password: '', name: '', inicioSesion: false, esEncargado: false, esAdministrador: false};
    	comunicador.setUsuario($scope.usuario);
    }

    $scope.mostrarAyuda = {mostrar: true};
	
	$scope.soyEncargado = false;
	
	$scope.clickSoyDocente = function() {
		$scope.soyEncargado = false;
		iniciarSesionConSinap();
	};
	
	$scope.clickSoyEncargado = function() {
		$scope.soyEncargado = true;
		
		// Sin esperar nada no anda. Esperamos medio segundo.
		setTimeout(function() {
			document.getElementById('nombreDeUsuarioGLPI').focus()
		}, 500);
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
    ayuda.inicializar($scope.usuario, $scope.explicaciones,$scope.mostrarAyuda);//Con esto siempre tendrá el usuario  y las explicaciones actualizadas
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
			$scope.usuario.name = datosDeUsuario.name;
			// el apellido por ahora asumimos que viene en el nombre
			// $scope.usuario.apellido = datosDeUsuario.surname;
			$scope.usuario.inicioSesion = true;
			$scope.usuario.esEncargado = true; //porque todos los que se loguean en GLPI son encargados
			$scope.usuario.esAdministrador = (datosDeUsuario.access_level == 2); // por si nos sirve
			comunicador.setUsuario($scope.usuario);
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
			console.log( $scope.usuario.name + ' ha iniciado sesion con GLPI exitosamente');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al iniciar sesion con GLPI para el usuario ' + $scope.usuario.username);
			alert('Usuario o contraseña incorrecta');
			comunicador.deleteUsuario();
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
			$scope.usuario.name = datosDeUsuario.name;
			// el apellido por ahora asumimos que viene en el nombre
			// $scope.usuario.apellido = datosDeUsuario.surname;
			$scope.usuario.inicioSesion = true;
			$scope.usuario.esEncargado = false; //porque todos los que se loguean con Sinap son docentes
			//$scope.esAdmin = false; // por si nos sirve
			comunicador.setUsuario($scope.usuario);
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};
		
		alert('iniciando sesion con sinap');
		servidor.iniciarSesionConSinap()
		.success(function(data, status, headers, config) {
			console.log(data);
			comportamientoSiRequestExitoso(data);
			console.log( $scope.usuario.name + ' ha iniciado sesion con Sinap exitosamente');
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al iniciar sesion con Sinap');
			comunicador.deleteUsuario();
			alert('Por ahora no redirige, siempre da error (ver consola)');
		});
	};
	
	// Esta funcion NO va a estar en produccion
	var loginViejoHardcodeado = function() {
		
		// Falta validar que hayan ingresado caracteres correctos.
        //Luego validar que el usuario y contraseña sean correctos con el servidor y mostrar aviso de no ser así.
        //El servidor sólo deberá informar si es un usuario y contraseña válidos, y qué tipo de usuario es.

        //Lo de acá abajo es sólo para probar mientras no nos comuniquemos con el servidor:
        var docentes = [{id: 31, name:"Juan"}, {id: 32, name:"Pedro"}, {id: 33, name:"Ignacio"} ];

        var encargados = [{id: 50, name: 'Gustavo'}];

        if (encargados.filter(function(unEncargado){return unEncargado.name == $scope.usuario.username}).length) {
            $scope.usuario.id = 50; // es Gustavo, no hay otros
            $scope.usuario.esEncargado = true;
            $scope.usuario.inicioSesion = true;
            $scope.usuario.docenteElegido = {};//Esto es para después hacer reservas y demás por ellos.
        }
        else {
            if (docentes.filter(function(unDocente){return unDocente.name == $scope.usuario.username}).length) {
                
            	if ($scope.usuario.username == 'Juan') {$scope.usuario.id = 31};
            	if ($scope.usuario.username == 'Pedro') {$scope.usuario.id = 32};
            	if ($scope.usuario.username == 'Ignacio') {$scope.usuario.id = 33};

                $scope.usuario.esEncargado = false;
                $scope.usuario.inicioSesion = true;
            }
        }

        $scope.usuario.name = $scope.usuario.username;
        
        comunicador.setUsuario($scope.usuario);
		ayuda.actualizarExplicaciones();
	};
    
	$scope.cerrarSesion = function(){
        
		var comportamientoSiRequestExitoso = function() {
			
			servidor.limpiarCredenciales();
			
			$scope.soyEncargado = false;
			
			$scope.usuario.id = '';
			$scope.usuario.username = '';
			$scope.usuario.password = '';
			$scope.usuario.name = '';
			$scope.usuario.inicioSesion = false;
			$scope.usuario.esEncargado = false;
			$scope.usuario.esAdministrador = false;
			comunicador.deleteUsuario();
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
		};
		
		servidor.cerrarSesion()
		.success(function(data, status, headers, config) {
			console.log('Cerrada la sesion de ' + $scope.usuario.name + ' exitosamente');
			comportamientoSiRequestExitoso();
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al cerrar la sesion de ' + $scope.usuario.name);
			comunicador.deleteUsuario();
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

    $scope.verAsistencia = function(){
    	$state.go('asistencia');
    }
});
