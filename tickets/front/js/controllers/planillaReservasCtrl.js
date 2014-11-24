angular.module('reservasApp').controller('planillaReservasCtrl',function($scope, $state, $location, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){

    $scope.$on('$viewContentLoaded', function(){
        $location.replace(); //Limpia el historial de ruta
    });

    var pedidos = [];
    var sePudieronTraerPedidosEstaVuelta = false;
    var pedidosAuxiliares = [];
	
	var reservas = [];
	var sePudieronTraerReservasEstaVuelta = false;
	
	$scope.laboratorios = [];
	var sePudieronTraerLaboratorios = false;
	
	$scope.docentes = [];
	var sePudieronTraerDocentes = false;
	
	var nombresDeLaboratorios = [];
	
	$scope.especialidades = [];
	var sePudieronTraerMaterias = false;

    var comunicador = comunicadorEntreVistasService;
    $scope.usuario = comunicador.getUsuario();
	$scope.especialidad = comunicador.getEspecialidad();
	
	$scope.actualizarEspecialidad = function() {
		comunicador.setEspecialidad($scope.especialidad);
	};
	
	$scope.materia = "";
	$scope.actualizarMateria = function() {
		comunicador.setMateria($scope.materia);
	};

    var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	var primerDiaSolicitado = new Date();

	var servidor = comunicadorConServidorService;

	var porDefecto = valoresPorDefectoService;
    var diasSolicitados = porDefecto.getDiasMostradosIniciales();
	var cuantosDiasMasCargar = porDefecto.getCuantosDiasMas();
    var horaDeApertura = porDefecto.getHoraDeApertura();
    var horaDeCierre = porDefecto.getHoraDeCierre();
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos

    $scope.diaDeLaSemana = function(numeroDeDia){
    	var nombreDelDia;
	    switch (numeroDeDia) {
	        case 0: nombreDelDia = "Domingo"; break;
	        case 1: nombreDelDia = "Lunes"; break;
	        case 2: nombreDelDia = "Martes"; break;
	        case 3: nombreDelDia = "Miércoles"; break;
	        case 4: nombreDelDia = "Jueves"; break;
	        case 5: nombreDelDia = "Viernes"; break;
	        case 6: nombreDelDia = "Sábado"; break;
    	}
    	return nombreDelDia;
    }

    $scope.nombreDelMes = function(numeroDeMes){
    	var nombreDelMes;
	    switch (numeroDeMes) {
	        case 0: nombreDelMes = "Enero"; break;
	        case 1: nombreDelMes = "Febrero"; break;
	        case 2: nombreDelMes = "Marzo"; break;
	        case 3: nombreDelMes = "Abril"; break;
	        case 4: nombreDelMes = "Mayo"; break;
	        case 5: nombreDelMes = "Junio"; break;
	        case 6: nombreDelMes = "Julio"; break;
	        case 7: nombreDelMes = "Agost"; break;
	        case 8: nombreDelMes = "Septiembre"; break;
	        case 9: nombreDelMes = "Octubre"; break;
	        case 10: nombreDelMes = "Noviembre"; break;
	        case 11: nombreDelMes = "Diciembre"; break;
    	}
    	return nombreDelMes;
    }

    var elHorarioDelPrimeroEsAnterior = function(franja1, franja2){return franja1.horario.de - franja2.horario.de;}

    var esElMismoDia = function(unDia, otroDia){
		return (unDia.getDate() == otroDia.getDate() 
        && unDia.getMonth() == otroDia.getMonth()
        && unDia.getFullYear() == otroDia.getFullYear());
	};

	$scope.agregarTimestamps = function(reserva) {
		reserva.from = reserva.fecha.getTime() - ( reserva.fecha.getTime() % (1000 * 60 * 60 * 24) ) + reserva.horario.de * 60 * 1000;
		reserva.to = reserva.fecha.getTime() - ( reserva.fecha.getTime() % (1000 * 60 * 60 * 24) ) + reserva.horario.a * 60 * 1000;
	}
	
	$scope.agregarFechaYHorario = function(reserva) {
		reserva.fecha = new Date(reserva.from);
		reserva.horario.de = ( reserva.from % (24*60*60*1000) ) / (1000 * 60);
		reserva.horario.a = ( reserva.to % (24*60*60*1000) ) / (1000 * 60);
	}
	
	var completarEspaciosLibres = function() {
		//Generamos días libres para rellenar los espacios vacíos:
		var diasLibresParaRrellenarEspaciosVacios = generarPosiblesDiasLibres();
		diasLibresParaRrellenarEspaciosVacios.forEach(function(libre) {
			libre.tipo = 'libre';
			meterEnElCalendario(libre);
		});
		unificarPedidos();
	};
	
	var meterEnElCalendario = function(eventoCompleto){

        var laboratorio = $scope.laboratorios.filter(
			function(unLaboratorio) {
				return unLaboratorio.nombre == eventoCompleto.laboratorio
			}
		)[0];

        var dia = laboratorio.dias.filter(function(unDia){
            //return Math.floor(unDia.fecha.getTime() / (1000 * 3600 * 24)) == Math.floor(eventoCompleto.fecha.getTime() / (1000 * 3600 * 24))
			return esElMismoDia(unDia.fecha, eventoCompleto.fecha);
        })[0];

        var franjaNuevo = {horario: {de: eventoCompleto.horario.de, a: eventoCompleto.horario.a}, eventos: [eventoCompleto]};

        var insertadoCompletamenteODesechado = false;
        
        while(!insertadoCompletamenteODesechado){
            if(franjaNuevo.horario.de >= franjaNuevo.eventos[0].horario.a){
                    insertadoCompletamenteODesechado = true;
                }
            else {
                var franjaSuperpuestoAlPrincipio = dia.franjas.filter(function(franja){
                	return franja.horario.de <= franjaNuevo.horario.de && franja.horario.a > franjaNuevo.horario.de})[0];
                if(franjaSuperpuestoAlPrincipio){//El comienzo del franjaNuevo será después de que el otro termine.
                    franjaNuevo.horario.de = franjaSuperpuestoAlPrincipio.horario.a;
                } else {
                    var franjaSuperpuestoMasAdelante = dia.franjas.filter(function(franja){
                            return franja.horario.de > franjaNuevo.horario.de && franja.horario.de < franjaNuevo.horario.a
                        }).sort(elHorarioDelPrimeroEsAnterior)[0];
                    if(franjaSuperpuestoMasAdelante){//Se deberá partir el franjaNuevo en dos: Uno antes de la superposición y otro después.
                        var franjaNuevoCortado = {horario: {de: franjaNuevo.horario.de, a: franjaSuperpuestoMasAdelante.horario.de}, eventos: [franjaNuevo.eventos[0]]};

                        dia.franjas.push(franjaNuevoCortado);
                        dia.franjas = dia.franjas.sort(elHorarioDelPrimeroEsAnterior);
        
                        franjaNuevo.horario.de = franjaSuperpuestoMasAdelante.horario.a;
                    } else {
                        dia.franjas.push(franjaNuevo);
                        dia.franjas = dia.franjas.sort(elHorarioDelPrimeroEsAnterior);
                        insertadoCompletamenteODesechado = true;
                    }
                }
            }
        }
    };

    var unificarPedidos = function(){
    	//Se unifican los pedidos en una misma franja horaria con un array de todos ellos, debido a que  éstos pueden superponerse.
    	//En principio también se unificaban las reservas, pero es más claro que estén diferenciadas.
    	$scope.laboratorios.forEach(function(laboratorio){
    		laboratorio.dias.forEach(function(dia){
    			for(numeroDeFranja = 0; numeroDeFranja < dia.franjas.length - 1; numeroDeFranja++){
	                if(dia.franjas[numeroDeFranja].eventos[0].tipo == "pedido" && dia.franjas[numeroDeFranja + 1].eventos[0].tipo == "pedido"){
	                	dia.franjas[numeroDeFranja].eventos = dia.franjas[numeroDeFranja].eventos.concat(dia.franjas[numeroDeFranja + 1].eventos);
	                	dia.franjas[numeroDeFranja].horario.a = dia.franjas[numeroDeFranja + 1].horario.a;
	                	dia.franjas.splice(numeroDeFranja + 1, 1);
	                	numeroDeFranja--;
	                }
            	}
    		})
    	});
    };
    
    var generarPosiblesDiasLibres = function(){
        var diasLibres = [];
        var horario = {de: horaDeApertura, a: horaDeCierre};
        nombresDeLaboratorios.forEach(function(nombreDeLaboratorio){
            for(numeroDeDia = 0; numeroDeDia < diasSolicitados; numeroDeDia++){
                var fecha = new Date();
				//var fecha = primerDiaSolicitado;
                fecha.setDate(fecha.getDate() + numeroDeDia);
                diasLibres.push({laboratorio: nombreDeLaboratorio, fecha: fecha, horario: horario});
            }
        })
        return diasLibres;
    };
	
	$scope.obtenerLaboratorios = function() {
		
		var comportamientoSiRequestExitoso = function(laboratoriosRecibidos) {
			
			$scope.laboratorios.splice(0,$scope.laboratorios.length); // Acá sí va esto, porque en este caso el server devuelve siempre lo mismo y no quiero tener labs repetidos.
			laboratoriosRecibidos.forEach(function(laboratorio){
				$scope.laboratorios.push(laboratorio);
				nombresDeLaboratorios.push(laboratorio.nombre);
			});
			sePudieronTraerLaboratorios = true;
			//if(transaccionFinalizada()){
				$scope.insertarDatos(); // deberia 'insertar' solo los laboratorios
			//}
		};
		
		servidor.obtenerLaboratorios()
		.success(function(laboratoriosRecibidos, status, headers, config) {
			// Esta devolución se llamará asincrónicamente cuando la respuesta esté disponible.
			console.log('Obtenidos los laboratorios exitosamente');
			comportamientoSiRequestExitoso(laboratoriosRecibidos);
		})
		.error(function(laboratoriosRecibidos, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			console.log('Se produjo un error al obtener los laboratorios del servidor');
			//algoTuvoUnError = true; -> Esto va descomentado cuando probemos con el server.

			// TEMP
			comportamientoSiRequestExitoso(porDefecto.getLaboratorios());
		});
		
	};
	
	$scope.obtenerDocentes = function() {
		
		var comportamientoSiRequestExitoso = function(docentesRecibidos) {
			
			$scope.docentes.splice(0,$scope.docentes.length); // Acá sí va esto, porque en este caso el server devuelve siempre lo mismo y no quiero tener docentes repetidos.
			docentesRecibidos.forEach(function(docente){
				$scope.docentes.push(docente);
			});
			sePudieronTraerDocentes = true;
		};
		
		servidor.obtenerDocentes()
		.success(function(docentesRecibidos, status, headers, config) {
			console.log('Obtenidos los docentes exitosamente');
			comportamientoSiRequestExitoso(docentesRecibidos);
		})
		.error(function(docentesRecibidos, status, headers, config) {
			console.log('Se produjo un error al obtener los docentes del servidor');

			// TEMP
			comportamientoSiRequestExitoso(porDefecto.getDocentes());
		});
		
	};
	
	$scope.obtenerReservas = function() {
		
		var comportamientoSiRequestExitoso = function(reservasRecibidas) {
			
			//reservas.splice(0,reservas.length); Por qué? cuando pida las de febrero, no quiero que se vayan del calendario las de maniana que ya tenia.
			reservasRecibidas.forEach(function(reserva) {
				reservas.push(reserva)
			});
			sePudieronTraerReservasEstaVuelta = true;
			if(sePudieronTraerPedidosEstaVuelta) {
				$scope.insertarDatos(); // deberia 'insertar' solo las reservas, no se si las recien obtenidas o todas
			}
			
		};
		
		servidor.obtenerReservas(primerDiaSolicitado, cuantosDiasMasCargar)
		.success(function(reservasRecibidas, status, headers, config) {
			console.log('Obtenidas las reservas en ' + primerDiaSolicitado + ' y en los ' + (cuantosDiasMasCargar - 1) + ' d\xEDas siguientes exitosamente');
			comportamientoSiRequestExitoso(reservasRecibidas);
		})
		.error(function(reservasRecibidas, status, headers, config) {
			console.log('Se produjo un error al obtener las reservas en ' + primerDiaSolicitado + ' y en los ' + (cuantosDiasMasCargar - 1) + ' d\xEDas siguientes' );

			// TEMP
			comportamientoSiRequestExitoso(porDefecto.getReservas());
		});
		
	};
	
	$scope.obtenerPedidos = function() {
		
		var comportamientoSiRequestExitoso = function(pedidosRecibidos) {
			
			//pedidos.splice(0,pedidos.length); //Por qué? cuando pida los de febrero, no quiero que se vayan del calendario los de maniana que ya tenia.
			pedidosRecibidos.forEach(function(pedido) {
				pedidos.push(pedido)
			});
			sePudieronTraerPedidosEstaVuelta = true;
			if(sePudieronTraerReservasEstaVuelta) {
				$scope.insertarDatos(); // deberia 'insertar' solo los pedidos, no se si los recien obtenidos o todos
			}
			
		};
		
		// el parametro usuario no se usa; el usuario logueado se obtiene de la cookie.
		//Pero mientras tanto:
		if($scope.usuario.inicioSesion) {
			servidor.obtenerPedidos(primerDiaSolicitado, cuantosDiasMasCargar)
			.success(function(pedidosRecibidos, status, headers, config) {
				console.log('Obtenidas los pedidos en ' + primerDiaSolicitado + ' y en los ' + (cuantosDiasMasCargar - 1) + ' d\xEDas siguientes exitosamente');
				comportamientoSiRequestExitoso(pedidosRecibidos);
			})
			.error(function(pedidosRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los pedidos en ' + primerDiaSolicitado + ' y en los ' + (cuantosDiasMasCargar - 1) + ' d\xEDas siguientes' );
	
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getPedidos($scope.usuario));
			});
		}
		else {
			sePudieronTraerPedidosEstaVuelta = true;
			if(sePudieronTraerReservasEstaVuelta) {
				$scope.insertarDatos(); // deberia 'insertar' solo los pedidos, no se si los recien obtenidos o todos
			}
		}
		
	};

    $scope.actualizarPlanilla = function (){
		
		if(!sePudieronTraerLaboratorios) {
			$scope.obtenerLaboratorios();
		};
		
		if(!sePudieronTraerDocentes && $scope.usuario.esEncargado) {
			$scope.obtenerDocentes();
		};
		
		sePudieronTraerReservasEstaVuelta = false;
		$scope.obtenerReservas();
		
		sePudieronTraerPedidosEstaVuelta = false;
		$scope.obtenerPedidos();
		
		if(!sePudieronTraerMaterias) {
			$scope.obtenerMaterias();
		};
    };

    $scope.insertarDatos = function(){
    	//alert('insertando datos');
		//Crea los días para la columna de fechas
        $scope.dias = [];
        for(numeroDeDia = 0; numeroDeDia < diasSolicitados; numeroDeDia++){
                var fecha = new Date();
				//var fecha = primerDiaSolicitado;
                fecha.setDate(fecha.getDate() + numeroDeDia);
                $scope.dias.push({fecha: fecha});
            }

        //Agrega los días sin nada dentro de la columna de cada laboratorio.
        $scope.laboratorios.forEach(function(laboratorio){
			laboratorio.dias = [];
			for(numeroDeDia = 0; numeroDeDia < diasSolicitados; numeroDeDia++){
                var fecha = new Date();
				//var fecha = primerDiaSolicitado;
                fecha.setDate(fecha.getDate() + numeroDeDia);
				laboratorio.dias.push({fecha: fecha, franjas: []});
            }
        });

        // por si otras partes del sistema no manejan timestamps
		pedidos.forEach( function(pedido) {
			//$scope.agregarFechaYHorario(pedido); Descomentar esto cuando recibamos en el formato correcto
			
			pedido.tipo = 'pedido';
			meterEnElCalendario(pedido);
		});

        // por si otras partes del sistema no manejan timestamps
		reservas.forEach(function(reserva) {
			//$scope.agregarFechaYHorario(reserva); Descomentar esto cuando recibamos en el formato correcto
			
			reserva.tipo = 'reserva';
			meterEnElCalendario(reserva);
		});

		completarEspaciosLibres();
    };


    $scope.estiloSegun = function(franjaAnterior, franja, franjaPosterior){
        
    	if(franja.eventos[0].tipo == 'pedido'){
            color = '#CD853F';
        };

        if(franja.eventos[0].tipo == 'libre'){
            color = '#F5F5F5';
        };

        if(franja.eventos[0].tipo == 'reserva'){
            if($scope.usuario.inicioSesion && (franja.eventos[0].docente.nombre == $scope.usuario.nombre || franja.eventos[0].docente.nombre == $scope.$parent.usuario.docenteElegido)){
            	color = '#8B4513';
            } else {
            	color = '#888888';
            }
        };

        //Faltan horarios inutilizados: Lo que ya haya transcurrido del día de hoy, y lo de fines de semana.

        var altura = 100*(franja.horario.a - franja.horario.de)/(horaDeCierre - horaDeApertura);

        return {'height': altura.toString() + '%', 'background-color': color}
    }

    $scope.mostrarLaFranja = function(franja){
    	//Cada franja tiene varios eventos, todos del mismo tipo.
        if($scope.usuario.inicioSesion){
            if(franja.eventos[0].tipo == 'reserva' && ($scope.usuario.esEncargado || franja.eventos[0].docente.nombre == $scope.usuario.nombre)){
                comunicador.setEventos(franja.eventos);
                $state.go('cancelarPedidoOReserva');
            }
			else {
			
				if(franja.eventos[0].tipo == 'pedido'){
					if($scope.usuario.esEncargado) {
						comunicador.setEventos(franja.eventos);
						$state.go('pedidosDeUnaFranja');
					}
					else {
						if(franja.eventos[0].docente.nombre == $scope.usuario.nombre) {
							comunicador.setEventos(franja.eventos);
							$state.go('cancelarPedidoOReserva');
						}
					}
				}
				else {
					if(franja.eventos[0].tipo == 'libre'){
						if($scope.materia) {
							franja.eventos[0].subject = $scope.materia;
							comunicador.setEventos(franja.eventos);
							$state.go('pedidoDeReserva');
						}
						else {
							alert('Antes de reservar debe especificar su materia.');
						}
					}
					else {
						alert('Inhabilitado');
					}
				}
			}
                
        }
        else {
            if(franja.eventos[0].tipo == 'reserva'){
				alert('Reservado para la materia: ' + franja.eventos[0].subject);
            }
            else {
                if(franja.eventos[0].tipo == 'libre'){
                    alert('Libre, a\xFAn no se asign\xF3 a ning\xFAn docente' + '\nSi desea hacer una reserva, inicie sesi\xF3n.');
                }
                else {
                    alert('Inhabilitado');
                }
            }
        }
        
    };
	
	$scope.obtenerMaterias = function() {
		servidor.obtenerMaterias()
		.success(function(materiasObtenidas, status, headers, config) {
			
			$scope.especialidades = materiasObtenidas;
			console.log('Obtenidas las materias y especialidades exitosamente!');
			sePudieronTraerMaterias = true;
		})
		.error(function(data, status, headers, config) {
			
			console.log('Se produjo un error al obtener las materias del servidor.');
			
			// TEMP
			$scope.especialidades = porDefecto.getEspecialidades();
			sePudieronTraerMaterias = true;
		});
	};
	
	$scope.seConocenLasMateriasDe = function(especialidad) {
		if (especialidad.nombre == 'Sistemas') {
			return true;
		}
		return false;
	}
	
	$scope.cargarMasDias = function() {
		primerDiaSolicitado.setDate(primerDiaSolicitado.getDate() + cuantosDiasMasCargar);
		diasSolicitados =  diasSolicitados + cuantosDiasMasCargar;
		$scope.actualizarPlanilla();
	}
	
	$scope.$watch('usuario.inicioSesion',function(){
		//Cada vez que el usuario se loguea o se desloguea, se actualiza la planilla.
		pedidos = [];
		$scope.actualizarPlanilla();
	});
	$scope.$watch('$parent.usuario.docenteElegido',function(){
		console.log("Actualizo Docente");

	});
});