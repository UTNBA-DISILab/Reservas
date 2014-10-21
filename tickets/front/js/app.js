var reservasApp = angular.module('reservasApp', ['ui.router','ngAnimate', 'ui-rangeSlider']);

reservasApp.controller('confirmarCtrl',function(){});
reservasApp.controller('reservasAnterioresCtrl',function(){});
reservasApp.controller('pedidosDeUnDiaCtrl',function(){});

reservasApp.directive('encabezado',function(){
    return{restrict: 'E',templateUrl: 'templates/encabezado.html'};
});

reservasApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('reservas', {
        url: '/',
        templateUrl: 'templates/reservas.html',
        controller: 'planillaCtrl'
    })
    .state('nuevaReserva', {
        url: '/nuevaReserva',
        templateUrl: 'templates/nuevaReserva.html',
        controller: 'nuevaReservaCtrl'
    })
    .state('cancelarReserva', {
        url: '/cancelarReserva',
        templateUrl: 'templates/cancelarReserva.html',
        controller: 'cancelarReservaCtrl'
    })
    .state('reservasAnteriores', {
        url: '/reservasAnteriores',
        templateUrl: 'templates/reservasAnteriores.html',
        controller: 'reservasAnterioresCtrl'
    });

    // Si no es ninguno de los anteriores, ir a:
    $urlRouterProvider.otherwise('/');
}]);