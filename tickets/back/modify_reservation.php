<?php
/**
* Tickets System add reservation form
request:
POST

params:
- reservation_id
+ begin (timestamp)
+ end (timestamp)
+ lab_id
+ subject_id
+ description

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
$reservation_id = $_GET["res_id"];

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
if(isset($jsonparams["subject_id"])) {
	$subject_id = $jsonparams["subject_id"];
}
if(isset($jsonparams["description"])) {
	$description = $jsonparams["description"];
}

if(!isset($description)) {
	$description = "";
}

if(!isset($reservation_id )) {
	returnError(500, "invalid aprams");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

$reservation = new Reservation();
$reservation->id = $reservation_id;
if(!$reservation->load($dbhandler)) {
	returnError(500, "invalid params");
	$dbhandler->disconnect();
	return;
}

if(isset($subject_id)) {
	$result = validateSubject($dbhandler, $subject_id);
	if(!$result) {
		returnError(500, "invalid params");
		$dbhandler->disconnect();
		return;
	}
	$reservation->subject = $result;
}

if(isset($lab_id)) {
	$result = validateLab($dbhandler, $lab_id);
	if(!$result) {
		returnError(500, "invalid params");
		$dbhandler->disconnect();
		return;
	}
	$reservation->lab = $result;
}

if(isset($begin)) {
	$beginDate = new DateTime();
	$beginDate->setTimestamp($begin);
}
if(isset($end)) {	
	$endDate = new DateTime();
	$endDate->setTimestamp($end);
}

if(isset($beginDate) || isset($endDate)) {
	if(!isset($beginDate)) {
		$beginDate = $reservation->beginDate;
	}
	if(!isset($endDate)) {
		$endDate = $reservation->endDate;
	}
	if(!validateTime($dbhandler, $reservation, $beginDate, $endDate)) {
		returnError(500, "invalid params");
		$dbhandler->disconnect();
		return;
	}
	$reservation->beginDate = $beginDate;
	$reservation->endDate = $endDate;
}

//change state
$is_owner = $myUser->id == $reservation->owner->id;
$is_validator = $myUser->id == $reservation->validator->id;
if(!$is_owner && !$is_validator) {
	//check if can be a new validator
	if($myUser->accessLvl < 1) {
		returnError(403, "invalid operation");
		$dbhandler->disconnect();
		return;
	}
	$reservation->validator = $myUser;
	$is_validator = true;
}
$state = RES_STATE_APPROVED_BY_OWNER;
if($is_validator) {
	$state = RES_STATE_APPROVED_BY_VALIDATOR;
}

//push reservation state
$resState = new ReservationState();
$resState->reservation = $reservation;
$resState->state = $state;
$resState->description = $description;
$resState->user = $myUser;
$resState->commit($dbhandler);

//update reservation
$reservation->commit($dbhandler);

$dbhandler->disconnect();
return;


//-----------------------------------------------------------

function validateTime(&$dbhandler, &$reservation, $beginDate, $endDate) {
//check existing reservations in that time
	$fields = array("begin_date", "end_date");
	$minvalues = array(Reservation::sqlDateTime($beginDate), Reservation::sqlDateTime($beginDate));
	$maxvalues = array(Reservation::sqlDateTime($endDate), Reservation::sqlDateTime($endDate));

	$existing_reservations = Reservation::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);
	if(!empty($existing_reservations)) {
		foreach($reservations as &$r) {
			if($r->id != $reservation->id && 
			   $r->lab->id == $reservation->lab->id) {
				$rstate = ReservationState::getLatestForReservationId($dbhandler, $r->id);
				if($rstate->state != RES_STATE_CLOSED) {
					return false;
				}
			}
		}
	}
	return true;
}
?>