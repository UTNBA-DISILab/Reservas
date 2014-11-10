angular.module('reservasApp').controller('planillaReservasCtrl',function($scope, $state, $location, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService){

    $scope.$on('$viewContentLoaded', function(){
        $location.replace(); //Limpia el historial de ruta
    });

    var servidor = comunicadorConServidorService;
    var comunicador = comunicadorEntreVistasService;
    $scope.usuario = comunicador.getUsuario();
    var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	// Se obtiene la info de todos los laboratorios del servidor
	// solo si no se obtuvo antes
	if (!$scope.laboratorios) {

	servidor.obtenerLaboratorios()
		.success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			$scope.laboratorios = data;
			console.log('Obtenidos los laboratorios exitosamente');
			
			$scope.laboratorios.forEach(function(laboratorio){
				nombresDeLaboratorios.push(laboratorio.nombre);	
			});
			
		})
		.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('Se produjo un error al obtener los laboratorios');
			$scope.laboratorios = [
				{nombre:"Azul", sede:"Medrano", cant_puestos:"24", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i5"},
				{nombre:"Rojo", sede:"Medrano", cant_puestos:"20", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i7"},
				{nombre:"Verde", sede:"Medrano", cant_puestos:"12", sis_op:"Windows 7 Enterprise", memoria:"10x4GB y 2x2GB", otros:"10xIntel Core i7 y 2xIntel Core i3"},
				{nombre:"Amarillo", sede:"Medrano", cant_puestos:"5", sis_op:"Windows 7 Enterprise", memoria:"2 GB", otros:"Intel Core i3"},
				{nombre:"Multimedia", sede:"Medrano", cant_puestos:"5", sis_op:"Windows XP", memoria:"2 GB", otros:"Intel Core i3"},
				{nombre:"Campus", sede:"Campus", cant_puestos:"14", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"},
				{nombre:"Campus Lab II", sede:"Campus", cant_puestos:"4", sis_op:"Windows 7 Enterprise", memoria:"4 GB", otros:"Intel Core i3"}
			];
			
			$scope.laboratorios.forEach(function(laboratorio){
				nombresDeLaboratorios.push(laboratorio.nombre);	
			});
			
		});
	};

    //Esto quizá se podría poner en un servicio que se "configuraciónPorDefecto" por ejemplo.
    $scope.diasDesdeAhora = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    $scope.diasSolicitados = 3;
    $scope.horaDeApertura = 540; // 540 minutos desde las 00:00 = las 9 de la maniana
    $scope.horaDeCierre = 1320; // 1320 minutos desde las 00:00 = las 10 de la noche (22 hs)
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos
    //var nombresDeLaboratorios = ['Azul','Amarillo','Verde','Rojo','Workgroup'];
	var nombresDeLaboratorios = [];
	

    var elHorarioDelPrimeroEsAnterior = function(momento1, momento2){return momento1.horario.de - momento2.horario.de;}

    var esElMismoDia = function(unDia, otroDia){
		return (unDia.getDate() == otroDia.getDate() 
        && unDia.getMonth() == otroDia.getMonth()
        && unDia.getFullYear() == otroDia.getFullYear());
	};
	
	var completarEspaciosLibres = function() {
		//Generamos días libres para rellenar los espacios vacíos:
		alert('llenando dias libres');
		var diasLibresParaRrellenarEspaciosVacios = generarPosiblesDiasLibres();
		diasLibresParaRrellenarEspaciosVacios.forEach(function(libre) {
			libre.tipo = 'libre';
			meterEnElCalendario(libre);
		});
	}
	
	var meterEnElCalendario = function(eventoCompleto){

        var laboratorio = $scope.laboratorios.filter(function(unLaboratorio){return unLaboratorio.nombre == eventoCompleto.laboratorio})[0];

        var dia = laboratorio.dias.filter(function(unDia){
            //return Math.floor(unDia.fecha.getTime() / (1000 * 3600 * 24)) == Math.floor(eventoCompleto.fecha.getTime() / (1000 * 3600 * 24))
			return esElMismoDia(unDia.fecha, eventoCompleto.fecha);
        })[0];

        var momentoNuevo = {horario: {de: eventoCompleto.horario.de, a: eventoCompleto.horario.a}, evento: eventoCompleto};

        var insertadoCompletamenteODesechado = false;
        
        while(!insertadoCompletamenteODesechado){
            if(momentoNuevo.horario.de >= momentoNuevo.evento.horario.a){
                    insertadoCompletamenteODesechado = true;
                }
            else {
                var momentosSuperpuestosAlPrincipio = dia.momentos.filter(function(momento){
                    return momento.horario.de <= momentoNuevo.horario.de && momento.horario.a > momentoNuevo.horario.de});

                if(momentosSuperpuestosAlPrincipio.length){//El comienzo del momentoNuevo será después de que el otro termine.    
                    var momento = momentosSuperpuestosAlPrincipio[0];
                    momentoNuevo.horario.de = momento.horario.a;
                } else {
                    var momentosSuperpuestosMasAdelante = dia.momentos.filter(function(momento){
                            return momento.horario.de > momentoNuevo.horario.de && momento.horario.de < momentoNuevo.horario.a
                        }).sort(elHorarioDelPrimeroEsAnterior);
                    if(momentosSuperpuestosMasAdelante.length){//Se deberá partir el momentoNuevo en dos: Uno antes de la superposición y otro después.
                        var momento = momentosSuperpuestosMasAdelante[0];
                        var momentoNuevoCortado = {horario: {de: momentoNuevo.horario.de, a: momento.horario.de}, evento: momentoNuevo.evento};
        
                        dia.momentos.push(momentoNuevoCortado);
                        dia.momentos = dia.momentos.sort(elHorarioDelPrimeroEsAnterior);
        
                        momentoNuevo.horario.de = momento.horario.a;
                    } else {
                        dia.momentos.push(momentoNuevo);
                        dia.momentos = dia.momentos.sort(elHorarioDelPrimeroEsAnterior);
                        insertadoCompletamenteODesechado = true;
                    }
                }
            }
        }
    };
    
    var generarPosiblesDiasLibres = function(){
        var diasLibres = [];
        var horario = {de: $scope.horaDeApertura, a: $scope.horaDeCierre};
        nombresDeLaboratorios.forEach(function(nombreDeLaboratorio){
            for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
                diasLibres.push({laboratorio: nombreDeLaboratorio, fecha: fecha, horario: horario});
            }
        })
        return diasLibres;
    };

    $scope.actualizarPlanilla = function (){
		
		$scope.reservasActualizadas = false;
		$scope.pedidosActualizados = false;
		
        //Crea los días para la columna de fechas
        $scope.dias = [];
        for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
                $scope.dias.push({fecha: fecha});
            }

        //Agrega los dias sin nada dentro a los laboratorios.
        $scope.laboratorios.forEach(function(laboratorio){
            
			laboratorio.dias = [];
			
			for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
                
				laboratorio.dias.push({fecha: fecha, momentos: []});
            }
			
        });

        
        
		
		$scope.hoy = new Date();
		
		$scope.agregarTimestamps = function(reserva) {
			reserva.from = reserva.fecha.getTime() - ( reserva.fecha.getTime() % (1000 * 60 * 60 * 24) ) + reserva.horario.de * 60 * 1000;
			reserva.to = reserva.fecha.getTime() - ( reserva.fecha.getTime() % (1000 * 60 * 60 * 24) ) + reserva.horario.a * 60 * 1000;
		}
		
		$scope.agregarFechaYHorario = function(reserva) {
			reserva.fecha = new Date(reserva.from);
			reserva.horario.de = ( reserva.from % (24*60*60*1000) ) / (1000 * 60);
			reserva.horario.a = ( reserva.to % (24*60*60*1000) ) / (1000 * 60);
		}
		
		//El server nos traerá las reservas sin importar el tipo de usuario:
		servidor.obtenerReservas( $scope.hoy, $scope.diasSolicitados )
			.success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.reservas = data;
				
				console.log('Obtenidas las reservas en ' + $scope.hoy + ' y en los ' + $scope.diasSolicitados + ' dias siguientes exitosamente');
				
				$scope.reservasActualizadas = true;
				
				// por si otras partes del sistema no manejan timestamps
				$scope.reservas.forEach( function(reserva) {
					//reserva.fecha = new Date(reserva.fecha.anio, reserva.fecha.mes - 1, reserva.fecha.dia);
					$scope.agregarFechaYHorario(reserva);
					
					reserva.tipo = 'reserva';
					meterEnElCalendario(reserva);
				});
				
				// si ademas de las reservas, los pedidos tambien se obtuvieron con exito,
				if( $scope.pedidosActualizados ) {
					completarEspaciosLibres();
				};
				
				
			})
			.error(function(data, status, headers, config) {
			// ********* Todo esto es para mockear el servidor **********
			// No tiene que quedar NADA, desde aca, hasta (ver abajo)
				
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log('Se produjo un error al obtener las reservas en ' + $scope.hoy + ' y en los ' + $scope.diasSolicitados + ' dias siguientes' );
				
				
				var hoy = new Date();
				//hoy = {anio: hoy.getFullYear(), mes: ('0' + (hoy.getMonth()+1)).slice(-2), dia: ('0' + hoy.getDate()).slice(-2)};
    
				var maniana = new Date(); maniana.setDate(maniana.getDate() + 1);
				//maniana = {anio: maniana.getFullYear(), mes: ('0' + (maniana.getMonth()+1)).slice(-2), dia: ('0' + maniana.getDate()).slice(-2)};
	
				var pasadoManiana = new Date(); pasadoManiana.setDate(pasadoManiana.getDate() + 2);
				//pasadoManiana = {anio: pasadoManiana.getFullYear(), mes: ('0' + (pasadoManiana.getMonth()+1)).slice(-2), dia: ('0' + pasadoManiana.getDate()).slice(-2)};
				
				
				$scope.reservas = [
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
				
				
				$scope.reservas.forEach( function(reserva) {
					
					$scope.agregarTimestamps(reserva);
					$scope.agregarFechaYHorario(reserva);
					
					reserva.tipo = 'reserva';
					meterEnElCalendario(reserva);
				});
				
				$scope.reservasActualizadas = true;
				
				// si ademas de las reservas, los pedidos tambien se obtuvieron con exito,
				if( !$scope.usuario.inicioSesion || $scope.pedidosActualizados ) {
					completarEspaciosLibres();
				};
				
			// ****** Hasta acá *******
			});
		
		
		//El server debe traernos los pedidos según el nombre y tipo de usuario.
		//Si los datos de usuario y contraseña son erróneos, devuelve un array vacío.
		//$scope.pedidosDeReservas = servidor.obtenerPedidosSegun( $scope.hoy, $scope.diasSolicitados, $scope.usuario );
		
		if($scope.usuario.inicioSesion){
			servidor.obtenerPedidosSegun( $scope.hoy, $scope.diasSolicitados, $scope.usuario )
				.success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.pedidosDeReservas = data;
					
					console.log('Obtenidos los pedidos en ' + $scope.hoy + ' y en los ' + $scope.diasSolicitados + ' dias siguientes exitosamente');
					
					$scope.pedidosActualizados = true;
					
					// por si otras partes del sistema no manejan timestamps
					$scope.pedidosDeReservas.forEach( function(pedido) {
						$scope.agregarFechaYHorario(pedido);
						
						pedido.tipo = 'pedido';
						meterEnElCalendario(pedido);
					});
				
					// si ademas de los pedidos, las reservas tambien se obtuvieron con exito,
					if( $scope.reservasActualizadas ) {
						completarEspaciosLibres();
					};
				})
			
				.error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('Se produjo un error al obtener los pedidos en ' + $scope.hoy + ' y en los ' + $scope.diasSolicitados + ' dias siguientes' );
					
					//El server debe traernos los pedidos según el nombre y tipo de usuario.
					//Si los datos de usuario y contraseña son erróneos, devuelve un array vacío.
					
					var pedidos = [];
	
					
					//El servidor debe traer los pedidos de reservas aún no confirmados, conteniendo al menos lo que dice ahí abajo.
					//Acá es importante el tipo de usuario: Si es Docente, traerá sólo las reservas del docente.
					//Si es encargado, traerá todas las reservas.
		
					
					
					var hoy = new Date();
					//hoy = {anio: hoy.getFullYear(), mes: ('0' + (hoy.getMonth()+1)).slice(-2), dia: ('0' + hoy.getDate()).slice(-2)};
			
					var maniana = new Date(); maniana.setDate(maniana.getDate() + 1);
					//maniana = {anio: maniana.getFullYear(), mes: ('0' + (maniana.getMonth()+1)).slice(-2), dia: ('0' + maniana.getDate()).slice(-2)};
			
					var pasadoManiana = new Date(); pasadoManiana.setDate(pasadoManiana.getDate() + 2);
					//pasadoManiana = {anio: pasadoManiana.getFullYear(), mes: ('0' + (pasadoManiana.getMonth()+1)).slice(-2), dia: ('0' + pasadoManiana.getDate()).slice(-2)};
					
					
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
					
		
					pedidos = $scope.usuario.esEncargado ? pedidosDeTodos : pedidosDeJuan;
		
					pedidos.forEach(function(pedido) {
						$scope.agregarTimestamps(pedido);
						$scope.agregarFechaYHorario(pedido);
					
						pedido.tipo = 'pedido';
						meterEnElCalendario(pedido);
					});
					
					$scope.pedidosActualizados = true;
					
					
					// si ademas de los pedidos, las reservas tambien se obtuvieron con exito,
					if( $scope.reservasActualizadas ) {
						completarEspaciosLibres();
					};
					
					//Si se logueó un docente (o si el encargado le reserva algo en su nombre), trae sus materias. 
					//Si no, trae un array vacío.
					//$scope.cursos = servidor.obtenerCursosDelDocente(usuario);
					//var diasDeLaMateria = $scope.cursos.filter(function(curso){
					//    curso.codigoDeCurso: 'K1111'
					//});
				
					//Filtrar la materia que coincida, y generar los momentos con sus DÍAS (meter en cada día que el evento es la materia completa)
					//$scope.cursos.forEach(function(pedido){pedido.tipo = 'materia'; meterEnElCalendario(pedido);});
				
					//Obtenemos los horarios de la materia que el profesor eligió:
					
					
					
					
					
				
				
			});
		
        };
		
		
		// si ademas de los pedidos, las reservas tambien se obtuvieron con exito,
		if( $scope.reservasActualizadas ) {
			completarEspaciosLibres();
		};
		
		
    };


    $scope.estiloSegun = function(momentoAnterior, momento, momentoPosterior){
        
        if($scope.usuario.esEncargado){
            if (momento.evento.tipo == 'reserva'){color = '#800080';
            } else {
                if(momento.evento.tipo == 'pedido'){
                    color = '#ff00ff';
                } else {
                    color = '#e0ffff';}
            }
        } else {
            if (momento.evento.tipo == 'reserva'){
                if($scope.usuario.inicioSesion && momento.evento.docente.nombre == $scope.usuario.nombre) {
                    color = '#800080';
                } else {
                    color = '#888888';
                }
            } else {
                if(momento.evento.tipo == 'pedido'){
                    color = '#ff00ff'
                } else {
                    color = '#e0ffff';
                }
                //Falta libre y que coincida con mis horarios
            }
        }

        //Faltan horarios inutilizados: Lo que ya haya transcurrido del día de hoy, y lo de fines de semana.

        //Falta ver si tiene anterior o posterior del mismo tipo, para cambiar el redondeo de bordes

        //tamaño de la franja
        var altura = 100*(momento.horario.a - momento.horario.de)/($scope.horaDeCierre - $scope.horaDeApertura);

        return {'height': altura.toString() + '%', 'background-color': color}
    }

    $scope.mostrarElMomento = function(momento){
        if($scope.usuario.inicioSesion){
            if(momento.evento.tipo == 'reserva'){
                if($scope.usuario.esEncargado || momento.evento.docente.nombre == $scope.usuario.nombre){
                    comunicador.setEvento(momento.evento);
                    $state.go('cancelarReserva');
                }
                else {
                    alert('Reservado para la materia: (falta terminar, obviamente)' + momento.evento.nombreDeMateria);
                }
            }
            else {
                if(momento.evento.tipo == 'libre'){
                    $state.go('pedidoDeReserva');
                }
                else {
                    if(momento.evento.tipo == 'pedido'){
                        $state.go('pedidoDeReserva');
                    }
                    else {
                        alert('Inhabilitado');
                    }
                }
            }
                
        }
        else {
            if(momento.evento.tipo == 'reserva'){
                alert('Reservado para la materia: (falta terminar, obviamente)' + momento.evento.nombreDeMateria);
            }
            else {
                if(momento.evento.tipo == 'libre'){
                    alert('Libre, aún no se asignó a ningún docente' + '\nSi desea hacer una reserva, inicie sesión.');
                }
                else {
                    alert('Inhabilitado');
                }
            }
        }
        
    };
	$scope.$watch('usuario.inicioSesion',function(){
		//Cada vez que el usuario se loguea o se desloguea, se actualiza la planilla.
		$scope.actualizarPlanilla();
	});
});