angular.module('reservasApp').service('comunicadorEntreVistasService',function(){

    var evento = {};
    var dia = {};
    var usuario = {};
	var materia = '';
	var especialidad = {};

    var cosasDeUnaVista = {

        setEvento: function(unEvento){
            evento = unEvento;
        },
        getEvento: function () {
            return evento;
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
		setMateria: function(unaMateria){
            materia = unaMateria;
        },
        getMateria: function(){
            return materia;
        },
		setEspecialidad: function(unaEspecialidad){
            especialidad = unaEspecialidad;
        },
        getEspecialidad: function(){
            return especialidad;
        }
    };

    return cosasDeUnaVista;
})