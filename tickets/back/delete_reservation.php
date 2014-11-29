<?php
/**
* Tickets System delete reservation form
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
$reservation = validateReservation($dbhandler, $res_id);
if(!$reservation) {
	returnError(404, "reservation not found");
	$dbhandler->disconnect();
}

//push reservation state
$resState = new ReservationState();
$resState->reservation = $reservation;
$resState->state = RES_STATE_CLOSED;
if(isset($description)) {
	$resState->description = $description;
}
$resState->user = $myUser;
$resState->commit($dbhandler);

$dbhandler->disconnect();
return;
?>