angular.module('reservasApp').service('ayudaService',function($state){

    var evento = {};
    var dia = {};
    var usuario = {};
    var margenMinimo = 100;
    var alturaMinima = 0;
    var margenPorCadaExplicacion = 27;
    var margen = {'margin-top': (margenMinimo).toString() + 'px'};
    var altura = {'height': (margenMinimo).toString() + 'px'};
    var usuario = {};
    var explicaciones = {
        'planillaReservas': [
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
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Libre, aún no se ha asignado a ningún docente.', color: '#e0ffff'}
        ],
        'pedidoDeReserva': [

        ],
        'pedidosDeUnDia': [
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Explicación a modo de ejemplo, acá se podría prescindir de los colores de la izquierda', color: '#e0ffff'}
        ],
        'reservasAnteriores': [

        ]
    };
    var explicacionesDeEstaVista = [];

    var cosasDeUnaVista = {
        getExplicacionesSegun: function(usuarioRecibido){
            usuario = usuarioRecibido;
            this.actualizarExplicaciones(usuario);
            return explicacionesDeEstaVista;
        },
        actualizarExplicaciones: function(){
            var nombreDeLaVista = $state.current.name;
            if(!nombreDeLaVista){nombreDeLaVista='planillaReservas'};//Esto se tiene que ir en cuanto se llame desde la vista
            explicacionesDeEstaVista.splice(0, explicacionesDeEstaVista.length);
            explicaciones[nombreDeLaVista].forEach(function(explicacion){
                if(explicacion.debeHaberIniciadoSesion == usuario.inicioSesion && explicacion.esParaEncargado == usuario.esEncargado){
                    explicacionesDeEstaVista.push(explicacion);
                };
            });
            this.actualizarMargen(explicacionesDeEstaVista.length);
        },
        actualizarMargen: function(){
            var cantidadDeExplicaciones = explicacionesDeEstaVista.length;
            margen['margin-top'] = (margenMinimo + margenPorCadaExplicacion * cantidadDeExplicaciones).toString() + 'px';
            altura['height'] = (alturaMinima + margenPorCadaExplicacion * cantidadDeExplicaciones).toString() + 'px';
        },
        getMargen: function(){
            return margen;
        },
        setMostrarAyuda: function(unUsuario){
            usuario = unUsuario;
        },
        getAlturaDeAyudas: function(){
            return altura;
        }
    };

    return cosasDeUnaVista;
})