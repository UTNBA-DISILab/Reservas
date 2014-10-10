(function() {
    var app = angular.module('reservasAnteriores', []);
    app.directive('reservasAnteriores',function(){
    	return{restrict: 'E',templateUrl: 'templates/reservasAnteriores.html'};
    });
})();