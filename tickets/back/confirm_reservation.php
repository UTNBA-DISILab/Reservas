<?php
/**
* Tickets System confirm reservation form
request:
POST

params:
- reservation_id
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

//check existing reservations in that time
$reservation = new Reservation();
$reservation->id = $res_id;
if(!$reservation->load($dbhandler)) {
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
	if($myUser->accessLvl < 1) {
		returnError(403, "invalid operation");
		$dbhandler->disconnect();
		return;
	}
	$reservation->validator = $myUser;
	$is_validator = true;
}

$state = RES_STATE_CONFIRMED;
if($is_validator && $oldstate == RES_STATE_APPROVED_BY_VALIDATOR) {
	$state = RES_STATE_APPROVED_BY_VALIDATOR;
}
if($is_owner && $oldstate == RES_STATE_APPROVED_BY_OWNER) {
	$state = RES_STATE_APPROVED_BY_OWNER;
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

$dbhandler->disconnect();
return;


//-----------------------------------------------------------

function returnError($error_code, $error_msg) {
	http_response_code($error_code);
	echo "Error:".$error_msg;
}
?>