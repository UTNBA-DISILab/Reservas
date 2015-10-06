<?php
/**
* Tickets System add reservation form
request:
POST

params:
- begin (timestamp)
- end (timestamp)
- lab_id
- subject
+ description
+ for_user_id

return:
nothing
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

$body = file_get_contents('php://input');
if(!isset($body)) {
	returnError(500, "invalid params");
	return;
}

$jsonparams = json_decode($body, true);

if(!$jsonparams) {
	returnError(500, "invalid params");
	return;
}
if(isset($jsonparams["begin"])) {
	$begin = $jsonparams["begin"];
}
if(isset($jsonparams["end"])) {
	$end = $jsonparams["end"];
}
if(isset($jsonparams["lab_id"])) {
	$lab_id = $jsonparams["lab_id"];
}
if(isset($jsonparams["subject"])) {
	$subject = $jsonparams["subject"];
}
if(isset($jsonparams["description"])) {
	$description = $jsonparams["description"];
}
if(isset($jsonparams["for_user_id"])) {
	$for_owner_id = $jsonparams["for_user_id"];
}

if(!isset($begin )|| !isset($end) || !isset($lab_id) || 
   !isset($subject)) {
	returnError(500, "invalid params");
	return;
}

$beginDate = DateTime::createFromFormat('U', $begin / 1000);
$endDate = DateTime::createFromFormat('U', $end / 1000);




$dbhandler = getDatabase();
$dbhandler->connect();

//check labs
$lab = validateLab($dbhandler, $lab_id);
if(!$lab) {
	returnError(500, "invalid params");
	$dbhandler->disconnect();
	return;
}

//check existing reservations in that time
$fields = array("begin_date", "end_date");
$minvalues = array(Reservation::sqlDateTime($beginDate), Reservation::sqlDateTime($beginDate));
$maxvalues = array(Reservation::sqlDateTime($endDate), Reservation::sqlDateTime($endDate));


$existing_reservations = Reservation::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);
if(!empty($existing_reservations)) {
	foreach($existing_reservations as &$r) {
		if($r->lab->id == $lab_id) {
			$rstate = ReservationState::getLatestForReservationId($dbhandler, $r->id);
			if($rstate->state == RES_STATE_CONFIRMED) {
				returnError(500, "invalid params");
				$dbhandler->disconnect();
				return;
			}
		}
	}
}

//check owner
if(isset($for_owner_id)) {
	$owner = validateUser($dbhandler, $for_owner_id);
	if(!$owner) {
		returnError(500, "invalid params");
		$dbhandler->disconnect();
		return;
	}
}
/* subjects are not validated because only the 'sistemas' ones are present in the database
//check subject
$subject = validateSubject($dbhandler, $subject_id);
if(!$subject) {
	returnError(500, "invalid params");
	$dbhandler->disconnect();
	return;
}
*/
//push reservation
$reservation = new Reservation();
$reservation->lab = $lab;
$reservation->subject = $subject;
$reservation->beginDate = $beginDate;
$reservation->endDate = $endDate;
if(isset($owner)) {
	$reservation->owner = $owner;
	$reservation->validator = $myUser;
} else {
	$reservation->owner = $myUser;
}
$reservation->commit($dbhandler);

//push reservation state
$resState = new ReservationState();
$resState->reservation = $reservation;
if(isset($owner)) {
	$resState->state = RES_STATE_CONFIRMED;
	$confirmacionMail = true;	
} else {
	$resState->state = RES_STATE_APPROVED_BY_OWNER;
	$confirmacionMail = false;	
}

if(isset($description)) {
	$resState->description = $description;
}
$resState->user = $myUser;
$resState->commit($dbhandler);

if ($confirmacionMail) {
	//FALTA EL TICKET NUMBER
	enviarMail('confirmacionReserva', $owner, $lab, $beginDate, $endDate, $subject, 123654);
	//confirmacionReservaMail($owner, $lab, $beginDate, $endDate, $subject);
} else {
	enviarMail('avisoPedidoAlLaboratorio', $myUser, $lab, $beginDate, $endDate, $subject, 0);
	//avisoPedidoAlLaboratorioMail($myUser, $lab, $beginDate, $endDate, $subject);
}


$dbhandler->disconnect();
return;
?>