angular.module('reservasApp').controller('planillaReservasCtrl',function($scope, $state, $location, $interval, $cookies, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){

    $scope.$on('$viewContentLoaded', function(){
        $location.replace(); //Limpia el historial de ruta
    });

	//Colores
	var reservadoAlDocente='#088A08';
	var pedidoPorMasDeUnDocente='#B4045F';
	var inhabilitado='#A4A4A4';
	var libre='#FFFFFF';
	var reservadoPorUnDocente='#FA5858';
	var contraoferta='#04B4AE';
	var pedidosAunNoAceptados='#D7DF01';

    var pedidos = [];
    var sePudieronTraerPedidosEstaVuelta = false;
    var pedidosAuxiliares = [];
	
	var reservas = [];
	var sePudieronTraerReservasEstaVuelta = false;
	
	$scope.laboratorios = [];
	var sePudieronTraerLaboratoriosEstaVuelta = false;
	var sePudieronTraerLaboratorios = false;
	
	$scope.docentes = [];
	var sePudieronTraerDocentes = false;
	
	var nombresDeLaboratorios = [];
	
	$scope.especialidades = [];
	var sePudieronTraerMaterias = false;

    var comunicador = comunicadorEntreVistasService;
    $scope.usuario = comunicador.getUsuario();
    comunicador.setPlanilla($scope);

	$scope.especialidad = comunicador.getEspecialidad();	
	$scope.actualizarEspecialidad = function() {
		comunicador.setEspecialidad($scope.especialidad);
	};
	
	$scope.materia = comunicador.getMateria();
	$scope.actualizarMateria = function() {
		comunicador.setMateria($scope.materia);
	};

    var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	var primerDiaSolicitado = new Date();
	primerDiaSolicitado.setHours(0,0,0,0);

	var servidor = comunicadorConServidorService;

	var porDefecto = valoresPorDefectoService;
    var diasSolicitados = porDefecto.getDiasMostradosIniciales();
	var cuantosDiasMasCargar = porDefecto.getCuantosDiasMas();
    var horaDeApertura = porDefecto.getHoraDeApertura();
    var horaDeCierre = porDefecto.getHoraDeCierre();
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos

    var elHorarioDelPrimeroEsAnterior = function(franja1, franja2){return franja1.desde - franja2.desde;}
	
	var convertirTimestampADate = function(evento) {
		evento.begin = new Date(evento.begin);//Las fechas vienen en timestamp y es mucho más fácil manejarlas como Date.
		evento.end = new Date(evento.end);
		evento.creation_date = new Date(evento.creation_date);
	}
	
	var completarEspaciosLibres = function() {
		//Generamos días libres para rellenar los espacios vacíos:
		var diasLibresParaRrellenarEspaciosVacios = generarPosiblesDiasLibres();
		diasLibresParaRrellenarEspaciosVacios.forEach(function(libre) {
			meterEnElCalendario(libre);
		});
		unificarPedidos();
	};
	
	var meterEnElCalendario = function(eventoCompleto){
        var laboratorio = $scope.laboratorios.filter(
			function(unLaboratorio) {
				return unLaboratorio.id == eventoCompleto.lab_id;
			}
		)[0];
		
        var dia = laboratorio.dias.filter(function(unDia){
			return unDia.fecha.esElMismoDiaQue(eventoCompleto.begin);
        })[0];

        var franjaNueva = {desde: eventoCompleto.begin, hasta: eventoCompleto.end, eventos: [eventoCompleto]};
        franjaNueva.desde = eventoCompleto.begin;
        franjaNueva.hasta = eventoCompleto.end;
        var insertadoCompletamenteODesechado = false;
        
        while(!insertadoCompletamenteODesechado){
            if(franjaNueva.desde >= franjaNueva.eventos[0].hasta){
                    insertadoCompletamenteODesechado = true;
                }
            else {
                var franjaSuperpuestoAlPrincipio = dia.franjas.filter(function(franja){
                	return franja.desde <= franjaNueva.desde && franja.hasta > franjaNueva.desde})[0];
                if(franjaSuperpuestoAlPrincipio){//El comienzo del franjaNueva será después de que el otro termine.
                    franjaNueva.desde = franjaSuperpuestoAlPrincipio.hasta;
                    franjaNueva.desde = franjaSuperpuestoAlPrincipio.hasta;
                } else {
                    var franjaSuperpuestoMasAdelante = dia.franjas.filter(function(franja){
                            return franja.desde > franjaNueva.desde && franja.desde < franjaNueva.hasta
                        }).sort(elHorarioDelPrimeroEsAnterior)[0];
                    if(franjaSuperpuestoMasAdelante){//Se deberá partir el franjaNueva en dos: Uno antes de la superposición y otro después.
                        var franjaNuevaCortado = {desde: franjaNueva.desde, hasta: franjaSuperpuestoMasAdelante.desde, eventos: [franjaNueva.eventos[0]]};

                        dia.franjas.push(franjaNuevaCortado);
                        dia.franjas = dia.franjas.sort(elHorarioDelPrimeroEsAnterior);
        
                        franjaNueva.desde = franjaSuperpuestoMasAdelante.hasta;
                        franjaNueva.desde = franjaSuperpuestoMasAdelante.hasta;
                    } else {
                        dia.franjas.push(franjaNueva);
                        dia.franjas = dia.franjas.sort(elHorarioDelPrimeroEsAnterior);
                        insertadoCompletamenteODesechado = true;
                    }
                }
            }
        }
    };

    var unificarPedidos = function(){
    	//Se unifican los pedidos en una misma franja horaria con un array de todos ellos, debido a que éstos pueden superponerse.
    	//En principio también se unificaban las reservas, pero es más claro que estén diferenciadas. Si los que continúan el proyecto quieren que se unifique, les será muy fácil cambiarlo.
    	$scope.laboratorios.forEach(function(laboratorio){
    		laboratorio.dias.forEach(function(dia){
    			for(numeroDeFranja = 0; numeroDeFranja < dia.franjas.length - 1; numeroDeFranja++){
	                if(dia.franjas[numeroDeFranja].eventos[0].tipo == "pedido" && dia.franjas[numeroDeFranja + 1].eventos[0].tipo == "pedido"){
	                	dia.franjas[numeroDeFranja].eventos = dia.franjas[numeroDeFranja].eventos.concat(dia.franjas[numeroDeFranja + 1].eventos);
	                	dia.franjas[numeroDeFranja].hasta = dia.franjas[numeroDeFranja].hasta < dia.franjas[numeroDeFranja + 1].hasta ? dia.franjas[numeroDeFranja + 1].hasta : dia.franjas[numeroDeFranja].hasta;
	                	dia.franjas.splice(numeroDeFranja + 1, 1);
	                	numeroDeFranja--;
	                }
            	}
    		})
    	});
    };
    
    var generarPosiblesDiasLibres = function(){
        var diasLibres = [];
        $scope.laboratorios.forEach(function(laboratorio){
            for(numeroDeDia = 0; numeroDeDia < diasSolicitados; numeroDeDia++){

            	var inicio = new Date();
                var fin = new Date();

                inicio.setDate(inicio.getDate() + numeroDeDia);
                fin.setDate(fin.getDate() + numeroDeDia);

                inicio.setHours(porDefecto.getHoraDeApertura().getHours(),porDefecto.getHoraDeApertura().getMinutes(),0,0);
	            fin.setHours(porDefecto.getHoraDeCierre().getHours(),porDefecto.getHoraDeCierre().getMinutes(),0,0);

	            switch(inicio.getDiaDeLaSemana()) {
				    case 'Domingo':
				        diasLibres.push({lab_id: laboratorio.id, begin: inicio, end: fin, tipo: 'inhabilitado'});
				        break;
				    case 'Sábado':
				        var inicioSabado = new Date();
                		var finSabado = new Date();

		                inicioSabado.setTime(inicio.getTime());
		                finSabado.setTime(fin.getTime());

		                inicioSabado.setHours(porDefecto.getHoraDeAperturaSabados().getHours(),porDefecto.getHoraDeAperturaSabados().getMinutes(),0,0);
	            		finSabado.setHours(porDefecto.getHoraDeCierreSabados().getHours(),porDefecto.getHoraDeCierreSabados().getMinutes(),0,0);

	            		if(numeroDeDia == 0){//Es el día de hoy
	            			var horaActual = new Date();
				        	var horaInicialLibre = horaActual < inicioSabado ? inicioSabado : horaActual;
				        	horaInicialLibre = horaInicialLibre < finSabado ? horaInicialLibre : finSabado;
				        	var horaFinalLibre = horaActual < finSabado ? horaActual : finSabado;

				        	if(horaInicialLibre < horaFinalLibre){
				        		diasLibres.push({lab_id: laboratorio.id, begin: inicio, end: horaInicialLibre, tipo: 'inhabilitado'});
		            			diasLibres.push({lab_id: laboratorio.id, begin: horaInicialLibre, end: finSabado, tipo: 'libre'});
		            			diasLibres.push({lab_id: laboratorio.id, begin: horaFinalLibre, end: fin, tipo: 'inhabilitado'});
				        	} else {
				        		diasLibres.push({lab_id: laboratorio.id, begin: inicio, end: fin, tipo: 'inhabilitado'});
				        	}
			        		
				        } else {
				        	diasLibres.push({lab_id: laboratorio.id, begin: inicioSabado, end: inicioSabado, tipo: 'inhabilitado'});
				        	diasLibres.push({lab_id: laboratorio.id, begin: inicioSabado, end: finSabado, tipo: 'libre'});
				        	diasLibres.push({lab_id: laboratorio.id, begin: finSabado, end: fin, tipo: 'inhabilitado'});
				        }
				        break;
				    default://Es de Lunes a Viernes
				        if(numeroDeDia == 0){//Es el día de hoy
				        	var horaInicialLibre = new Date();
				        	horaInicialLibre = horaInicialLibre < inicio ? inicio : horaInicialLibre;

				        	diasLibres.push({lab_id: laboratorio.id, begin: inicio, end: horaInicialLibre, tipo: 'inhabilitado'});
		            		diasLibres.push({lab_id: laboratorio.id, begin: horaInicialLibre, end: fin, tipo: 'libre'});
				        } else {
				        	diasLibres.push({lab_id: laboratorio.id, begin: inicio, end: fin, tipo: 'libre'});
				        }

				}
            }
        })
        return diasLibres;
    };

    var generarEvento = function(idDeLaboratorio, desde, hasta, tipo){
    	return {lab_id: idDeLaboratorio, begin: desde, end: hasta, tipo: tipo}
    }
	
	var obtenerLaboratorios = function() {
		
		var comportamientoSiRequestExitoso = function(laboratoriosRecibidos) {
			
			$scope.laboratorios.splice(0,$scope.laboratorios.length); // Acá sí va esto, porque en este caso el server devuelve siempre lo mismo y no quiero tener labs repetidos.
			laboratoriosRecibidos.forEach(function(laboratorio){
				$scope.laboratorios.push(laboratorio);
				nombresDeLaboratorios.push(laboratorio.nombre);
			});
			
			comunicador.setLaboratorios($scope.laboratorios);
			
			sePudieronTraerLaboratorios = true;
			sePudieronTraerLaboratoriosEstaVuelta = true;
			if(sePudieronTraerPedidosEstaVuelta && sePudieronTraerReservasEstaVuelta) {
			//if(transaccionFinalizada()){
				insertarDatos(); // deberia 'insertar' solo los laboratorios
				//insertarLaboratorios();
			//}
			}
		};
		
		// primero se los pedimos al comunicador entre vistas, que viene a actuar como cache
		if( comunicador.getLaboratorios().length < 1 ) {
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
		}
		else {
			comportamientoSiRequestExitoso(comunicador.getLaboratorios());
		}
	};
	
	var obtenerDocentes = function() {
		
		var comportamientoSiRequestExitoso = function(docentesRecibidos) {
			//$scope.docentes.splice(0,$scope.docentes.length); // Acá sí va esto, porque en este caso el server devuelve siempre lo mismo y no quiero tener docentes repetidos.
			//$scope.docentes.push("Ninguno");
			$scope.docentes = [];
			docentesRecibidos.forEach(function(docente){
				$scope.docentes.push(docente);
			});
			
			$scope.usuario.docenteElegido = $scope.docentes[0];
			comunicador.setDocentes($scope.docentes);			
			sePudieronTraerDocentes = true;
		};
		
		// primero se los pedimos al comunicador entre vistas, que viene a actuar como cache
		if( comunicador.getDocentes().length < 1 ) {
			servidor.obtenerDocentes()
			.success(function(docentesRecibidos, status, headers, config) {
				console.log('Obtenidos los docentes exitosamente');
				comportamientoSiRequestExitoso(docentesRecibidos);
			})
			.error(function(docentesRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los docentes del servidor');
				//TODO:debería haber un alert acá, en lugar de cargarlo con valores hardcodeados en un js...
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getDocentes());
			});
		}
		else {
			comportamientoSiRequestExitoso(comunicador.getDocentes());
		}
	};
	
	var obtenerReservas = function() {
		
		var comportamientoSiRequestExitoso = function(reservasRecibidas) {
			
			//reservas.splice(0,reservas.length); Por qué? cuando pida las de febrero, no quiero que se vayan del calendario las de maniana que ya tenia.
			reservasRecibidas.forEach(function(reserva) {
				//reserva.tipo = 'reserva';
				convertirTimestampADate(reserva);
				reservas.push(reserva);
			});
			sePudieronTraerReservasEstaVuelta = true;
			if(sePudieronTraerPedidosEstaVuelta && sePudieronTraerLaboratoriosEstaVuelta) {
				insertarDatos(); // deberia 'insertar' solo las reservas, no se si las recien obtenidas o todas
				//insertarPedidosYReservas();
			}
			
		};
		
		servidor.obtenerReservas(primerDiaSolicitado, cuantosDiasMasCargar)
		.success(function(reservasRecibidas, status, headers, config) {
			console.log('Obtenidas las reservas desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes exitosamente');
			comportamientoSiRequestExitoso(reservasRecibidas);
		})
		.error(function(reservasRecibidas, status, headers, config) {
			console.log('Se produjo un error al obtener las reservas desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes' );

			// TEMP
			comportamientoSiRequestExitoso(porDefecto.getReservas());
		});
	};
	
	var obtenerPedidos = function() {
		
		var comportamientoSiRequestExitoso = function(pedidosRecibidos) {
			
			//pedidos.splice(0,pedidos.length); //Por qué? cuando pida los de febrero, no quiero que se vayan del calendario los de maniana que ya tenia.
			pedidosRecibidos.forEach(function(pedido) {
				//pedido.tipo = 'pedido';
				convertirTimestampADate(pedido);

				pedido.labContraofertable = comunicador.getNombreDelLab(pedido.lab_id);
				pedido.beginContraofertable = pedido.begin.getMinutosDesdeMedianoche();
				pedido.endContraofertable = pedido.end.getMinutosDesdeMedianoche();
				
				pedidos.push(pedido)
			});
			
			pedidosAuxiliares = pedidos;
			sePudieronTraerPedidosEstaVuelta = true;
			if(sePudieronTraerReservasEstaVuelta && sePudieronTraerLaboratoriosEstaVuelta) {
				 insertarDatos(); // deberia 'insertar' solo los pedidos, no se si los recien obtenidos o todos
				//insertarPedidosYReservas();
				//filtrarPorDocente(); // adentro de esta funcion se llama a insertarDatos()
			}
			//filtrarPorDocente();
		};
		
		// el parametro usuario no se usa; el usuario logueado se obtiene de la cookie.
		//Pero mientras tanto:
		if($scope.usuario.inicioSesion) {
			servidor.obtenerPedidos(primerDiaSolicitado, cuantosDiasMasCargar)
			.success(function(pedidosRecibidos, status, headers, config) {
				console.log('Obtenidas los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes exitosamente');
				comportamientoSiRequestExitoso(pedidosRecibidos);
			})
			.error(function(pedidosRecibidos, status, headers, config) {
				console.log('Se produjo un error al obtener los pedidos desde ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("begin").valor) + ' hasta ' + Date.stringTimestampToDate(config.url.obtenerUnParametroDeURL("end").valor) + ' d\xEDas siguientes' );
	
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getPedidos($scope.usuario));
			});
		}
		else {
			sePudieronTraerPedidosEstaVuelta = true;
			if(sePudieronTraerReservasEstaVuelta && sePudieronTraerLaboratoriosEstaVuelta) {
				insertarDatos(); // deberia 'insertar' solo los pedidos, no se si los recien obtenidos o todos
				//insertarPedidosYReservas();
			}
		}
	};

	var filtrarPorDocente = function() {
		//TODO: consultar a mi me parece que no tiene sentido ahcer esto
		//Esto es en el caso de que el Encargado elija un Docente específico
		/*if($scope.usuario.docenteElegido){
			if($scope.usuario.docenteElegido.name != "Ninguno"){
				pedidos = pedidosAuxiliares.filter(function(pedido){
					return pedido.owner_id == $scope.usuario.docenteElegido.id;
				});
			} else {
				pedidos = pedidosAuxiliares;
			};
		};*/
		insertarDatos();
		//insertarPedidosYReservas();
	}

    var actualizarPlanilla = function (){
		
		if(!sePudieronTraerLaboratorios) {
			sePudieronTraerLaboratoriosEstaVuelta = false;
			obtenerLaboratorios();
		};
		
		if(!sePudieronTraerDocentes && $scope.usuario.esEncargado) {
			obtenerDocentes();
		};
		
		sePudieronTraerReservasEstaVuelta = false;
		obtenerReservas();
		
		sePudieronTraerPedidosEstaVuelta = false;
		obtenerPedidos();
		
		
		if(!sePudieronTraerMaterias && $scope.usuario.inicioSesion) {
			obtenerMaterias();
		};
    };
	
	var insertarDatos = function(){
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

		pedidos.forEach( function(pedido) {
			//convertirTimestampADate(pedido);
			if(pedido.description !== "undefined" && pedido.description.substr(0,16)=="Pedido original:"){
				pedido.tipo = 'contraoferta';
			} else {
				pedido.tipo = 'pedido';
			}
			meterEnElCalendario(pedido);
		});

		reservas.forEach(function(reserva) {
			//convertirTimestampADate(reserva);
			reserva.tipo = 'reserva';
			meterEnElCalendario(reserva);
		});

		completarEspaciosLibres();
		
    };
	
	var esDelUsuarioLogueado = function(unPedidoOReserva) {
		return unPedidoOReserva.owner_id == $scope.usuario.id
	}

    $scope.estiloSegun = function(franjaAnterior, franja, franjaPosterior){

        var esDelQueInicioSesion = $scope.usuario.inicioSesion && esDelUsuarioLogueado(franja.eventos[0]);
    	var esDelDocenteElegido = $scope.usuario.inicioSesion && $scope.usuario.docenteElegido && franja.eventos[0].owner_id == $scope.usuario.docenteElegido.id;
        
    	if(franja.eventos[0].tipo == 'pedido'){
			if(esDelQueInicioSesion || esDelDocenteElegido){
            	color = pedidosAunNoAceptados;
        	}else{
        		color = pedidoPorMasDeUnDocente;
			}
        };

        if(franja.eventos[0].tipo == 'libre'){
            color = libre;
        };

    	if(franja.eventos[0].tipo == 'contraoferta'){
			color = contraoferta;
        };

        if(franja.eventos[0].tipo == 'reserva'){
        	if(esDelQueInicioSesion || esDelDocenteElegido){
        		color = reservadoAlDocente;
        	} else {
        		color = reservadoPorUnDocente;
        	}
        }

        if(franja.eventos[0].tipo == 'inhabilitado'){
            color = inhabilitado;
        };

        //Faltan horarios inutilizados: Lo que ya haya transcurrido del día de hoy, y lo de fines de semana.
        var altura = 100*(franja.hasta - franja.desde)/(horaDeCierre - horaDeApertura);
        return {'height': altura.toString() + '%', 'background-color': color}
    }

    $scope.mostrarLaFranja = function(franja){
    	//Cada franja tiene varios eventos, todos del mismo tipo.
    	if($scope.usuario.inicioSesion){
    		switch (franja.eventos[0].tipo) {
	    		case 'reserva': 
	    			if($scope.usuario.esEncargado || esDelUsuarioLogueado(franja.eventos[0])){
	    			//TODO: esDelUsuarioLogueado en realidad debería servir también para el docente seleccionado por el encargado.
		                comunicador.setEventos(franja.eventos);
		                $state.go('cancelarReserva');
		            } else {
		            	alert('Reservado para la materia: ' + franja.eventos[0].subject);
		            }
	    		break
	    		case 'pedido':
	    			comunicador.setEventos(franja.eventos);
	    			if($scope.usuario.esEncargado) {
						$state.go('pedidosDeUnaFranja');
					}
					else {
						if(esDelUsuarioLogueado(franja.eventos[0])) {
							$state.go('cancelarPedido');
						}
					}
	    		break
	    		case 'contraoferta':
	    			if($scope.usuario.esEncargado || esDelUsuarioLogueado(franja.eventos[0])){
		                comunicador.setEventos(franja.eventos);
		                $state.go('confirmarContraoferta');//TODO!!
		            } else {
		            	alert('Reservado para la materia: ' + franja.eventos[0].subject);
		            }
	    		break
	    		case 'libre':
	    			if($scope.materia && $scope.especialidad) {
						if(!$scope.usuario.esEncargado || $scope.usuario.docenteElegido.name != "Ninguno"){
								franja.eventos[0].subject = $scope.materia;
								franja.eventos[0].begin = franja.desde;
								franja.eventos[0].end = franja.hasta;
								comunicador.setEventos(franja.eventos);
								$state.go('pedidoDeReserva');
						} else {
							alert('Antes de reservar debe especificar el docente.')
						}
					} else {
						alert('Antes de reservar debe especificar la materia.');
					}
	    		break
	    		default: alert('Inhabilitado');
	    	}
    	} else {
    		switch (franja.eventos[0].tipo) {
	    		case 'reserva': 
	    			alert('Reservado para la materia: ' + franja.eventos[0].subject);
	    		break
	    		case 'libre':
	    			alert('Libre, a\xFAn no se asign\xF3 a ning\xFAn docente' + '\nSi desea hacer una reserva, inicie sesi\xF3n.');
	    		break
	    		default: alert('Inhabilitado');
	    	}
    	}
    };
	
	var obtenerMaterias = function() {
		var comportamientoSiRequestExitoso = function(materiasObtenidas) {
			$scope.especialidades.splice(0,$scope.especialidades.length);

			var especialidadesEnIngles = materiasObtenidas;

			especialidadesEnIngles.forEach(function(especialidad){
				var especialidadTraducida = {};
				especialidadTraducida.nombre = especialidad.name;
				especialidadTraducida.materias = [];
				especialidad.subjects.forEach(function(subject) {
					especialidadTraducida.materias.push(subject.name);
				});
				especialidadTraducida.materias.sort();

				$scope.especialidades.push(especialidadTraducida);
			});

			// var indiceSistemas = $scope.especialidades.indexOf();
			var indiceSistemas = 8;
			$scope.especialidad = $scope.especialidades[indiceSistemas];

			comunicador.setMaterias($scope.especialidades);
			sePudieronTraerMaterias = true;
		};
		
		// primero se las pedimos al comunicador entre vistas, que viene a actuar como cache
		// if( Object.getOwnPropertyNames(comunicador.getMaterias()).length == 0 ) {
		if( comunicador.getMaterias().length < 1 ) {
		
			servidor.obtenerMaterias()
			.success(function(materiasObtenidas, status, headers, config) {
				
				console.log('Obtenidas las materias y especialidades exitosamente');
				comportamientoSiRequestExitoso(materiasObtenidas);
			})
			.error(function(data, status, headers, config) {
				
				console.log('Se produjo un error al obtener las materias del servidor.');
				
				// TEMP
				comportamientoSiRequestExitoso(porDefecto.getEspecialidades());
			});
		}
		else {
			console.log('Usando las materias ya obtenidas');
			$scope.especialidades = comunicador.getMaterias();
		}
	};
	
	$scope.seConocenLasMateriasDe = function(especialidad) {
		if( !(typeof especialidad === 'undefined') && especialidad != '' && !(typeof especialidad.nombre === 'undefined') && especialidad.nombre != '')
			return especialidad.nombre.indexOf('Sistemas de Informaci') > -1
		else
			return false;
	}
	
	$scope.cargarMasDias = function() {
		primerDiaSolicitado.setDate(primerDiaSolicitado.getDate() + cuantosDiasMasCargar);
		diasSolicitados =  diasSolicitados + cuantosDiasMasCargar;
		actualizarPlanilla();
	}
	
	$scope.$watch('usuario.inicioSesion',function(){
		//Cada vez que el usuario se loguea o se desloguea, se actualiza la planilla.
		delete $scope.usuario.docenteElegido;
		$cookies.usuario = angular.toJson($scope.usuario);
		$scope.recargarPlanilla();
	});

	$scope.recargarPlanilla = function(){
		primerDiaSolicitado = new Date();
		primerDiaSolicitado.setHours(0,0,0,0);
		if($scope.laboratorios.length && $scope.laboratorios[0].dias.length)
			cuantosDiasMasCargar = $scope.laboratorios[0].dias.length;
		pedidos = [];
		reservas = [];
		actualizarPlanilla();
		primerDiaSolicitado.setDate(primerDiaSolicitado.getDate() + cuantosDiasMasCargar);
		cuantosDiasMasCargar = porDefecto.getCuantosDiasMas();
	};

	var promesa = $interval($scope.recargarPlanilla, porDefecto.getTiempoDeRecarga());
	$scope.$on('$destroy', function() {//Si salimos de la view, que deje de recargar
      $interval.cancel(promesa);
    });

	$scope.$watch('usuario.docenteElegido',function(){
		filtrarPorDocente();
	});
});