(function() {
    var app = angular.module('solicitarReservas', []);
    app.directive('solicitarReservas',function(){
    	return{restrict: 'E',templateUrl: 'templates/solicitarReservas.html'};
    });
})();