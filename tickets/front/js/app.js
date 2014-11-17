var reservasApp = angular.module('reservasApp', ['ui.router','ngAnimate', 'ui-rangeSlider', 'ngModal', 'infinite-scroll']);

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
    .state('cancelarPedidoOReserva', {
        url: '/cancelarPedidoOReserva',
        templateUrl: 'templates/cancelarPedidoOReserva.html',
        controller: 'cancelarPedidoOReservaCtrl'
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
    });

    // Si no es ninguno de los anteriores, ir a:
    $urlRouterProvider.otherwise('/');
}]);