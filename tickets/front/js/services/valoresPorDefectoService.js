angular.module('reservasApp').service('valoresPorDefectoService',function(){

    diasMostradosIniciales = 20; // Hace que la persona tarde más hasta llegar al final y evita errores al refrescar la página.
	cuantosDiasMas = 7;
    horaDeApertura = new Date();
    horaDeApertura.setHours(8,30,0,0);
    horaDeCierre = new Date();
    horaDeCierre.setHours(22,0,0,0);
    horaDeAperturaSabados = new Date();
    horaDeAperturaSabados.setHours(8,30,0,0);
    horaDeCierreSabados = new Date();
    horaDeCierreSabados.setHours(18,0,0,0);
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos

    tiempoDeRecarga = 10000;//Milisegundos

    var primerDia = new Date();
    var diasHastaPrimerLunes = primerDia.getDay() > 1 ? 8 - primerDia.getDay() : 1 - primerDia.getDay();

    var primerDia = new Date(); primerDia.setDate(primerDia.getDate() + diasHastaPrimerLunes);
    //primerDia = {anio: primerDia.getFullYear(), mes: ('0' + (primerDia.getMonth()+1)).slice(-2), dia: ('0' + primerDia.getDate()).slice(-2)};
    var segundoDia = new Date(); segundoDia.setDate(segundoDia.getDate() + diasHastaPrimerLunes + 1);
    //segundoDia = {anio: segundoDia.getFullYear(), mes: ('0' + (segundoDia.getMonth()+1)).slice(-2), dia: ('0' + segundoDia.getDate()).slice(-2)};
    var tercerDia = new Date(); tercerDia.setDate(tercerDia.getDate() + diasHastaPrimerLunes + 2);
    //tercerDia = {anio: tercerDia.getFullYear(), mes: ('0' + (tercerDia.getMonth()+1)).slice(-2), dia: ('0' + tercerDia.getDate()).slice(-2)};

    /*
	var laboratorios = [
        {nombre:"Azul", sede:"Medrano", cant_puestos:"24", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i5"},
        {nombre:"Rojo", sede:"Medrano", cant_puestos:"20", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i7"},
        {nombre:"Verde", sede:"Medrano", cant_puestos:"12", sis_op:"Windows 7 Enterprise", memoria:"10x4GB y 2x2GB", otros:"10xIntel Core i7 y 2xIntel Core i3"},
        {nombre:"Amarillo", sede:"Medrano", cant_puestos:"5", sis_op:"Windows 7 Enterprise", memoria:"2 GB", otros:"Intel Core i3"},
        {nombre:"Multimedia", sede:"Medrano", cant_puestos:"5", sis_op:"Windows XP", memoria:"2 GB", otros:"Intel Core i3"},
        {nombre:"Campus", sede:"Campus", cant_puestos:"14", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"},
        {nombre:"Campus Lab II", sede:"Campus", cant_puestos:"4", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"}
    ];
	*/
	
	var laboratorios = [
        {id: 2, nombre:"Azul", sede:"Medrano", cant_puestos:"24", equipamiento:"Windows 7 Enterprise, 4GB, Intel Core i5"},
        {id: 3, nombre:"Rojo", sede:"Medrano", cant_puestos:"20", equipamiento:"Windows 7 Enterprise, 4GB, Intel Core i7"},
        {id: 4, nombre:"Verde", sede:"Medrano", cant_puestos:"12", equipamiento:"Windows 7 Enterprise, 10x4GB y 2x2GB, 10xIntel Core i7 y 2xIntel Core i3"},
        {id: 5, nombre:"Amarillo", sede:"Medrano", cant_puestos:"5", equipamiento:"Windows 7 Enterprise, 2GB, Intel Core i3"},
        {id: 6, nombre:"Multimedia", sede:"Medrano", cant_puestos:"5", equipamiento:"Windows XP, 2GB, Intel Core i3"},
        {id: 7, nombre:"Campus", sede:"Campus", cant_puestos:"14", equipamiento:"Windows 7 Enterprise, 4GB, Intel Core i3"},
        {id: 8, nombre:"Campus Lab II", sede:"Campus", cant_puestos:"4", equipamiento:"Windows 7 Enterprise, 4GB, Intel Core i3"}
    ];
	
	var docentes = [
		{id: 31, nombre:"Juan"},
		{id: 32, nombre:"Pedro"},
		{id: 33, nombre:"Ignacio"}
	];

	//Todo esto es para tener un set de pruebas. El servidor nos enviará un timestamp, lo convertimos a Date y listo.
	var primerDiaALas15 = new Date(); primerDiaALas15.setDate(primerDiaALas15.getDate() + diasHastaPrimerLunes + 1);
	primerDiaALas15.setHours(15,0,0,0);//Horas, minutos, segundos, milisegundos
	var primerDiaALas18 = new Date(); primerDiaALas18.setDate(primerDiaALas18.getDate() + diasHastaPrimerLunes + 1);
	primerDiaALas18.setHours(18,0,0,0);
	var primerDiaALas19 = new Date(); primerDiaALas19.setDate(primerDiaALas19.getDate() + diasHastaPrimerLunes + 1);
	primerDiaALas19.setHours(19,0,0,0);
	var primerDiaALas21 = new Date(); primerDiaALas21.setDate(primerDiaALas21.getDate() + diasHastaPrimerLunes + 1);
	primerDiaALas21.setHours(21,0,0,0);
	var segundoDiaALas12 = new Date(); segundoDiaALas12.setDate(segundoDiaALas12.getDate() + diasHastaPrimerLunes + 1);
	segundoDiaALas12.setHours(12,0,0,0);
	var segundoDiaALas15 = new Date(); segundoDiaALas15.setDate(segundoDiaALas15.getDate() + diasHastaPrimerLunes + 1);
	segundoDiaALas15.setHours(15,0,0,0);
	var segundoDiaALas18 = new Date(); segundoDiaALas18.setDate(segundoDiaALas18.getDate() + diasHastaPrimerLunes + 1);
	segundoDiaALas18.setHours(18,0,0,0);
	var segundoDiaALas19 = new Date(); segundoDiaALas19.setDate(segundoDiaALas19.getDate() + diasHastaPrimerLunes + 1);
	segundoDiaALas19.setHours(19,0,0,0);
	var segundoDiaALas21 = new Date(); segundoDiaALas21.setDate(segundoDiaALas21.getDate() + diasHastaPrimerLunes + 1);
	segundoDiaALas21.setHours(21,0,0,0);
	var tercerDiaALas13 = new Date(); tercerDiaALas13.setDate(tercerDiaALas13.getDate() + diasHastaPrimerLunes + 2);
	tercerDiaALas13.setHours(13,0,0,0);
	var tercerDiaALas19 = new Date(); tercerDiaALas19.setDate(tercerDiaALas19.getDate() + diasHastaPrimerLunes + 2);
	tercerDiaALas19.setHours(19,0,0,0);
	var tercerDiaALas20 = new Date(); tercerDiaALas20.setDate(tercerDiaALas20.getDate() + diasHastaPrimerLunes + 2);
	tercerDiaALas20.setHours(20,0,0,0);
	var tercerDiaALas21 = new Date(); tercerDiaALas21.setDate(tercerDiaALas21.getDate() + diasHastaPrimerLunes + 2);
	tercerDiaALas21.setHours(21,0,0,0);
	var tercerDiaALas22 = new Date(); tercerDiaALas22.setDate(tercerDiaALas22.getDate() + diasHastaPrimerLunes + 2);
	tercerDiaALas22.setHours(22,0,0,0);


    //En cuanto se pruebe contra el servidor, el valor por defecto será una lista vacía.
    var reservas = [		
		{
            id: 250,
			owner_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
            begin: primerDiaALas15,
			end: primerDiaALas18,
            state: 3
        },
        {
            id: 257,
			owner_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: primerDiaALas18,
			end: primerDiaALas19,
            state: 3
        },
		{
            id: 251,
			owner_id: 32,
			creation_date: 1415806604200,
			subject: 'Operativos',
			lab_id: 2,
            // docente: {id: 32, nombre:"Pedro"}, // TEMP
			begin: primerDiaALas19,
			end: primerDiaALas21,
            state: 3
        },
		{
            id: 252,
			owner_id: 33,
			creation_date: 1415806605321,
			subject: 'Operativos',
			lab_id: 2,
            // docente: {id: 33, nombre:"Ignacio"}, // TEMP
			begin: segundoDiaALas19,
			end: segundoDiaALas21,
            state: 3
        },
		{
            id: 253,
			owner_id: 33,
			creation_date: 1415806607640,
			subject: 'Operativos',
			lab_id: 2,
            // docente: {id: 33, nombre:"Ignacio"}, // TEMP
			begin: tercerDiaALas13,
			end: tercerDiaALas19,
            state: 3
        }
    ];

    //En cuanto se pruebe contra el servidor, habrá una única lista de pedidos por defecto, que estará vacía.
    var pedidosDeJuan = [
		{
            id: 254,
			owner_id: 31,
			creation_date: 1415806615432,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: segundoDiaALas12,
			end: segundoDiaALas18,
            state: 1
        },
		{
            id: 255,
			owner_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: tercerDiaALas20,
			end: tercerDiaALas22,
            state: 1
        }
		
    ];
    var pedidosDeTodos = [
		{
            id: 254,
			owner_id: 31,
			creation_date: 1415806615432,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: segundoDiaALas12,
			end: segundoDiaALas18,
            state: 1
        },
		{
            id: 255,
			owner_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: tercerDiaALas20,
			end: tercerDiaALas22,
            state: 1
        },
		{
            id: 256,
			owner_id: 32,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 32, nombre:"Pedro"}, // TEMP
			begin: segundoDiaALas15,
			end: segundoDiaALas19,
            state: 1
        },
		{
            id: 257,
			owner_id: 33,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 33, nombre:"Ignacio"}, // TEMP
			begin: tercerDiaALas19,
			end: tercerDiaALas21,
            state: 1
        }
		
    ];
	
	var especialidades = [
		{
			nombre: "Homog\xE9neas",
			materias: []
		},
		{
			nombre: "Civil",
			materias: []
		},
		{
			nombre: "El\xE9ctrica",
			materias: []
		},
		{
			nombre: "Electr\xF3nica",
			materias: []
		},
		{
			nombre: "Industrial",
			materias: []
		},
		{
			nombre: "Mec\xE1nica",
			materias: []
		},
		{
			nombre: "Naval",
			materias: []
		},
		{
			nombre: "Qu\xEDmica",
			materias: []
		},
		{
			nombre: "Sistemas",
			materias: ['Redes','Simulacion','Operativos']
		},
		{
			nombre: "Textil",
			materias: []
		},
		{
			nombre: "Otra no especificada",
			materias: []
		}
	
	];

    var valoresPorDefecto = {
        getLaboratorios: function(){
            return laboratorios;
        },
		getDocentes: function(){
            return docentes;
        },
        getReservas: function(){
            return reservas;
        },
        getPedidosDeJuan: function(){
            return pedidosDeJuan;
        },
        getPedidosDeTodos: function(){
            return pedidosDeTodos;
        },
		getPedidos: function(usuario) {
			return usuario.esEncargado ? pedidosDeTodos : pedidosDeJuan;
		},
        getDiasMostradosIniciales: function(){
            return diasMostradosIniciales;
        },
		getCuantosDiasMas: function() {
			return cuantosDiasMas;
		},
        getHoraDeApertura: function(){
            return horaDeApertura;
        },
        getHoraDeCierre: function(){
            return horaDeCierre;
        },
        getHoraDeAperturaSabados: function(){
            return horaDeAperturaSabados;
        },
        getHoraDeCierreSabados: function(){
            return horaDeCierreSabados;
        },
		getEspecialidades: function(){
			return especialidades;
		},
		getTiempoDeRecarga: function(){
			return tiempoDeRecarga;
		},
		getOperacionDeSesion: function(idDeOperacion){
			switch (idDeOperacion){
				case 0: //ToDo
				break
				case 1:
				break
				default:
			}
		}
    };
    return valoresPorDefecto;
})