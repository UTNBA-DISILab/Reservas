angular.module('reservasApp').controller('encabezadoCtrl',function($scope, $state, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){
    
    var comunicador = comunicadorEntreVistasService;
	var servidor = comunicadorConServidorService;
    var ayuda = ayudaService;
    $scope.$state = $state;

    if(comunicador.getUsuario().inicioSesion){
    	$scope.usuario = comunicador.getUsuario();
    } else {
		alert('No inicio sesion para la app');
    	$scope.usuario = {id: '', username:'', password: '', name: '', inicioSesion: false, esEncargado: false, esAdministrador: false};
    	comunicador.setUsuario($scope.usuario);
    }

	function cerrarSesion(){
		var comportamientoSiRequestExitoso = function() {
			servidor.limpiarCredenciales();
			$scope.soyEncargado = false;			
			$scope.usuario.id = -1;
			$scope.usuario.username = '';
			$scope.usuario.password = '';
			$scope.usuario.name = '';
			$scope.usuario.inicioSesion = false;
			$scope.usuario.esEncargado = false;
			$scope.usuario.esAdministrador = false;
			comunicador.deleteUsuario();
			$state.go('planillaReservas');
			ayuda.actualizarExplicaciones();
			alert('Deslogueado');
		};

		alert('Llamo al servidor para cerrar sesion');
		servidor.cerrarSesion()
		.success(function(data, status, headers, config) {
			console.log('Cerrada la sesion de ' + $scope.usuario.name + ' exitosamente');
			comportamientoSiRequestExitoso();
		})
		.error(function(data, status, headers, config) {
			alert('Logout Error');
			console.log('Se produjo un error al cerrar la sesion de ' + $scope.usuario.name);
			//comunicador.deleteUsuario();
			// TODO: eliminar
			//comportamientoSiRequestExitoso();
		});

    };
	
	function loginSinap() {
		// Pendiente: ver como y que datos vienen
		var comportamientoSiRequestExitoso = function(datosDeUsuario) {
			if(datosDeUsuario.id != -1){
				$scope.soyEncargado = false;
				$scope.usuario.id = datosDeUsuario.id;
				console.log('id: '+ $scope.usuario.id);
				// el username no importa
				// la password tampoco
				$scope.usuario.name = datosDeUsuario.name;
				console.log('name: '+ $scope.usuario.name);
				// el apellido por ahora asumimos que viene en el nombre
				// $scope.usuario.apellido = datosDeUsuario.surname;
				$scope.usuario.inicioSesion = true;
				$scope.usuario.esEncargado = false; //porque todos los que se loguean con Sinap son docentes
				//$scope.esAdmin = false; // por si nos sirve
				comunicador.setUsuario($scope.usuario);
				$state.go('planillaReservas');
				ayuda.actualizarExplicaciones();
				console.log( $scope.usuario.name + ' ha iniciado sesion con Sinap exitosamente');
			}
		};
	
		servidor.iniciarSesionConSinap()
		.success(function(data, status, headers, config) {
			comportamientoSiRequestExitoso(data);
		})
		.error(function(data, status, headers, config) {
			console.log('Se produjo un error al iniciar sesion con Sinap');
			comunicador.deleteUsuario();
		});
	};

    $scope.mostrarAyuda = {mostrar: true};

	//Inicio sesion y es un docente.
	alert("Inicio sesion: "+ $scope.usuario.inicioSesion);
	alert("Es encagado?: "+ $scope.usuario.esEncargado);
	if(!$scope.usuario.inicioSesion){
		alert('Logueo docente');
		loginSinap();
	}else{
		if(!$scope.usuario.esEncargado){
			alert('Deslogueo a docente');
			cerrarSesion();
		}
	}

	$scope.clickSoyDocente = function() {
		document.location.href="Auth.php";
	};
	
	$scope.cerrarSesionSinap = function() {
		window.location.assign("LogoutSinap.php");
	}

	$scope.cerrarSessionGLPI = function() {
		cerrarSesion();
	}
	
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
