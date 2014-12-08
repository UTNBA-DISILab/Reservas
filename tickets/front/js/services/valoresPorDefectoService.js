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
			owner_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
            begin: hoyALas15,
			end: hoyALas18,
            state: 3
        },
        {
            id: 257,
			owner_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: hoyALas18,
			end: hoyALas19,
            state: 3
        },
		{
            id: 251,
			owner_id: 32,
			creation_date: 1415806604200,
			subject: 'Operativos',
			lab_id: 2,
            // docente: {id: 32, nombre:"Pedro"}, // TEMP
			begin: hoyALas19,
			end: hoyALas21,
            state: 3
        },
		{
            id: 252,
			owner_id: 33,
			creation_date: 1415806605321,
			subject: 'Operativos',
			lab_id: 2,
            // docente: {id: 33, nombre:"Ignacio"}, // TEMP
			begin: manianaALas19,
			end: manianaALas21,
            state: 3
        },
		{
            id: 253,
			owner_id: 33,
			creation_date: 1415806607640,
			subject: 'Operativos',
			lab_id: 2,
            // docente: {id: 33, nombre:"Ignacio"}, // TEMP
			begin: pasadoManianaALas13,
			end: pasadoManianaALas19,
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
			begin: manianaALas12,
			end: manianaALas18,
            state: 1
        },
		{
            id: 255,
			owner_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: pasadoManianaALas20,
			end: pasadoManianaALas22,
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
			begin: manianaALas12,
			end: manianaALas18,
            state: 1
        },
		{
            id: 255,
			owner_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 31, nombre:"Juan"}, // TEMP
			begin: pasadoManianaALas20,
			end: pasadoManianaALas22,
            state: 1
        },
		{
            id: 256,
			owner_id: 32,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 32, nombre:"Pedro"}, // TEMP
			begin: manianaALas15,
			end: manianaALas19,
            state: 1
        },
		{
            id: 257,
			owner_id: 33,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			lab_id: 2,
            // docente: {id: 33, nombre:"Ignacio"}, // TEMP
			begin: pasadoManianaALas19,
			end: pasadoManianaALas21,
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
		getEspecialidades: function(){
			return especialidades;
		}
    };
    return valoresPorDefecto;
})