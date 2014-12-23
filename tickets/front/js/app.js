var reservasApp = angular.module('reservasApp', ['ui.router','ngAnimate', 'ui-rangeSlider', 'ngModal', 'infinite-scroll','ngCookies']);

reservasApp.controller('confirmarCtrl',function(){});

reservasApp.directive('encabezado',function(){
    return{restrict: 'E',templateUrl: 'templates/encabezado.html'};
});

reservasApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('planillaReservas', {
        url: '/',
        templateUrl: 'templates/planillaReservas.html',
        controller: 'planillaReservasCtrl'
    })
    .state('pedidoDeReserva', {
        url: '/pedidoDeReserva',
        templateUrl: 'templates/pedidoDeReserva.html',
        controller: 'pedidoDeReservaCtrl'
    })
    .state('cancelarPedido', {
        url: '/cancelarPedido',
        templateUrl: 'templates/aceptarContraofertaOCancelarAlgunEvento.html',
        controller: 'aceptarContraofertaOCancelarAlgunEventoCtrl'
    })
    .state('cancelarReserva', {
        url: '/cancelarReserva',
        templateUrl: 'templates/aceptarContraofertaOCancelarAlgunEvento.html',
        controller: 'aceptarContraofertaOCancelarAlgunEventoCtrl'
    })
    .state('confirmarContraoferta', {
        url: '/confirmarContraoferta',
        templateUrl: 'templates/aceptarContraofertaOCancelarAlgunEvento.html',
        controller: 'aceptarContraofertaOCancelarAlgunEventoCtrl'
    })
    .state('reservasAnteriores', {
        url: '/reservasAnteriores',
        templateUrl: 'templates/reservasAnteriores.html',
        controller: 'reservasAnterioresCtrl'
    })
	.state('pedidosDeUnaFranja', {
        url: '/pedidosDeUnaFranjaHoraria',
        templateUrl: 'templates/pedidosDeUnaFranja.html',
        controller: 'pedidosDeUnaFranjaCtrl'
    })
	.state('cargarMaterias', {
        url: '/cargarMaterias',
        templateUrl: 'templates/cargarMaterias.html',
        controller: 'cargarMateriasCtrl'
    })
    .state('asistencia', {
        url: '/asistencia',
        templateUrl: 'templates/asistencia.html',
        controller: 'asistenciaCtrl'
    })
    .state('agregarTerminal', {
        url: '/agregarTerminal',
        templateUrl: 'templates/agregarOModificarTerminal.html',
        controller: 'agregarOModificarTerminalCtrl'
    })
    .state('modificarTerminal', {
        url: '/modificarTerminal',
        templateUrl: 'templates/agregarOModificarTerminal.html',
        controller: 'agregarOModificarTerminalCtrl'
    });

    // Si no es ninguno de los anteriores, ir a:
    $urlRouterProvider.otherwise('/');
}]);