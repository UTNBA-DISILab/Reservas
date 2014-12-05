angular.module('reservasApp').service('comunicadorEntreVistasService',function(){

    var eventos = {};
    var dia = {};
    var usuario = {};
	var materia = '';
	var especialidad = {};
	
	var laboratorios ={};

    var cosasDeUnaVista = {

        setEventos: function(unosEventos){
            eventos = unosEventos;
        },
        getEventos: function () {
            return eventos;
        },
        setDia: function(unDia){
            dia = unDia;
        },
        getDia: function(){
            return dia;
        },
        setUsuario: function(unUsuario){
            usuario = unUsuario;
        },
        getUsuario: function(){
            return usuario;
        },
		setEspecialidad: function(unaEspecialidad){
            especialidad = unaEspecialidad;
        },
        getEspecialidad: function(){
            return especialidad;
        },
		setLaboratorios: function(unosLaboratorios){
            laboratorios = unosLaboratorios;
        },
        getLaboratorios: function(){
            return laboratorios;
        }
    };

    return cosasDeUnaVista;
})