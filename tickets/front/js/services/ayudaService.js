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
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Inhabilitado o Contraofertado aún sin confirmar.', color: '#888888'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Libre, a\xFAn no se ha asignado a ning\xFAn docente.', color: '#F5F5F5'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Reservado por alg\xFAn docente.', color: '#444444'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Solicitado por uno o m\xE1s docentes.', color: '#CD853F'},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Reservado a nombre del docente seleccionado.', color: '#8B4513'},

            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Inhabilitado.', color: '#888888'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Libre, a\xFAn no se ha asignado a ning\xFAn docente.', color: '#F5F5F5'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Reservado por otros docentes.', color: '#444444'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Pedidos a mi nombre que a\xFAn no me aceptaron.', color: '#CD853F'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Reservas confirmadas a mi nombre.', color: '#8B4513'},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Contraoferta que aún debo confirmar o rechazar.', color: '#00FFFF'},

            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Inhabilitado.', color: '#888888'},
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Libre, a\xFAn no se ha asignado a ning\xFAn docente.', color: '#F5F5F5'},
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Reservado por alg\xFAn docente.', color: '#444444'}
        ],
        'pedidoDeReserva': [ // Esto está abierto a que en un futuro agreguen más ayudas al usuario en las distintas vistas.

        ],
        'pedidosDeUnaFranja': [
        
        ],
		'cargarMaterias': [

        ],
        'reservasAnteriores': [

        ],
		'cancelarPedido': [

        ],
        'cancelarReserva': [

        ],
        'confirmarContraoferta': [

        ],
        'asistencia': [

        ],
        'agregarTerminal': [

        ],
        'modificarTerminal': [

        ]
    };
    var explicacionesDeEstaVista = [];
    var mostrar = false;

    var cosasDeUnaVista = {
        inicializar: function(usuarioRecibido, explicacionesRecibidas, mostrarAyuda){
            usuario = usuarioRecibido;
            explicacionesDeEstaVista = explicacionesRecibidas;
            mostrar = mostrarAyuda;
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
            if(mostrar.mostrar){
                var cantidadDeExplicaciones = explicacionesDeEstaVista.length;
                margen['margin-top'] = (margenMinimo + margenPorCadaExplicacion * cantidadDeExplicaciones).toString() + 'px';
                altura['height'] = (alturaMinima + margenPorCadaExplicacion * cantidadDeExplicaciones).toString() + 'px';
            } else {
                this.sinAyudas();
            }

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