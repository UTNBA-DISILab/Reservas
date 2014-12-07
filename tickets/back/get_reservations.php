<?php
/**
* Tickets System reservation information display
request:
GET

params:
+ reservation_id  (for unique reservation info)

- begin (timestamp)
- end (timestamp)
+ for_owner_id (id of user to retrieve info)
+ for_validator_id (id of user to retrieve info)
+ pending_approval (boolean)

return:
[{"id":<int>, "begin":<datestr>, "end":<datestr>, "lab_id":<int>}, ..] or error string
*/
include_once 'utils/includes.php';

if(isset($_GET["reservation_id"])) {
	listId($_GET["reservation_id"]);
}
else {
	listAll();
}
 return;
//----------------------------------------------------

function listId($res_id) {
	$dbhandler = getDatabase();
	$dbhandler->connect();
	
	$reservation = validateReservation($dbhandler, $res_id);
	if(!$reservation) {
		returnError(404, "not found");
		return;
	}
	$return = array("id"=>$reservation->id,
				    "begin"=>$reservation->beginDate->getTimestamp(),
				    "end"=>$reservation->endDate->getTimestamp(),
				    "lab_id"=>$reservation->lab->id,
					"owner_id"=>$reservation->owner->id,
					"validator_id"=>$reservation->validator->id);
	$rstate = ReservationState::getLatestForReservationId($dbhandler, $res_id);
	if($rstate) {
		$return["state"]= $rstate->state;
	}
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}

//----------------------------------------------------

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
	$state = RES_STATE_CONFIRMED;
	if(isset($_GET["open_only"])) {
		$myUser = getUserFromSession();
		if(!$myUser) {
			returnError(401, "unauthorized");
			return;
		}
		$level = $myUser->accessLvl;
		if($level == USR_LVL_EX_USR) {
			$state = false;
			$owner = $myUser;
		}
		else {
			$state = RES_STATE_APPROVED_BY_OWNER;
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


	$reservations = Reservation::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);

	$return = array();
	if(is_array($reservations)) {
		foreach($reservations as &$reservation) {
			$info = array("id"=>$reservation->id,
						  "begin"=>$reservation->beginDate->getTimestamp(),
						  "end"=>$reservation->endDate->getTimestamp(),
						  "lab_id"=>$reservation->lab->id);
			$rstate = ReservationState::getLatestForReservationId($dbhandler, $reservation->id);
			if(!$state || ($state && $state == $rstate->state) {
				if($rstate) {
					$info["state"]= $rstate->state;
				}
				array_push($return, $info);
			}
			unset($reservation);
		}
	}

	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}
?>