var reservasApp = angular.module('reservasApp', ['ui.router','ngAnimate', 'ui-rangeSlider', 'ngModal']);

reservasApp.controller('confirmarCtrl',function(){});

//reservasApp.controller('pedidosDeUnDiaCtrl',function(){});

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
    .state('cancelarReserva', {
        url: '/cancelarReserva',
        templateUrl: 'templates/cancelarReserva.html',
        controller: 'cancelarReservaCtrl'
    })
    .state('reservasAnteriores', {
        url: '/reservasAnteriores',
        templateUrl: 'templates/reservasAnteriores.html',
        controller: 'reservasAnterioresCtrl'
    })
	.state('pedidosDeUnDia', {
        url: '/pedidosDeUnDia',
        templateUrl: 'templates/pedidosDeUnDia.html',
        controller: 'pedidosDeUnDiaCtrl'
    });

    // Si no es ninguno de los anteriores, ir a:
    $urlRouterProvider.otherwise('/');
}]);