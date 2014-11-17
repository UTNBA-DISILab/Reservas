angular.module('reservasApp').controller('planillaReservasCtrl',function($scope, $state, $location, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){

    $scope.$on('$viewContentLoaded', function(){
        $location.replace(); //Limpia el historial de ruta
    });

    $scope.pedidos = [];
	$scope.sePudieronTraerPedidosEstaVuelta = false;
	
	$scope.reservas = [];
	$scope.sePudieronTraerReservasEstaVuelta = false;
	
	$scope.laboratorios = [];
	$scope.sePudieronTraerLaboratorios = false;
	
	$scope.docentes = [];
	$scope.sePudieronTraerDocentes = false;
	
	$scope.nombresDeLaboratorios = [];
	
	$scope.especialidades = [];
	$scope.sePudieronTraerMaterias = false;

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
	
	$scope.primerDiaSolicitado = new Date();

	var servidor = comunicadorConServidorService;

	var porDefecto = valoresPorDefectoService;
    $scope.diasSolicitados = porDefecto.getDiasMostradosIniciales();
	$scope.cuantosDiasMasCargar = porDefecto.getCuantosDiasMas();
    $scope.horaDeApertura = porDefecto.getHoraDeApertura();
    $scope.horaDeCierre = porDefecto.getHoraDeCierre();
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos

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
		unificarFranjas();
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

    var unificarFranjas = function(){
    	
    	$scope.laboratorios.forEach(function(laboratorio){
    		laboratorio.dias.forEach(function(dia){
    			for(numeroDefranja = 0; numeroDefranja < dia.franjas.length - 1; numeroDefranja++){
	                if(dia.franjas[numeroDefranja].eventos[0].tipo == dia.franjas[numeroDefranja + 1].eventos[0].tipo){
	                	dia.franjas[numeroDefranja].eventos = dia.franjas[numeroDefranja].eventos.concat(dia.franjas[numeroDefranja + 1].eventos);
	                	dia.franjas[numeroDefranja].horario.a = dia.franjas[numeroDefranja + 1].horario.a;
	                	dia.franjas.splice(numeroDefranja + 1, 1);
	                }
            	}
    		})
    	});
    };
    
    var generarPosiblesDiasLibres = function(){
        var diasLibres = [];
        var horario = {de: $scope.horaDeApertura, a: $scope.horaDeCierre};
        $scope.nombresDeLaboratorios.forEach(function(nombreDeLaboratorio){
            for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
				//var fecha = $scope.primerDiaSolicitado;
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
				$scope.nombresDeLaboratorios.push(laboratorio.nombre);
			});
			$scope.sePudieronTraerLaboratorios = true;
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
			$scope.sePudieronTraerDocentes = true;
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
			
			//$scope.reservas.splice(0,$scope.reservas.length); Por qué? cuando pida las de febrero, no quiero que se vayan del calendario las de maniana que ya tenia.
			reservasRecibidas.forEach(function(reserva) {
				$scope.reservas.push(reserva)
			});
			$scope.sePudieronTraerReservasEstaVuelta = true;
			if($scope.sePudieronTraerPedidosEstaVuelta) {
				$scope.insertarDatos(); // deberia 'insertar' solo las reservas, no se si las recien obtenidas o todas
			}
			
		};
		
		servidor.obtenerReservas($scope.primerDiaSolicitado, $scope.cuantosDiasMasCargar)
		.success(function(reservasRecibidas, status, headers, config) {
			console.log('Obtenidas las reservas en ' + $scope.primerDiaSolicitado + ' y en los ' + ($scope.cuantosDiasMasCargar - 1) + ' d\xEDas siguientes exitosamente');
			comportamientoSiRequestExitoso(reservasRecibidas);
		})
		.error(function(reservasRecibidas, status, headers, config) {
			console.log('Se produjo un error al obtener las reservas en ' + $scope.primerDiaSolicitado + ' y en los ' + ($scope.cuantosDiasMasCargar - 1) + ' d\xEDas siguientes' );

			// TEMP
			comportamientoSiRequestExitoso(porDefecto.getReservas());
		});
		
	};
	
	$scope.obtenerPedidos = function() {
		
		var comportamientoSiRequestExitoso = function(pedidosRecibidos) {
			
			//$scope.pedidos.splice(0,$scope.pedidos.length); //Por qué? cuando pida los de febrero, no quiero que se vayan del calendario los de maniana que ya tenia.
			pedidosRecibidos.forEach(function(pedido) {
				$scope.pedidos.push(pedido)
			});
			$scope.sePudieronTraerPedidosEstaVuelta = true;
			if($scope.sePudieronTraerReservasEstaVuelta) {
				$scope.insertarDatos(); // deberia 'insertar' solo los pedidos, no se si los recien obtenidos o todos
			}
			
		};
		
		// el parametro usuario no se usa; el usuario logueado se obtiene de la cookie.
		//Pero mientras tanto:
		if($scope.usuario.inicioSesion) {
			servidor.obtenerPedidos($scope.primerDiaSolicitado, $scope.cuantosDiasMasCargar)
			.success(function(pedidosRecibidos, status, headers, config) {
				console.log('Obtenidas los pedidos en ' + $scope.primerDiaSolicitado + ' y en los ' + ($scope.cuantosDiasMasCargar - 1) + ' d\xEDas siguientes exitosamente');
				comportamientoSiRequestExitoso(pedidosRecibidos);
			})
			.error(function(pedidosRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los pedidos en ' + $scope.primerDiaSolicitado + ' y en los ' + ($scope.cuantosDiasMasCargar - 1) + ' d\xEDas siguientes' );
	
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getPedidos($scope.usuario));
			});
		}
		else {
			$scope.sePudieronTraerPedidosEstaVuelta = true;
			if($scope.sePudieronTraerReservasEstaVuelta) {
				$scope.insertarDatos(); // deberia 'insertar' solo los pedidos, no se si los recien obtenidos o todos
			}
		}
		
	};

    $scope.actualizarPlanilla = function (){
		
		if(!$scope.sePudieronTraerLaboratorios) {
			$scope.obtenerLaboratorios();
		};
		
		if(!$scope.sePudieronTraerDocentes && $scope.usuario.esEncargado) {
			$scope.obtenerDocentes();
		};
		
		$scope.sePudieronTraerReservasEstaVuelta = false;
		$scope.obtenerReservas();
		
		$scope.sePudieronTraerPedidosEstaVuelta = false;
		$scope.obtenerPedidos();
		
		if(!$scope.sePudieronTraerMaterias) {
			$scope.obtenerMaterias();
		};
    };

    $scope.insertarDatos = function(){
    	//alert('insertando datos');
		//Crea los días para la columna de fechas
        $scope.dias = [];
        for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
				//var fecha = $scope.primerDiaSolicitado;
                fecha.setDate(fecha.getDate() + numeroDeDia);
                $scope.dias.push({fecha: fecha});
            }

        //Agrega los días sin nada dentro de la columna de cada laboratorio.
        $scope.laboratorios.forEach(function(laboratorio){
			laboratorio.dias = [];
			for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
				//var fecha = $scope.primerDiaSolicitado;
                fecha.setDate(fecha.getDate() + numeroDeDia);
				laboratorio.dias.push({fecha: fecha, franjas: []});
            }
        });

        // por si otras partes del sistema no manejan timestamps
		$scope.reservas.forEach(function(reserva) {
			//$scope.agregarFechaYHorario(reserva); Descomentar esto cuando recibamos en el formato correcto
			
			reserva.tipo = 'reserva';
			meterEnElCalendario(reserva);
		});

        // por si otras partes del sistema no manejan timestamps
		$scope.pedidos.forEach( function(pedido) {
			//$scope.agregarFechaYHorario(pedido); Descomentar esto cuando recibamos en el formato correcto
			
			pedido.tipo = 'pedido';
			meterEnElCalendario(pedido);
		});

		completarEspaciosLibres();
    };


    $scope.estiloSegun = function(franjaAnterior, franja, franjaPosterior){
        
        if($scope.usuario.esEncargado){
            if (franja.eventos[0].tipo == 'reserva'){color = '#800080';
            } else {
                if(franja.eventos[0].tipo == 'pedido'){
                    color = '#ff00ff';
                } else {
                    color = '#e0ffff';}
            }
        } else {
            if (franja.eventos[0].tipo == 'reserva'){
                if($scope.usuario.inicioSesion && franja.eventos[0].docente.nombre == $scope.usuario.nombre) {
                    color = '#800080';
                } else {
                    color = '#888888';
                }
            } else {
                if(franja.eventos[0].tipo == 'pedido'){
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
        var altura = 100*(franja.horario.a - franja.horario.de)/($scope.horaDeCierre - $scope.horaDeApertura);

        return {'height': altura.toString() + '%', 'background-color': color}
    }

    $scope.mostrarLaFranja = function(franja){
    	//Cada franja tiene varios eventos, todos del mismo tipo.
        if($scope.usuario.inicioSesion){
            if(franja.eventos[0].tipo == 'reserva' && ($scope.usuario.esEncargado || franja.eventos[0].docente.nombre == $scope.usuario.nombre)){
                comunicador.setEventos(franja.eventos);
                $state.go('cancelarReserva');
            }
			else {
			
				if(franja.eventos[0].tipo == 'pedido'){
					if($scope.usuario.esEncargado) {
						comunicador.setEventos(franja.eventos);
						$state.go('pedidosDeUnDia');
					}
					else {
						if(franja.eventos[0].docente.nombre == $scope.usuario.nombre) {
							comunicador.setEventos(franja.eventos);
							$state.go('cancelarReserva');
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
			$scope.sePudieronTraerMaterias = true;
		})
		.error(function(data, status, headers, config) {
			
			console.log('Se produjo un error al obtener las materias del servidor.');
			
			// TEMP
			$scope.especialidades = porDefecto.getEspecialidades();
			$scope.sePudieronTraerMaterias = true;
		});
	};
	
	$scope.seConocenLasMateriasDe = function(especialidad) {
		if (especialidad.nombre == 'Sistemas') {
			return true;
		}
		return false;
	}
	
	$scope.cargarMasDias = function() {
		$scope.primerDiaSolicitado.setDate($scope.primerDiaSolicitado.getDate() + $scope.cuantosDiasMasCargar);
		$scope.diasSolicitados =  $scope.diasSolicitados + $scope.cuantosDiasMasCargar;
		$scope.actualizarPlanilla();
	}
	
	$scope.$watch('usuario.inicioSesion',function(){
		//Cada vez que el usuario se loguea o se desloguea, se actualiza la planilla.
		$scope.pedidos = [];
		$scope.actualizarPlanilla();
	});
});