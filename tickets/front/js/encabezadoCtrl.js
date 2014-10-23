angular.module('reservasApp').controller('encabezadoCtrl',function($scope, $state, comunicadorEntreVistasService){
    
    var comunicador = comunicadorEntreVistasService;

    $scope.usuario = {nombre: '', password: '', inicioSesion: false, esEncargado: false};

    comunicador.setUsuario($scope.usuario);

    $scope.mostrarAyuda = true;
    $scope.explicaciones = [
        {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Inhabilitado.', color: '#888888'},
        {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Reservado por algún docente.', color: '#800080'},
        {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Solicitado por uno o más docentes.', color: '#ff00ff'},
        {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Libre, aún no se ha asignado a ningún docente.', color: '#e0ffff'},
        {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Reservado por otros docentes o inhabilitado.', color: '#888888'},
        {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Reservado a mi nombre.', color: '#800080'},
        {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Pedidos a mi nombre que aún no me aceptaron.', color: '#ff00ff'},
        {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Libre, aún no se ha asignado a ningún docente.', color: '#e0ffff'},
        {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Libre y, además, coincide con el horario del curso que seleccione debajo.', color: '#00ffff'},
        {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Reservado por algún docente o inhabilitado.', color: '#888888'},
        {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Libre, aún no se ha asignado a ningún docente.', color: '#e0ffff'}];
	
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
            $scope.usuario.docenteElegido = '';//Esto es para después hacer reservas y demás por ellos.
        }
        else {
            if (docentes.filter(function(nombre){return nombre == $scope.usuario.nombre}).length) {
                $scope.usuario.esEncargado = false;
                $scope.usuario.inicioSesion = true;
            }
        }

    };
    $scope.cerrarSesion = function(){
        $scope.usuario.nombre = '';
        $scope.usuario.password = '';
        $scope.usuario.inicioSesion = false;
        $scope.usuario.esEncargado = false;
        $state.go('planillaReservas');
    };
});