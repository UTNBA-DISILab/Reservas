<?php

include_once 'utils/includes.php';
include_once 'get_glpi_tracking.php';
include_once 'add_glpi_reservation.php';

function addGlpiTracking($reservation, $comment) {
	$dbhandler = getGlpiDatabase();
	$dbhandler->connect();

	//Add glpi_tracking
	$glpi_tracking = new Glpi_tracking();

	$glpi_tracking->FK_entities = 0; //Creo que siempre es 0
	$glpi_tracking->name = "Materia: ".$reservation->subject." Profesor: ".$reservation->owner->name . ". Reserva realizada por Sistema de Reservas"; //No se que va aca, en las tablas no hay nada consistente
	$glpi_tracking->date = $reservation->beginDate; //Dia de la reserva, seria el beginDate
	$glpi_tracking->closedate = $reservation->endDate; //Dia y hora cuando termina la reserva
	$glpi_tracking->date_mod = new DateTime('NOW'); //No se que es esto
	$glpi_tracking->status = "assign"; //Estado: 	"Nueva (no asignado)" "new"/"Asignado" "assign"/"Planificado" "plan"/"En espera" "waiting"
										//"Resuelto" "old_done"/"Cancelado" "old_notdone"

	//------------------------------------------------------
	//Por decision de Ramiro el jefe de los laboratorios de sistemas; assign, author y recipient van a ser el validator id
	$glpi_tracking->author = $reservation->validator->id; //Corresponde al usuario de GLPI que autorizo la reserva.
	$glpi_tracking->recipient = $reservation->validator->id;
	$glpi_tracking->assign = $reservation->validator->id;
	//------------------------------------------------------

	$glpi_tracking->FK_group = 0; //Grupo: "Aplicaciones" "146"/"Calidad" "147"/"Coordinadores" "150"/"Infraestructura" "144"
	        						//"Jefes de Turno" "149"/"Responsables" "148"/"Servicios" "145"
	$glpi_tracking->request_type = 3; //Origen de la solicitud (E-mail/Telefono/"Directa" "4"/"Propia" "7"/"Otro" "6"))	
	$glpi_tracking->assign_ent = 0;
	$glpi_tracking->assign_group = 149; //Asignar - grupo: "Aplicaciones" "146"/"Calidad" "147"/"Coordinadores" "150"/"Infraestructura" "144"
	        							//"Jefes de Turno" "149"/"Responsables" "148"/"Servicios" "145"
										//Por decision de Ramiro el jefe de los laboratorios de sistemas; es siempre jefe de turno
	$glpi_tracking->device_type = 1050; //device_type	"Sala" "1050"

	$arrayLaboratorios = array(
            "Azul" => "4",
            "Verde" => "2",
            "Rojo" => "1",
            "Campus" => "5",
            "Campus Lab" => "6",
            "Multimedia" => "7",
            "Amarillo" => "3");

	$glpi_tracking->computer = $arrayLaboratorios[$reservation->lab->name];
			//			"Laboratorio Azul" 			"4"
	        //			"Laboratorio Campus" 		"5"
	        //			"Laboratorio Rojo" value=	"1"
	        //			"Laboratorio Verde" 		"2"
	        //			"Sala multimedia" 			"7"
	        //			"Sala Servidores" 			"9"
	        //			"WorkGroup Lab 1" value=	"3"
	        //			"WorkGroup Lab 2" value=	"6"

	$glpi_tracking->contents = $comment; //Descripcion que escribe EL DOCENTEEEEEE!!!!
	$glpi_tracking->priority = 3; //Prioridad ("Critica" "5"/"Alta" "4"/"Media" "3"/"Baja" "2")
	$glpi_tracking->uemail = ""; 
	$glpi_tracking->emailupdates = 0;
	$glpi_tracking->realtime = 0;
	$glpi_tracking->category = 70; //Categoria (Estructura arbol: Peticiones->Compras/Hw/Mantenimiento/Otros/Salas->Reservas "70")
	$glpi_tracking->cost_time = 0;
	$glpi_tracking->cost_fixed = 0;
	$glpi_tracking->cost_material = 0;

    if(strnatcasecmp($reservation->lab->location,"medrano") == 0)
    {
        $glpi_tracking->location = "123";		//Lugar ("Campus" "122"/"Medrano" "123")
    }else{
        $glpi_tracking->location = "122";		//Lugar ("Campus" "122"/"Medrano" "123")
    }

	$glpi_tracking->service_type = 3; //Servicio afectado ("Reserva de salas" "3")
	$glpi_tracking->ticket_type = 1; // Siempre es 1 que es ticket de "peticion"
	$glpi_tracking->state_reason = 0; //state_reason	Motivos para el estado  NO ASIGNADO EN GLPI
	$glpi_tracking->applicant = 16;
			/* applicant = 	"alumnos de otras carreras - " 		value="25"
	                        "Alumnos DISI - " 					value="17"
	                        "Ayudante DISI LAB - " 				value="20"
	                        "Comité Calidad - " 				value="22"
	                        "Coord. DISI LAB - " 				value="11"
	                        "Director DISI - " 					value="9"
	                        "Docente otros Departamentos - " 	value="16"
	                        "Docentes DISI - " 					value="15"
	                        "Jefe de Turno - " 					value="21"
	                        "Responsable de Aplicaciones - " 	value="13"
	                        "Responsable de Infraestrucura - " 	value="14"
	                        "Responsable de Redes - " 			value="24"
	                        "Responsable de Servicios - " 		value="12"
	                        "Secretarías - " 					value="18"
	        */

	$glpi_tracking->commit($dbhandler);

	$dbhandler->disconnect();	

	//Ahora hacemos el insert en glpi_reservation_resa

	$begin = $glpi_tracking->date;
	$end = $glpi_tracking->closedate;
	$computer = $glpi_tracking->computer;

	$new_tracking = getGlpiTracking($glpi_tracking->sqlDateTime($begin), $glpi_tracking->sqlDateTime($end), $computer);

	addGlpiReservation($new_tracking->id, $glpi_tracking, "Materia: ".$reservation->subject." Profesor: ".$reservation->owner->name);

	//Enviar mail de confirmacion
	enviarMail('confirmacionReserva', $reservation->owner, $reservation->lab->name, $reservation->lab->size, $reservation->beginDate, $reservation->endDate, $reservation->subject, $new_tracking->id);

}

?>