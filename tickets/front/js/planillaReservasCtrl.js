angular.module('reservasApp').controller('planillaReservasCtrl',function($scope, $state, $location, obtenerInformacionDelServidorService, comunicadorEntreVistasService){

    $scope.$on('$viewContentLoaded', function(){
        $location.replace(); //Limpia el historial de ruta
    });

    var obtener = obtenerInformacionDelServidorService;
    var comunicador = comunicadorEntreVistasService;
    $scope.usuario = comunicador.getUsuario();

    //Esto quizá se podría poner en un servicio que se "configuraciónPorDefecto" por ejemplo.
    $scope.diasDesdeAhora = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    $scope.diasSolicitados = 3;
    $scope.horaDeApertura = 9;
    $scope.horaDeCierre = 22;
    //ToDo: Ponerles la capacidad de personas para poder filtrar según cantidad de alumnos
    var nombresDeLaboratorios = ['Azul','Amarillo','Verde','Rojo','Workgroup'];

    var elHorarioDelPrimeroEsAnterior = function(momento1, momento2){return momento1.horario.de - momento2.horario.de;}

    var meterEnElCalendario = function(eventoCompleto){

        var laboratorio = $scope.laboratorios.filter(function(unLaboratorio){return unLaboratorio.nombre == eventoCompleto.laboratorio})[0];

        var dia = laboratorio.dias.filter(function(unDia){
            return Math.floor(unDia.fecha.getTime() / (1000 * 3600 * 24)) == Math.floor(eventoCompleto.fecha.getTime() / (1000 * 3600 * 24))
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
        
        //Crea los días para la columna de fechas
        $scope.dias = [];
        for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
                $scope.dias.push({fecha: fecha});
            }

        //Crea a los laboratorios y a los días sin nada dentro.
        $scope.laboratorios = [];
        nombresDeLaboratorios.forEach(function(nombreDeLaboratorio){
            var laboratorio = {nombre: nombreDeLaboratorio, dias: []};
            for(numeroDeDia = 0; numeroDeDia < $scope.diasSolicitados; numeroDeDia++){
                var fecha = new Date();
                fecha.setDate(fecha.getDate() + numeroDeDia);
                laboratorio.dias.push({fecha: fecha, momentos: []});
            }
            $scope.laboratorios.push(laboratorio);
        });

        //El server nos traerá las reservas sin importar el tipo de usuario:
        $scope.reservas = obtener.reservas($scope.diasSolicitados);
        $scope.reservas.forEach(function(reserva){reserva.tipo = 'reserva'; meterEnElCalendario(reserva);});

        //El server debe traernos los pedidos según el nombre y tipo de usuario.
        //Si los datos de usuario y contraseña son erróneos, devuelve un array vacío.
        console.log($scope.usuario);
        $scope.pedidosDeReservas = obtener.pedidosSegun($scope.diasSolicitados, $scope.usuario);
        $scope.pedidosDeReservas.forEach(function(pedido){pedido.tipo = 'pedido'; meterEnElCalendario(pedido);});

        //Si se logueó un docente (o si el encargado le reserva algo en su nombre), trae sus materias. 
        //Si no, trae un array vacío.
        //$scope.cursos = obtener.cursosDelDocente(usuario);
        //var diasDeLaMateria = $scope.cursos.filter(function(curso){
        //    curso.codigoDeCurso: 'K1111'
        //});

        //Filtrar la materia que coincida, y generar los momentos con sus DÍAS (meter en cada día que el evento es la materia completa)
        //$scope.cursos.forEach(function(pedido){pedido.tipo = 'materia'; meterEnElCalendario(pedido);});

        //Obtenemos los horarios de la materia que el profesor eligió:

        

        //Generamos días libres para rellenar los espacios vacíos:
        var diasLibresParaRrellenarEspaciosVacios = generarPosiblesDiasLibres();
        diasLibresParaRrellenarEspaciosVacios.forEach(function(libre){libre.tipo = 'libre'; meterEnElCalendario(libre);});
    };

    $scope.actualizarPlanilla();    

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
                    $state.go('nuevaReserva');
                }
                else {
                    alert('Inhabilitado');
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