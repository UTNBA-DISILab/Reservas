(function() {
    var app = angular.module('reservasApp', ['ngRoute','menu','ngAnimate','solicitarReservas','cursosDelDocente','horariosOcupados','reservasAnteriores']);

    app.controller("SeccionParaMostrarCtrl", function(){
    	this.bienvenida = true;
    	this.solicitarReservas = false;
    	this.reservasAnteriores = false;
    	this.cerrarSesion = false;

    	this.seleccionarInicio = function(){
    		this.bienvenida = true;
	    	this.solicitarReservas = false;
	    	this.reservasAnteriores = false;
	    	this.cerrarSesion = false;
    	};
    	this.seleccionarSolicitarReservas = function(){
    		this.bienvenida = false;
	    	this.solicitarReservas = true;
	    	this.reservasAnteriores = false;
	    	this.cerrarSesion = false;
    	};
    	this.seleccionarReservasAnteriores = function(){
    		this.bienvenida = false;
	    	this.solicitarReservas = false;
	    	this.reservasAnteriores = true;
	    	this.cerrarSesion = false;
    	};
    	this.seleccionarCerrarSesion = function(){
    		this.bienvenida = false;
	    	this.solicitarReservas = false;
	    	this.reservasAnteriores = false;
	    	this.cerrarSesion = true;
    	};
	});
})();

