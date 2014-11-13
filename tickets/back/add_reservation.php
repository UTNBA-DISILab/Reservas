<?php
/**
* Tickets System add reservation form
request:
POST

params:
- begin (timestamp)
- end (timestamp)
- lab_id
- amount
- subject_id
+ description
+ for_user_id

return:
nothing
*/
include_once 'utils/autoloader.php';
include_once 'utils/init_db.php';
include_once 'utils/user_session.php';

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
$begin = $jsonparams["begin"];
$end = $jsonparams["end"];
$lab_id = $jsonparams["lab_id"];
$amount = $jsonparams["amount"];
$for_owner_id = $jsonparams["for_user_id"];
$subject_id = $jsonparams["subject_id"];
$description = $jsonparams["description"];

if(!isset($begin )|| !isset($end) || !isset($lab_id) || 
   !isset($amount) || !isset($subject_id)) {
	returnError(500, "invalid params");
	return;
}

$beginDate = new DateTime();
$beginDate->setTimestamp($begin);
$endDate = new DateTime();
$endDate->setTimestamp($end);

//TODO chequear capacidad de laboratorio contra amount
$dbhandler = getDatabase();
$dbhandler->connect();

//check existing reservations in that time
$fields = array("begin_date", "end_date");
$minvalues = array(Reservation::sqlDateTime($beginDate), Reservation::sqlDateTime($beginDate));
$maxvalues = array(Reservation::sqlDateTime($endDate), Reservation::sqlDateTime($endDate));

$existing_reservations = Reservation::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);
if(!empty($existing_reservations)) {
	returnError(500, "invalid params");
	$dbhandler->disconnect();
	return;
}

//check owner
if(isset($for_owner_id)) {
	$owner = new User();
	$owner->id = $for_owner_id;
	if(!$owner->load($dbhandler)) {
		returnError(500, "invalid params");
		$dbhandler->disconnect();
		return;
	}
}

//check labs
$lab = new Lab();
$lab->id = $lab_id;
if(!$lab->load($dbhandler)) {
	returnError(500, "invalid params");
	$dbhandler->disconnect();
	return;
}

//check subject
$subject = new Subject();
$subject->id = $subject_id;
if(!$subject->load($dbhandler)) {
	returnError(500, "invalid params");
	$dbhandler->disconnect();
	return;
}

//push reservation
$reservation = new Reservation();
$reservation->lab = $lab;
$reservation->subject = $subject;
$reservation->studentsAmount = $amount;
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
$resState->state = 0;
$resState->description = $description;
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