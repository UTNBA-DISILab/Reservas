angular.module('reservasApp').service('comunicadorEntreVistasService',function(){

    var eventos = {};
    var dia = {};
    var usuario = {};
	var materia = '';
	var especialidad = {};
	
	var laboratorios = [];
	var docentes = [];
	var materias = {};

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
        },
		setDocentes: function(unosDocentes){
            docentes = unosDocentes.filter(function(unDocente) {return unDocente.nombre != 'Todos'} );
        },
        getDocentes: function(){
            return docentes;
        },
		setMaterias: function(unasMaterias){
            materias = unasMaterias;
        },
        getMaterias: function(){
            return materias;
        },
        getNombreDelLab: function(id){
            return laboratorios.filter(function(unLaboratorio) {return unLaboratorio.id == id})[0].nombre;
        },
        getIdDelLab: function(nombre){
            return laboratorios.filter(function(unLaboratorio) {return unLaboratorio.nombre == nombre})[0].id;
        }
    };

    return cosasDeUnaVista;
})