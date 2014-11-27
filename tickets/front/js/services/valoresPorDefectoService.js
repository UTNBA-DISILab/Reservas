angular.module('reservasApp').service('valoresPorDefectoService',function(){

    diasMostradosIniciales = 7;
	cuantosDiasMas = 7;
    horaDeApertura = new Date();
    horaDeApertura.setHours(9,0,0,0);
    // 540 minutos desde las 00:00 = las 9 de la mañana
    horaDeCierre = new Date();
    horaDeCierre.setHours(22,0,0,0);
     // 1320 minutos desde las 00:00 = las 10 de la noche (22 hs)
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos

    var hoy = new Date();
    //hoy = {anio: hoy.getFullYear(), mes: ('0' + (hoy.getMonth()+1)).slice(-2), dia: ('0' + hoy.getDate()).slice(-2)};
    var maniana = new Date(); maniana.setDate(maniana.getDate() + 1);
    //maniana = {anio: maniana.getFullYear(), mes: ('0' + (maniana.getMonth()+1)).slice(-2), dia: ('0' + maniana.getDate()).slice(-2)};
    var pasadoManiana = new Date(); pasadoManiana.setDate(pasadoManiana.getDate() + 2);
    //pasadoManiana = {anio: pasadoManiana.getFullYear(), mes: ('0' + (pasadoManiana.getMonth()+1)).slice(-2), dia: ('0' + pasadoManiana.getDate()).slice(-2)};

    var laboratorios = [
        {nombre:"Azul", sede:"Medrano", cant_puestos:"24", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i5"},
        {nombre:"Rojo", sede:"Medrano", cant_puestos:"20", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i7"},
        {nombre:"Verde", sede:"Medrano", cant_puestos:"12", sis_op:"Windows 7 Enterprise", memoria:"10x4GB y 2x2GB", otros:"10xIntel Core i7 y 2xIntel Core i3"},
        {nombre:"Amarillo", sede:"Medrano", cant_puestos:"5", sis_op:"Windows 7 Enterprise", memoria:"2 GB", otros:"Intel Core i3"},
        {nombre:"Multimedia", sede:"Medrano", cant_puestos:"5", sis_op:"Windows XP", memoria:"2 GB", otros:"Intel Core i3"},
        {nombre:"Campus", sede:"Campus", cant_puestos:"14", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"},
        {nombre:"Campus Lab II", sede:"Campus", cant_puestos:"4", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"}
    ];
	
	var docentes = [
		{id: 31, nombre:"Juan"},
		{id: 32, nombre:"Pedro"},
		{id: 33, nombre:"Ignacio"}
	];

	//Todo esto es para tener un set de pruebas. El servidor nos enviará un timestamp, lo convertimos a Date y listo.
	var hoyALas15 = new Date();
	hoyALas15.setHours(15,0,0,0);//Horas, minutos, segundos, milisegundos
	var hoyALas18 = new Date();
	hoyALas18.setHours(18,0,0,0);
	var hoyALas19 = new Date();
	hoyALas19.setHours(19,0,0,0);
	var hoyALas21 = new Date();
	hoyALas21.setHours(21,0,0,0);
	var manianaALas12 = new Date(); manianaALas12.setDate(manianaALas12.getDate() + 1);
	manianaALas12.setHours(12,0,0,0);
	var manianaALas15 = new Date(); manianaALas15.setDate(manianaALas15.getDate() + 1);
	manianaALas15.setHours(15,0,0,0);
	var manianaALas18 = new Date(); manianaALas18.setDate(manianaALas18.getDate() + 1);
	manianaALas18.setHours(18,0,0,0);
	var manianaALas19 = new Date(); manianaALas19.setDate(manianaALas19.getDate() + 1);
	manianaALas19.setHours(19,0,0,0);
	var manianaALas21 = new Date(); manianaALas21.setDate(manianaALas21.getDate() + 1);
	manianaALas21.setHours(21,0,0,0);
	var pasadoManianaALas13 = new Date(); pasadoManianaALas13.setDate(pasadoManianaALas13.getDate() + 2);
	pasadoManianaALas13.setHours(13,0,0,0);
	var pasadoManianaALas19 = new Date(); pasadoManianaALas19.setDate(pasadoManianaALas19.getDate() + 2);
	pasadoManianaALas19.setHours(19,0,0,0);
	var pasadoManianaALas20 = new Date(); pasadoManianaALas20.setDate(pasadoManianaALas20.getDate() + 2);
	pasadoManianaALas20.setHours(20,0,0,0);
	var pasadoManianaALas21 = new Date(); pasadoManianaALas21.setDate(pasadoManianaALas21.getDate() + 2);
	pasadoManianaALas21.setHours(21,0,0,0);
	var pasadoManianaALas22 = new Date(); pasadoManianaALas22.setDate(pasadoManianaALas22.getDate() + 2);
	pasadoManianaALas22.setHours(22,0,0,0);


    //En cuanto se pruebe contra el servidor, el valor por defecto será una lista vacía.
    var reservas = [		
		{
            id: 250,
			teacher_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
            desde: hoyALas15,
			hasta: hoyALas18,
            state: 'confirmada'
        },
        {
            id: 257,
			teacher_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			desde: hoyALas18,
			hasta: hoyALas19,
            state: 'confirmada'
        },
		{
            id: 251,
			teacher_id: 32,
			creation_date: 1415806604200,
			subject: 'Operativos',
			laboratorio: 'Azul',
            docente: {id: 32, nombre:"Pedro"}, // TEMP
			desde: hoyALas19,
			hasta: hoyALas21,
            state: 'confirmada'
        },
		{
            id: 252,
			teacher_id: 33,
			creation_date: 1415806605321,
			subject: 'Operativos',
			laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"}, // TEMP
			desde: manianaALas19,
			hasta: manianaALas21,
            state: 'confirmada'
        },
		{
            id: 253,
			teacher_id: 31,
			creation_date: 1415806607640,
			subject: 'Operativos',
			laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"}, // TEMP
			desde: pasadoManianaALas13,
			hasta: pasadoManianaALas19,
            state: 'confirmada'
        }
    ];

    //En cuanto se pruebe contra el servidor, habrá una única lista de pedidos por defecto, que estará vacía.
    var pedidosDeJuan = [
		{
            id: 254,
			teacher_id: 31,
			creation_date: 1415806615432,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			desde: manianaALas12,
			hasta: manianaALas18,
            state: 'solicitada'
        },
		{
            id: 255,
			teacher_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			desde: pasadoManianaALas20,
			hasta: pasadoManianaALas22,
            state: 'solicitada'
        }
		
    ];
    var pedidosDeTodos = [
		{
            id: 254,
			teacher_id: 31,
			creation_date: 1415806615432,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			desde: manianaALas12,
			hasta: manianaALas18,
            state: 'solicitada'
        },
		{
            id: 255,
			teacher_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			desde: pasadoManianaALas20,
			hasta: pasadoManianaALas22,
            state: 'solicitada'
        },
		{
            id: 256,
			teacher_id: 32,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 32, nombre:"Pedro"}, // TEMP
			desde: manianaALas15,
			hasta: manianaALas19,
            state: 'solicitada'
        },
		{
            id: 257,
			teacher_id: 33,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"}, // TEMP
			desde: pasadoManianaALas19,
			hasta: pasadoManianaALas21,
            state: 'solicitada'
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
		getEspecialidades: function(){
			return especialidades;
		}
    };
    return valoresPorDefecto;
})