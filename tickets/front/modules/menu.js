(function() {
    var app = angular.module('menu', []);
    
    app.directive('menuIzquierdo',function(){
    	return{restrict: 'E',templateUrl: 'templates/menuIzquierdo.html'};
    });
    app.directive('encabezado',function(){
    	return{restrict: 'E',templateUrl: 'templates/encabezado.html'};
    });
    app.directive('bienvenida',function(){
    	return{restrict: 'E',templateUrl: 'templates/bienvenida.html'};
    });
})();