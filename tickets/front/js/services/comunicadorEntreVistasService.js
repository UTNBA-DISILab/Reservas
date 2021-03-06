angular.module('reservasApp').service('comunicadorEntreVistasService',function($cookies){

    var eventos = [];
    var dia = {};
	var materia = '';
	var especialidad = {};
    var usuario = angular.fromJson($cookies.usuario);
    if (!(typeof usuario === 'undefined') && usuario.id && usuario.inicioSesion) {
        // usuario ya tiene los datos bien
    }
    else {
        usuario = {};
    };
    
	var laboratorios = [];
	var docentes = [];
	var materias = [];
    var planillaCalendario = {};

    var terminal = {};

    var cosasDeUnaVista = {

        setEventos: function(unosEventos){
            // Insertar sin duplicados:
            eventos = [];
            unosEventos.forEach(function(evento){
                if(eventos.indexOf(evento)  == -1) {
                    eventos.push(evento);
                }
            });
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
            $cookies.usuario = angular.toJson(usuario);
        },
        getUsuario: function(){
            return usuario;
        },
        deleteUsuario: function(){
            delete $cookies.usuario;
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
        },
		setLaboratorios: function(unosLaboratorios){
            laboratorios = unosLaboratorios;
        },
        getLaboratorios: function(){
            return laboratorios;
        },
		setDocentes: function(unosDocentes){
            docentes = unosDocentes.filter(function(unDocente) {return unDocente.name != 'Todos'} );
        },
        getDocentes: function(){
            return docentes;
        },
        getDocenteById: function(id){
            return docentes.filter(function(unDocente) {return unDocente.id == id})[0].name
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
        },
        getCapacidadDelLab: function(id){
            return laboratorios.filter(function(unLaboratorio) {return unLaboratorio.id == id})[0].cant_puestos;
        },
        setPlanilla: function(planillaConCalendario){
            planillaCalendario = planillaConCalendario;
        },
        getPlanilla: function(){
            return planillaCalendario;
        },
        setTerminal: function(unaTerminal){
            terminal = unaTerminal;
        },
        getTerminal: function(){
            return terminal;
        }
    };

    return cosasDeUnaVista;
})