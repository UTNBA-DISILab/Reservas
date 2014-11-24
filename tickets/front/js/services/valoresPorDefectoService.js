angular.module('reservasApp').service('valoresPorDefectoService',function(){

    diasMostradosIniciales = 7;
	cuantosDiasMas = 7;
    horaDeApertura = 540; // 540 minutos desde las 00:00 = las 9 de la maniana
    horaDeCierre = 1320; // 1320 minutos desde las 00:00 = las 10 de la noche (22 hs)
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

    //En cuanto se pruebe contra el servidor, el valor por defecto será una lista vacía.
    var reservas = [
        /*
		{
            laboratorio: 'Azul',
            docente: {id: 31, nombre: "Juan"},
            fecha: hoy,
            horario: {de: 900, a: 1080}
        }, // de 15 a 18
        {
            laboratorio: 'Azul',
            docente: {id: 32, nombre:"Pedro"},
            fecha: hoy,
            horario: {de: 1140, a: 1260}
        }, // de 19 a 21
        {
            laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"},
            fecha: maniana,
            horario: {de: 1140, a: 1260}
        }, // de 19 a 21
        {
            laboratorio: 'Azul',
            docente: {id: 31, nombre: "Juan"},
            fecha: pasadoManiana,
            horario: {de: 780, a: 1140}
        } // de 13 a 19
		*/
		
		{
            id: 250,
			teacher_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			fecha: hoy,
            horario: {de: 900, a: 1080}, // de 15 a 18
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'confirmada'
        },
        {
            id: 257,
			teacher_id: 31,
			creation_date: 1415806603991,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			fecha: hoy,
            horario: {de: 1080, a: 1140}, // de 15 a 18
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'confirmada'
        },
		{
            id: 251,
			teacher_id: 32,
			creation_date: 1415806604200,
			subject: 'Operativos',
			laboratorio: 'Azul',
            docente: {id: 32, nombre:"Pedro"}, // TEMP
			fecha: hoy,
            horario: {de: 1140, a: 1260}, // de 19 a 21
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'confirmada'
        },
		{
            id: 252,
			teacher_id: 33,
			creation_date: 1415806605321,
			subject: 'Operativos',
			laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"}, // TEMP
			fecha: maniana,
            horario: {de: 1140, a: 1260}, // de 19 a 21
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'confirmada'
        },
		{
            id: 253,
			teacher_id: 31,
			creation_date: 1415806607640,
			subject: 'Operativos',
			laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"}, // TEMP
			fecha: pasadoManiana,
            horario: {de: 780, a: 1140}, // de 13 a 19
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'confirmada'
        }
    ];

    //En cuanto se pruebe contra el servidor, habrá una única lista de pedidos por defecto, que estará vacía.
    var pedidosDeJuan = [
        /*
		{
			laboratorio: 'Azul',
			docente: {id: 31, nombre:"Juan"},
			fecha: maniana,
			horario: {de: 720, a: 1080}
		}, // de 12 a 18
        {
			laboratorio: 'Azul',
			docente: {id: 31, nombre:"Juan"},
			fecha: pasadoManiana,
			horario: {de: 1200, a: 1320}
		} // de 20 a 22
		*/
		
		{
            id: 254,
			teacher_id: 31,
			creation_date: 1415806615432,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			fecha: maniana,
            horario: {de: 720, a: 1080}, // de 12 a 18
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'solicitada'
        },
		{
            id: 255,
			teacher_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			fecha: pasadoManiana,
            horario: {de: 1200, a: 1320}, // de 20 a 22
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'solicitada'
        }
		
    ];
    var pedidosDeTodos = [
        /*
		{
			laboratorio: 'Azul',
			docente: {id: 31, nombre:"Juan"},
			fecha: maniana,
			horario: {de: 720, a: 1080}
		}, // de 12 a 18
        {
			laboratorio: 'Azul',
			docente: {id: 31, nombre:"Juan"},
			fecha: pasadoManiana,
			horario: {de: 1200, a: 1320}
		}, // de 20 a 22
        {
			laboratorio: 'Azul',
			docente: {id: 32, nombre:"Pedro"},
			fecha: maniana,
			horario: {de: 900, a: 1140}
		}, // de 15 a 19
        {
			laboratorio: 'Azul',
			docente: {id: 33, nombre:"Ignacio"},
			fecha: pasadoManiana,
			horario: {de: 1140, a: 1260} // de 19 a 21
		}
		*/
		
		{
            id: 254,
			teacher_id: 31,
			creation_date: 1415806615432,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			fecha: maniana,
            horario: {de: 720, a: 1080}, // de 12 a 18
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'solicitada'
        },
		{
            id: 255,
			teacher_id: 31,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 31, nombre:"Juan"}, // TEMP
			fecha: pasadoManiana,
            horario: {de: 1200, a: 1320}, // de 20 a 22
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'solicitada'
        },
		{
            id: 256,
			teacher_id: 32,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 32, nombre:"Pedro"}, // TEMP
			fecha: maniana,
            horario: {de: 900, a: 1140}, // de 15 a 19
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
			state: 'solicitada'
        },
		{
            id: 257,
			teacher_id: 33,
			creation_date: 1415806615908,
			subject: 'Simulacion',
			laboratorio: 'Azul',
            docente: {id: 33, nombre:"Ignacio"}, // TEMP
			fecha: pasadoManiana,
            horario: {de: 1140, a: 1260}, // de 19 a 21
            // por ahora from y to se generan a partir de esos (despues fecha y horario son los que se van a calcular en base a from y to)
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