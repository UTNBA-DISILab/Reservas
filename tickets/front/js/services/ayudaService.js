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
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Inhabilitado.', color: '#444444'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Libre, a\xFAn no se ha asignado a ning\xFAn docente.', color: '#F5F5F5'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Reservado por alg\xFAn docente.', color: '#888888'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Solicitado por uno o m\xE1s docentes.', color: '#CD853F'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Reservado a nombre del docente seleccionado.', color: '#8B4513'},

            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Inhabilitado.', color: '#444444'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Libre, a\xFAn no se ha asignado a ning\xFAn docente.', color: '#F5F5F5'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Reservado por otros docentes.', color: '#888888'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Pedidos a mi nombre que a\xFAn no me aceptaron.', color: '#CD853F'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Reservas confirmadas a mi nombre.', color: '#8B4513'},

            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Inhabilitado.', color: '#444444'},
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Libre, a\xFAn no se ha asignado a ning\xFAn docente.', color: '#F5F5F5'},
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Reservado por alg\xFAn docente.', color: '#888888'}
        ],
        'pedidoDeReserva': [

        ],
        'pedidosDeUnaFranja': [
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Explicaci\xF3n a modo de ejemplo, ac\xF3 se podr\xEDa prescindir de los colores de la izquierda', color: '#e0ffff'}
        ],
		'cargarMaterias': [
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Explicaci\xF3n a modo de ejemplo, ac\xF3 se podr\xEDa prescindir de los colores de la izquierda', color: '#e0ffff'}
        ],
        'reservasAnteriores': [

        ],
		'cancelarPedidoOReserva': [

        ]
    };
    var explicacionesDeEstaVista = [];

    var cosasDeUnaVista = {
        setUsuarioYExplicaciones: function(usuarioRecibido, explicacionesRecibidas){
            usuario = usuarioRecibido;
            explicacionesDeEstaVista = explicacionesRecibidas;
        },
        actualizarExplicaciones: function(){
            var nombreDeLaVista = $state.current.name;
            explicacionesDeEstaVista.splice(0, explicacionesDeEstaVista.length);
            explicaciones[nombreDeLaVista].forEach(function(explicacion){
                if(explicacion.debeHaberIniciadoSesion == usuario.inicioSesion && explicacion.esParaEncargado == usuario.esEncargado){
                    explicacionesDeEstaVista.push(explicacion);
                };
            });
            this.actualizarMargen();
        },
        actualizarMargen: function(){
            var cantidadDeExplicaciones = explicacionesDeEstaVista.length;
            margen['margin-top'] = (margenMinimo + margenPorCadaExplicacion * cantidadDeExplicaciones).toString() + 'px';
            altura['height'] = (alturaMinima + margenPorCadaExplicacion * cantidadDeExplicaciones).toString() + 'px';
        },
        sinAyudas: function(){
            margen['margin-top'] = margenMinimo.toString() + 'px';
            altura['height'] = alturaMinima.toString() + 'px';
        },
        getMargen: function(){
            return margen;
        },
        getAlturaDeAyudas: function(){
            return altura;
        }
    };

    return cosasDeUnaVista;
})