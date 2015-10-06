<?php
/**
* Tickets System reservation information display
request:
GET

params:
- begin (timestamp)
- end (timestamp)

return:
[{"id":<int>, "begin":<datestr>, "end":<datestr>, "lab_id":<int>}, ..] or error string
*/
include_once 'utils/includes.php';

listAll();
 return;

function listAll() {
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
	$open_only = false;
	if(isset($_GET["open_only"])) {
		$myUser = getUserFromSession();
		if(!$myUser) {
			returnError(401, "unauthorized");
			return;
		}
		$open_only = true;
		$level = $myUser->accessLvl;
		if($level == USR_LVL_EX_USR) {
			$owner = $myUser;
		}
	}

	$beginDate = DateTime::createFromFormat('U', $begin / 1000);
	$endDate = DateTime::createFromFormat('U', $end / 1000);

	$fields = array("begin_date");
	$minvalues = array(Reservation::sqlDateTime($beginDate));
	$maxvalues = array(Reservation::sqlDateTime($endDate));

	if($owner) {
		array_push($fields, "owner_id");
		array_push($minvalues, $owner->id);
		array_push($maxvalues, $owner->id);
	}


	$reservations = Reservation::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);

	$return = array();
	if(is_array($reservations)) {
		foreach($reservations as &$reservation) {
			$info = array("id"=>$reservation->id,
						  "begin"=>$reservation->beginDate->getTimestamp() * 1000,
						  "end"=>$reservation->endDate->getTimestamp() * 1000,
						  "lab_id"=>$reservation->lab->id,
						  "owner_id"=>$reservation->owner->id,
						  "subject"=>$reservation->subject);
			$rstate = ReservationState::getFirstForReservationId($dbhandler, $reservation->id);
			$info["creation_date"]=$rstate->datetime->getTimestamp() * 1000;
			unset($rstate);
			$rstate = ReservationState::getLatestForReservationId($dbhandler, $reservation->id);
			
			if($rstate) {
				$info["state"]= $rstate->state;
				$info["description"]= $rstate->description;
			}

			array_push($return, $info);
			unset($reservation);
		}
	}

	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}
?>