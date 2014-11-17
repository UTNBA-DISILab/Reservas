angular.module('reservasApp').controller('encabezadoCtrl',function($scope, $state, comunicadorEntreVistasService, ayudaService){
    
    var comunicador = comunicadorEntreVistasService;
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

    $scope.iniciarSesion = function(){

        // Falta alidar que hayan ingresado caracteres correctos.
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
        $scope.usuario.id = '';
		$scope.usuario.nombre = '';
        $scope.usuario.password = '';
        $scope.usuario.inicioSesion = false;
        $scope.usuario.esEncargado = false;
        $state.go('planillaReservas');
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
});