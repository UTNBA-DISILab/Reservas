angular.module('reservasApp').service('comunicadorConServidorService',function($http){

	/* ***** TEMP - esto es solo para las reservas hardcodeadas que hay que borrar ***** */
	var hoy = new Date();
	hoy = {anio: hoy.getFullYear(), mes: ('0' + (hoy.getMonth()+1)).slice(-2), dia: ('0' + hoy.getDate()).slice(-2)};
    
	var maniana = new Date(); maniana.setDate(maniana.getDate() + 1);
    maniana = {anio: maniana.getFullYear(), mes: ('0' + (maniana.getMonth()+1)).slice(-2), dia: ('0' + maniana.getDate()).slice(-2)};
	
	var pasadoManiana = new Date(); pasadoManiana.setDate(pasadoManiana.getDate() + 2);
	pasadoManiana = {anio: pasadoManiana.getFullYear(), mes: ('0' + (pasadoManiana.getMonth()+1)).slice(-2), dia: ('0' + pasadoManiana.getDate()).slice(-2)};
	/* ***** */
	
	
	// Pendiente: pensar un nombre para el sistema ej:"reservas" pero que no se llame igual que uno de nuestros recursos HTTP.
	// (porque sino puede quedar blah.edu.ar/reservas/reservas/bleh y no queda bien)
	// Para hacer pruebas, acá y sólo acá es donde hay que poner la IP del servidor
	var url = 'sistemas.frba.utn.edu.ar/disilab';
	// Nosotros NO vamos a tener un index.html porque el index es el de la página de sistemas que ya existe.
	// Nuestra página principal será otra, ej disilab.html
	// Y el favicon también es el que ya existe en la pag de sistemas, el nuestro hay que sacarlo.

	//var obtener = {
	return {
		obtenerLaboratorios: function(){
			
			var laboratorios;
			var laboratoriosMock;
			
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
			laboratoriosMock = [{nombre:"Azul", sede:"Medrano", cant_puestos:"24", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i5"},
						{nombre:"Rojo", sede:"Medrano", cant_puestos:"20", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i7"},
						{nombre:"Verde", sede:"Medrano", cant_puestos:"12", sis_op:"Windows 7 Enterprise", memoria:"10x4GB y 2x2GB", otros:"10xIntel Core i7 y 2xIntel Core i3"},
						{nombre:"Amarillo", sede:"Medrano", cant_puestos:"5", sis_op:"Windows 7 Enterprise", memoria:"2 GB", otros:"Intel Core i3"},
						{nombre:"Multimedia", sede:"Medrano", cant_puestos:"5", sis_op:"Windows XP", memoria:"2 GB", otros:"Intel Core i3"},
						{nombre:"Campus", sede:"Campus", cant_puestos:"14", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"},
						{nombre:"Campus Lab II", sede:"Campus", cant_puestos:"4", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"}
					];
			
			return laboratoriosMock;
			//return laboratorios;
		},
		
		obtenerReservas: function(primerDiaSolicitado, cantDiasSolicitados){
			
			var reservas;
			var reservasMock;
			
			$http.get( url + '/reservas/' + primerDiaSolicitado.getFullYear() + '/' + ('0' + (primerDiaSolicitado.getMonth()+1)).slice(-2) + '/' + ('0' + primerDiaSolicitado.getDate()).slice(-2) + '?cant_dias=' + cantDiasSolicitados)
				.success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					reservas = data;
					
					console.log('Obtenidas las reservas entre ' + primerDiaSolicitado + ' y ' + (primerDiaSolicitado + cantDiasSolicitados - 1) + ' exitosamente');
					
					// cambiamos la representacion {anio: mes: dia:} por objetos Date
					reservas.forEach( function(reserva) {
					reserva.fecha = new Date(reserva.fecha.anio, reserva.fecha.mes - 1, reserva.fecha.dia);
					});
					
				})
				.error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('Se produjo un error al obtener las reservas en ' + primerDiaSolicitado + ' y en los ' + cantDiasSolicitados + ' dias siguientes' );
				});
			
			
			// estas son las hardcodeadas
			//Esto debería comunicarse con el servidor y traer reservas que al menos tengan lo de acá abajo
			//No importa el tipo de usuario y tampoco la sesión.
			reservasMock = [
		        {laboratorio: 'Azul',
		        docente: {nombre:'Juan', legajo: '5555555'},
		        fecha: hoy,
		        horario: {de: 900, a: 1080}}, // de 15 a 18
		        {laboratorio: 'Azul',
		        docente: {nombre:'Pedro', legajo: '3333333'},
		        fecha: hoy,
		        horario: {de: 1140, a: 1260}}, // de 19 a 21
		        {laboratorio: 'Azul',
		        docente: {nombre:'Ignacio', legajo: '4444444'},
		        fecha: maniana,
		        horario: {de: 1140, a: 1260}}, // de 19 a 21
		        {laboratorio: 'Azul',
		        docente: {nombre:'Juan', legajo: '4444444'},
		        fecha: pasadoManiana,
		        horario: {de: 780, a: 1140}} // de 13 a 19
    		];
			
			// cambiamos la representacion {anio: mes: dia:} por objetos Date
			reservasMock.forEach( function(reserva) {
				reserva.fecha = new Date(reserva.fecha.anio, reserva.fecha.mes - 1, reserva.fecha.dia);
			});
			
			/* ***** TEMP esto ya no sirve; el servidor va a devolver solo las de los dias solicitados ***** */
			/*
			var fecha = new Date(); fecha.setDate(fecha.getDate() + cantDiasSolicitados);
    		
			reservasMock = reservasMock.filter(function(reserva){
				return Math.floor((fecha - reserva.fecha)/(24*3600*1000)) > 0;});
			*/
			/* ***** */

			return reservasMock;
			//return reservas;
		},

		// TEMP Pendiente: unificar con obtenerReservas, usando el estado de la reserva. Si es 'confirmada' es reserva, si no es pedido.
		obtenerPedidosSegun: function (cantDiasSolicitados, usuario) {
			var pedidos = [];

			if(usuario.inicioSesion){
				//El servidor debe traer los pedidos de reservas aún no confirmados, conteniendo al menos lo que dice ahí abajo.
				//Acá es importante el tipo de usuario: Si es Docente, traerá sólo las reservas del docente.
				//Si es encargado, traerá todas las reservas.

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
				
				// cambiamos la representacion {anio: mes: dia:} por objetos Date
				pedidosDeJuan.forEach( function(pedido) {
				pedido.fecha = new Date(pedido.fecha.anio, pedido.fecha.mes - 1, pedido.fecha.dia);
				});
	
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
				
				// cambiamos la representacion {anio: mes: dia:} por objetos Date
				pedidosDeTodos.forEach( function(pedido) {
				pedido.fecha = new Date(pedido.fecha.anio, pedido.fecha.mes - 1, pedido.fecha.dia);
				});

			    pedidos = usuario.esEncargado ? pedidosDeTodos : pedidosDeJuan;

			    /* ***** TEMP esto ya no sirve; el servidor va a devolver solo las de los dias solicitados ***** */
				/*
				var fecha = new Date(); fecha.setDate(fecha.getDate() + cantDiasSolicitados);
			    pedidos = pedidos.filter(function(pedido){
			    	return Math.floor((fecha - pedido.fecha)/(24*3600*1000)) > 0;});
				*/
				/* ***** */
			}
		    
		    return pedidos;
		},

		obtenerCursosDelDocente: function(cantDiasSolicitados, usuario){
			//El server debe traernos las materias que dicta el docente.
			//Y en caso de haberse logueado un encargado, devolver un array vacío
			materiasDeJuan = [
				{nombre: 'Álgebra y Geometría Analítica',
				codigoDeMateria: '088888',
				codigoDeCurso: 'K1111',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Lunes',
					horario: {de: 840, a: 1080}}, // de 14 a 18
					{diaDeLaSemana: 'Viernes',
					horario: {de: 840, a: 1080}} // de 14 a 18
				]},
				{nombre: 'Análisis Matemático I',
				codigoDeMateria: '087777',
				codigoDeCurso: 'K0000',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Miércoles',
					horario: {de: 840, a: 1080}}, // de 14 a 18
					{diaDeLaSemana: 'Viernes',
					horario: {de: 480, a: 720}} // de 8 a 12
				]},
				{nombre: 'Física II',
				codigoDeMateria: '089999',
				codigoDeCurso: 'K2222',
				cantidadDeAlumnos: 32,
				dias: [
					{diaDeLaSemana: 'Martes',
					horario: {de: 1140, a: 1380}}, // de 19 a 23
					{diaDeLaSemana: 'Sábado',
					horario: {de: 540, a: 720}} // de 9 a 12
				]},
			]
		}
	}

	//return obtener;
})