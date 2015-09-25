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

    //Colores
    var reservadoAlDocente='#088A08';
    var pedidoPorMasDeUnDocente='#EEAF30';
    var inhabilitado='#DF0101';
    var libre='#FFFFFF';
    var reservadoPorUnDocente='#DF0101';
    var contraoferta='#04B4AE';
    var pedidosAunNoAceptados='#D7DF01';



    var explicaciones = {
        'planillaReservas': [
            
            //Ayuda mostrada solo al Encargado
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Turno disponible.', color: libre},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Turno no disponible.', color: inhabilitado},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Turno reservado a nombre del docente seleccionado.', color: reservadoAlDocente},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Pedidos de reserva pendientes a nombre de un docente seleccionado.', color: pedidosAunNoAceptados},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Pedidos de reserva contraofertados', color: contraoferta},
            {debeHaberIniciadoSesion: true, esParaEncargado: true, texto: 'Pedidos de reserva por uno o m\xE1s docentes.', color: pedidoPorMasDeUnDocente},

            
            //Ayuda mostrada solo al Docente
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Turno disponible.', color: libre},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Turno no disponible.', color: inhabilitado},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Turno reservado a mi nombre.', color: reservadoAlDocente},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Mis pedidos de reserva a\xFAn no confirmados por el encargado.', color: pedidosAunNoAceptados},
            {debeHaberIniciadoSesion: true, esParaEncargado: false, texto: 'Mis pedidos de reserva contraofertados por el encargado.', color: contraoferta},

            //Ayuda mostrada solo al invitado (sin iniciar sesión)
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Turno disponible.', color: libre},
            {debeHaberIniciadoSesion: false, esParaEncargado: false, texto: 'Turno no disponible.', color: inhabilitado}
            
            
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