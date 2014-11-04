angular.module('reservasApp').service('comunicadorConServidorService',function($http){

	var hoy = new Date();
    var maniana = new Date(); maniana.setDate(maniana.getDate() + 1);
    var pasadoManiana = new Date(); pasadoManiana.setDate(pasadoManiana.getDate() + 2);
	
	var url = 'sistemas.frba.utn.edu.ar/disilab';

	//var obtener = {
	return {
		obtenerLaboratorios: function(){
			
			var laboratorios;
			
			$http.get( url + '/labs')
				.success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					laboratorios = data;
					console.log('Obtenidos los laboratorios exitosamente');
				})
				.error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('Se produjo un error al obtener los laboratorios');
				});
			
			
			// Por ahora se asume que el request falla
			laboratorios = [{nombre:"Azul", sede:"Medrano", cant_puestos:"24", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i5"},
						{nombre:"Rojo", sede:"Medrano", cant_puestos:"20", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i7"},
						{nombre:"Verde", sede:"Medrano", cant_puestos:"12", sis_op:"Windows 7 Enterprise", memoria:"10x4GB y 2x2GB", otros:"10xIntel Core i7 y 2xIntel Core i3"},
						{nombre:"Amarillo", sede:"Medrano", cant_puestos:"5", sis_op:"Windows 7 Enterprise", memoria:"2 GB", otros:"Intel Core i3"},
						{nombre:"Multimedia", sede:"Medrano", cant_puestos:"5", sis_op:"Windows XP", memoria:"2 GB", otros:"Intel Core i3"},
						{nombre:"Campus", sede:"Campus", cant_puestos:"14", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"},
						{nombre:"Campus Lab II", sede:"Campus", cant_puestos:"4", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"}
					];
			
			return laboratorios;
		},
		
		obtenerReservas: function(diasSolicitados){
			//Esto debería comunicarse con el servidor y traer reservas que al menos tengan lo de acá abajo
			//No importa el tipo de usuario y tampoco la sesión.
			var reservas = [
		        {laboratorio: 'Azul',
		        docente: {nombre:'Juan', legajo: '5555555'},
		        fecha: hoy,
		        horario: {de: 15, a: 18}},
		        {laboratorio: 'Azul',
		        docente: {nombre:'Pedro', legajo: '3333333'},
		        fecha: hoy,
		        horario: {de: 19, a: 21}},
		        {laboratorio: 'Azul',
		        docente: {nombre:'Ignacio', legajo: '4444444'},
		        fecha: maniana,
		        horario: {de: 19, a: 21}},
		        {laboratorio: 'Azul',
		        docente: {nombre:'Juan', legajo: '4444444'},
		        fecha: pasadoManiana,
		        horario: {de: 13, a: 19}}
    		];

    		var fecha = new Date(); fecha.setDate(fecha.getDate() + diasSolicitados);
    		
			reservas = reservas.filter(function(reserva){
				return Math.floor((fecha - reserva.fecha)/(24*3600*1000)) > 0;});

			return reservas;
		},

		obtenerPedidosSegun: function (diasSolicitados, usuario) {
			var pedidos = [];

			if(usuario.inicioSesion){
				//El servidor debe traer los pedidos de reservas aún no confirmados, conteniendo al menos lo que dice ahí abajo.
				//Acá es importante el tipo de usuario: Si es Docente, traerá sólo las reservas del docente.
				//Si es encargado, traerá todas las reservas.

				var pedidosDeJuan = [
			        {laboratorio: 'Azul',
			        docente: {nombre:'Juan', legajo: '4444444'},
			        fecha: maniana,
			        horario: {de: 12, a: 18}},
			        {laboratorio: 'Azul',
			        docente: {nombre:'Juan', legajo: '4444444'},
			        fecha: pasadoManiana,
			        horario: {de: 20, a: 22}}
		        ];
	
			    var pedidosDeTodos = [
			        {laboratorio: 'Azul',
			        docente: {nombre:'Juan', legajo: '4444444'},
			        fecha: maniana,
			        horario: {de: 12, a: 18}},
			        {laboratorio: 'Azul',
			        docente: {nombre:'Juan', legajo: '4444444'},
			        fecha: pasadoManiana,
			        horario: {de: 20, a: 22}},
			        {laboratorio: 'Azul',
			        docente: {nombre:'Pedro', legajo: '4444444'},
			        fecha: maniana,
			        horario: {de: 15, a: 19}},
			        {laboratorio: 'Azul',
			        docente: {nombre:'Ignacio', legajo: '4444444'},
			        fecha: pasadoManiana,
			        horario: {de: 19, a: 21}}
			    ];

			    pedidos = usuario.esEncargado ? pedidosDeTodos : pedidosDeJuan;

			    var fecha = new Date(); fecha.setDate(fecha.getDate() + diasSolicitados);
			    pedidos = pedidos.filter(function(pedido){
			    	return Math.floor((fecha - pedido.fecha)/(24*3600*1000)) > 0;});
			}
		    
		    return pedidos;
		},

		obtenerCursosDelDocente: function(diasSolicitados, usuario){
			//El server debe traernos las materias que dicta el docente.
			//Y en caso de haberse logueado un encargado, devolver un array vacío
			materiasDeJuan = [
				{nombre: 'Álgebra y Geometría Analítica',
				codigoDeMateria: '088888',
				codigoDeCurso: 'K1111',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Lunes',
					horario: {de: 14, a: 18}},
					{diaDeLaSemana: 'Viernes',
					horario: {de: 14, a: 18}}
				]},
				{nombre: 'Análisis Matemático I',
				codigoDeMateria: '087777',
				codigoDeCurso: 'K0000',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Miércoles',
					horario: {de: 14, a: 18}},
					{diaDeLaSemana: 'Viernes',
					horario: {de: 8, a: 12}}
				]},
				{nombre: 'Física II',
				codigoDeMateria: '089999',
				codigoDeCurso: 'K2222',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Martes',
					horario: {de: 19, a: 23}},
					{diaDeLaSemana: 'Sábado',
					horario: {de: 9, a: 12}}
				]},
			]
		}
	}

	//return obtener;
})