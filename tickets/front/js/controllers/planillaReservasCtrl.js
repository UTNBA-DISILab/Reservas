angular.module('reservasApp').controller('planillaReservasCtrl',function($scope, $state, $location, comunicadorConServidorService, comunicadorEntreVistasService, ayudaService, valoresPorDefectoService){

    $scope.$on('$viewContentLoaded', function(){
        $location.replace(); //Limpia el historial de ruta
    });

    $scope.pedidosDeReservas = [];
	$scope.reservas = [];
	$scope.laboratorios = [];
	var nombresDeLaboratorios = [];

    var comunicador = comunicadorEntreVistasService;
    $scope.usuario = comunicador.getUsuario();

    var ayuda = ayudaService;
    ayuda.actualizarExplicaciones();
    $scope.margen = ayuda.getMargen();
	
	$scope.hoy = new Date();

	var servidor = comunicadorConServidorService;

	var porDefecto = valoresPorDefectoService;
    $scope.diasDesdeAhora = porDefecto.getDiasParaVerLaPlanilla();
    $scope.diasSolicitados = porDefecto.getDiasMostradosIniciales();
    $scope.horaDeApertura = porDefecto.getHoraDeApertura();
    $scope.horaDeCierre = porDefecto.getHoraDeCierre();
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos

    var elHorarioDelPrimeroEsAnterior = function(momento1, momento2){return momento1.horario.de - momento2.horario.de;}

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
		alert('llenando dias libres');
		var diasLibresParaRrellenarEspaciosVacios = generarPosiblesDiasLibres();
		diasLibresParaRrellenarEspaciosVacios.forEach(function(libre) {
			libre.tipo = 'libre';
			meterEnElCalendario(libre);
		});
	};
	
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
    	servidor.inicializar($scope);
    	servidor.obtenerLaboratorios($scope.laboratorios, nombresDeLaboratorios);
		servidor.obtenerReservas($scope.hoy, $scope.diasSolicitados, $scope.reservas);
		servidor.obtenerPedidosSegun($scope.hoy, $scope.diasSolicitados, $scope.usuario, $scope.pedidosDeReservas);		
    };

    $scope.insertarDatos = function(){
    	console.log($scope.pedidosDeReservas);
    	//Crea los días para la columna de fechas
        $scope.dias = [];
        for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
                $scope.dias.push({fecha: fecha});
            }

        //Agrega los días sin nada dentro de la columna de cada laboratorio.
        $scope.laboratorios.forEach(function(laboratorio){
			laboratorio.dias = [];
			for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
				laboratorio.dias.push({fecha: fecha, momentos: []});
            }
        });

        // por si otras partes del sistema no manejan timestamps
		$scope.reservas.forEach(function(reserva) {
			//$scope.agregarFechaYHorario(reserva); Descomentar esto cuando recibamos en el formato correcto
			
			reserva.tipo = 'reserva';
			meterEnElCalendario(reserva);
		});

        // por si otras partes del sistema no manejan timestamps
		$scope.pedidosDeReservas.forEach( function(pedido) {
			//$scope.agregarFechaYHorario(pedido); Descomentar esto cuando recibamos en el formato correcto
			
			pedido.tipo = 'pedido';
			meterEnElCalendario(pedido);
		});

		completarEspaciosLibres();
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