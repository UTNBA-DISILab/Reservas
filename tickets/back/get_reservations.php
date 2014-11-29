<?php
/**
* Tickets System reservation information display
request:
GET

params:
- begin (timestamp)
- end (timestamp)
+ for_owner_id (id of user to retrieve info)

return:
[{"id":<int>, "begin":<datestr>, "end":<datestr>, "lab_id":<int>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

if(!isset($_GET["begin"]) ||
   !isset($_GET["end"])) {
   returnError(500, "missing values");
   return;
}
$begin = $_GET["begin"];
$end = $_GET["end"];

$dbhandler = getDatabase();
$dbhandler->connect();

$owner = false;
$validator = false;
if(isset($_GET["for_owner_id"]) || isset($_GET["for_validator_id"])){
	if(isset($_GET["for_owner_id"])) {
		$owner = validateUser($dbhandler, $_GET["for_owner_id"]);
		if(!$owner) {
			returnError(500, "invalid owner");
			$dbhandler->disconnect();
			return;
		}
	}
	if(isset($_GET["for_validator_id"])){
		$validator = validateUser($dbhandler, $_GET["for_validator_id"]) ;
		if(!$validator) {
			returnError(500, "invalid validator");
			$dbhandler->disconnect();
			return;
		}
	}
}

$fromDate = new DateTime();
$fromDate->setTimestamp($begin);
$toDate = new DateTime();
$toDate->setTimestamp($end);

$fields = array("begin_date");
$minvalues = array(Reservation::sqlDateTime($fromDate));
$maxvalues = array(Reservation::sqlDateTime($toDate));

if($owner) {
	array_push($fields, "owner_id");
	array_push($minvalues, $owner->id);
	array_push($maxvalues, $owner->id);
}
if($validator) {
	array_push($fields, "validator_id");
	array_push($minvalues, $validator->id);
	array_push($maxvalues, $validator->id);
}


$reservations = Reservation::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);

$return = array();
if(is_array($reservations)) {
	foreach($reservations as &$reservation) {
		$info = array("id"=>$reservation->id,
					  "begin"=>$reservation->beginDate->getTimestamp(),
					  "end"=>$reservation->endDate->getTimestamp(),
					  "lab_id"=>$reservation->lab->id);
		$rstate = ReservationState::getLatestForReservationId($dbhandler, $reservation->id);
		if($rstate) {
			$info["state"]= $rstate->state;
		}
		array_push($return, $info);
		unset($reservation);
	}
}

echo json_encode(objToUTF8($return));

$dbhandler->disconnect();
return;
?>