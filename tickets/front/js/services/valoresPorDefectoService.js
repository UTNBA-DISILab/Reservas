angular.module('reservasApp').service('valoresPorDefectoService',function(){

    diasParaVerLaPlanilla = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    diasMostradosIniciales = 3;
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

    //En cuanto se pruebe contra el servidor, el valor por defecto será una lista vacía.
    var reservas = [
        {
            laboratorio: 'Azul',
            docente: {nombre:'Juan', legajo: '5555555'},
            fecha: hoy,
            horario: {de: 900, a: 1080}
        }, // de 15 a 18
        {
            laboratorio: 'Azul',
            docente: {nombre:'Pedro', legajo: '3333333'},
            fecha: hoy,
            horario: {de: 1140, a: 1260}
        }, // de 19 a 21
        {
            laboratorio: 'Azul',
            docente: {nombre:'Ignacio', legajo: '4444444'},
            fecha: maniana,
            horario: {de: 1140, a: 1260}
        }, // de 19 a 21
        {
            laboratorio: 'Azul',
            docente: {nombre:'Juan', legajo: '4444444'},
            fecha: pasadoManiana,
            horario: {de: 780, a: 1140}
        } // de 13 a 19
    ];

    //En cuanto se pruebe contra el servidor, habrá una única lista de pedidos por defecto, que estará vacía.
    var pedidosDeJuan = [
        {laboratorio: 'Azul',
        docente: {nombre:'Juan', legajo: '4444444'},
        fecha: maniana,
        horario: {de: 720, a: 1080}}, // de 12 a 18
        {laboratorio: 'Azul',
        docente: {nombre:'Juan', legajo: '4444444'},
        fecha: pasadoManiana,
        horario: {de: 1200, a: 1320}} // de 20 a 22
    ];
    var pedidosDeTodos = [
        {laboratorio: 'Azul',
        docente: {nombre:'Juan', legajo: '4444444'},
        fecha: maniana,
        horario: {de: 720, a: 1080}}, // de 12 a 18
        {laboratorio: 'Azul',
        docente: {nombre:'Juan', legajo: '4444444'},
        fecha: pasadoManiana,
        horario: {de: 1200, a: 1320}}, // de 20 a 22
        {laboratorio: 'Azul',
        docente: {nombre:'Pedro', legajo: '4444444'},
        fecha: maniana,
        horario: {de: 900, a: 1140}}, // de 15 a 19
        {laboratorio: 'Azul',
        docente: {nombre:'Ignacio', legajo: '4444444'},
        fecha: pasadoManiana,
        horario: {de: 1140, a: 1260}} // de 19 a 21
    ];

    var valoresPorDefecto = {
        getLaboratorios: function(){
            return laboratorios;
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
        getDiasParaVerLaPlanilla: function(){
            return diasParaVerLaPlanilla;
        },
        getDiasMostradosIniciales: function(){
            return diasMostradosIniciales;
        },
        getHoraDeApertura: function(){
            return horaDeApertura;
        },
        getHoraDeCierre: function(){
            return horaDeCierre;
        }
    };
    return valoresPorDefecto;
})