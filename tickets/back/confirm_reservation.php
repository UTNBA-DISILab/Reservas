<?php
/**
* Tickets System confirm reservation form
request:
POST

params:
- reservation_id
+ description
+ nombre_lab
+ capacidad_lab

return:
nothing
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

if(!isset($_GET["res_id"])) {
	returnError(500, "missing reservation");
	return;
}
$res_id = $_GET["res_id"];
$description = "";

$body = file_get_contents('php://input');
if(isset($body)) {
	$jsonparams = json_decode($body, true);
	if($jsonparams) {
		$description = $jsonparams["description"];
	}
}

$dbhandler = getDatabase();
$dbhandler->connect();

$update_validator = false;
//check existing reservations in that time
$reservation = validateReservation($dbhandler, $res_id);
if(!$reservation) {
	returnError(404, "reservation not found");
	$dbhandler->disconnect();
}

$rstate = ReservationState::getLatestForReservationId($dbhandler, $reservation->id);
if(!isset($rstate)) {
	returnError(403, "invalid operation");
	$dbhandler->disconnect();
	return;
}
$oldstate = $rstate->state;

//change state
$is_owner = $myUser->id == $reservation->owner->id;
$is_validator = $myUser->id == $reservation->validator->id;
if(!$is_owner && !$is_validator) {
	//check if can be a new validator
	if($myUser->accessLvl < USR_LVL_IN_USR) {
		returnError(403, "invalid operation");
		$dbhandler->disconnect();
		return;
	}
	$update_validator = true;
	$is_validator = true;
}

$state = RES_STATE_CONFIRMED;
if($is_validator && $oldstate == RES_STATE_APPROVED_BY_VALIDATOR) {
	$state = RES_STATE_APPROVED_BY_VALIDATOR;
}
if($is_owner && $oldstate == RES_STATE_APPROVED_BY_OWNER) {
	if($myUser->accessLvl < USR_LVL_IN_USR)
	{
		$state = RES_STATE_APPROVED_BY_OWNER;
	}
	else
	{
		$update_validator = true;
	}
}

if($owner_validator)
{
	$reservation->validator = $myUser;
	$reservation->commit($dbhandler);
}

//push reservation state
$resState = new ReservationState();
$resState->reservation = $reservation;
$resState->state = $state;
if(isset($description)) {
	$resState->description = $description;
}
$resState->user = $myUser;
$resState->commit($dbhandler);

if($state == RES_STATE_CONFIRMED) {

if(RD_USE_GLPI) {
    $login_name = "gsardon";
    $login_password = "ale";    /// GENERAR UN USUARIO GLPI  PARA EL SISTEMA DE RESERVAS

    /******************************************************************************

    Definicion del ticket

     ******************************************************************************/

    $_POST["ticket_type"] = 1;
    //Abrir una peticion
    $_POST["status"]="new";			//Estado: 	"Nueva (no asignado)" "new"/"Asignado" "assign"/"Planificado" "plan"/"En espera" "waiting"
    //			"Resuelto" "old_done"/"Cancelado" "old_notdone"
    $_POST["author"] = "12";		//Autor: id (glpi_users) PONER EL MISMO ID DEL USUARIO GLPI
    $_POST["FK_group"]="0";			//Grupo: "Aplicaciones" "146"/"Calidad" "147"/"Coordinadores" "150"/"Infraestructura" "144"
    //		 "Jefes de Turno" "149"/"Responsables" "148"/"Servicios" "145"></option>
    $_POST["assign"]="12";			//Asignar - técnico (Sería el mismo de author o lo debería poder establecer cuando acepta el ticket?)
    $_POST["assign_group"]="145";	//Asignar - grupo: "Aplicaciones" "146"/"Calidad" "147"/"Coordinadores" "150"/"Infraestructura" "144"
    //		 "Jefes de Turno" "149"/"Responsables" "148"/"Servicios" "145"></option>


    $duracionReserva = $reservation->beginDate->diff($reservation->endDate);
    $duracionReservaMinutos = $duracionReserva->format('%i');
    $duracionReservaHoras = floor($duracionReservaMinutos / 60);
    $duracionReservaMinutos = $duracionReservaMinutos % 60;


    $_POST["minute"]=$duracionReservaMinutos;			//Duracion total- minutos (0-59)
    $_POST["hour"]=$duracionReservaHoras;				//Duracion total- horas (0-100)


    $datetime = date_create();

    $_POST["date"]=$datetime->format('Y-m-d H:i:s');				//Fecha
    $_POST["category"]="70";		//Categoria (Estructura arbol: Peticiones->Compras/Hw/Mantenimiento/Otros/Salas->Reservas "70")
    $_POST["priority"]="5";			//Prioridad ("Critica" "5"/"Alta" "4"/"Media" "3"/"Baja" "2")
    $_POST["request_type"]="4";		//Origen de la solicitud (E-mail/Telefono/"Directa" "4"/"Propia" "7"/"Otro" "6"))
    $_POST["service_type"]="3";		//Servicio afectado ("Reserva de salas" "3")
    $_POST["name"]="Reserva realizada por Sistema de Reservas";			//Título (Texto libre)
    $_POST["contents"]="Materia: ".$reservation->subject." Profesor: ".$reservation->owner->name;			//Descripcion: (Texto libre)
    //	$_POST["_followup"];
    //	$_POST["plan"];


    if(strnatcasecmp($reservation->lab->location,"medrano") == 0)
    {
        $_POST["location"]="123";		//Lugar ("Campus" "122"/"Medrano" "123")
    }else{
        $_POST["location"]="122";		//Lugar ("Campus" "122"/"Medrano" "123")
    }

    $_POST["device_type"]="1050";	//device_type	"Sala" "1050"


    $arrayLaboratorios = array(
        "Azul" => "4",
        "Verde" => "2",
        "Rojo" => "1",
        "Campus Lab" => "5",
        "Campus Lab II" => "6",
        "Multimedia" => "7"
    );

    $_POST["computer"]=$arrayLaboratorios[$reservation->lab->name];			//computer 	(variable q guarda en funcion al device_type)
    //			"Laboratorio Azul" 			"4"
    //			"Laboratorio Campus" 		"5"
    //			"Laboratorio Rojo" value=	"1"
    //			"Laboratorio Verde" 		"2"
    //			"Sala multimedia" 			"7"
    //			"Sala Servidores" 			"9"
    //			"WorkGroup Lab 1" value=	"3"
    //			"WorkGroup Lab 2" value=	"6"
    $_POST["state_reason"]="0";			//state_reason	Motivos para el estado  NO ASIGNADO EN GLPI
    $_POST["applicant"]="0";
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

    /******************************************************************************

    Definicion de la reserva

     ******************************************************************************/

    /*
        La tabla de donde toma los id de laboratorios para los tickets es distinta a la de las reservas
        para los siguientes laboratorios:
        "Laboratorio Azul" 			"4" -> "4"
        "Laboratorio Campus" 		"5" -> "8"
        "Laboratorio Rojo" value=	"1" -> "2"
        "Laboratorio Verde" 		"2" -> "3"
        "Sala multimedia" 			"7" -> "9"
        "Sala Servidores" 			"9" -> No asignada
        "WorkGroup Lab 1" value=	"3" -> "5"
        "WorkGroup Lab 2" value=	"6" -> "7"
    */
    switch ($_POST['computer']) {
        case '1':
            $_POST["items"] =  array("2");
            break;

        case '2':
            $_POST["items"] =  array("3");
            break;

        case '3':
            $_POST["items"] =  array("5");
            break;

        case '4':
            $_POST["items"] =  array("4");
            break;

        case '5':
            $_POST["items"] =  array("8");
            break;

        case '6':
            $_POST["items"] =  array("7");
            break;

        case '7':
            $_POST["items"] =  array("9");
            break;

        default:
            # code...
            break;
    }
    $_POST['begin'] = $reservation->beginDate->format('Y-m-d H:i:s');
    $_POST['end'] = $reservation->endDate->format('Y-m-d H:i:s');
    /*
        Comienzo y fin del uso del laboratorio, el primer día.
        Si se repite la reserva en dias o semanas sucesivas, usa el mismo horario.
        Ademas verifica la disponibilidad del recurso.
    */
    $_POST['periodicity'] = "day";			// Periodicidad: si va a contar periodicity_times por dia "day" o por semana "week"
    $_POST['periodicity_times'] = "1";			// La cantidad de reservas "efectivas" a realizar
    /*
        $_POST["periodicity"] = "week";
        $_POST["periodicity_times"] = 4; reserva 4 semanas seguidas

        $_POST["periodicity"] = "day";
        $_POST["periodicity_times"] = 4; reserva 4 dias seguidos
    */
    $_POST['comment'] = "Materia: ".$reservation->subject." Profesor: ".$reservation->owner->name;	// Comentario de la reserva
    $_POST['addReservation'] = "on";				// Crear la reserva


    include('../tickets/reservations/reservations.php');
}
}

$dbhandler->disconnect();
return;
?>