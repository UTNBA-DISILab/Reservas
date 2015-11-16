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
				    "begin"=>$reservation->beginDate->getTimestamp() * 1000,
				    "end"=>$reservation->endDate->getTimestamp() * 1000,
				    "lab_id"=>$reservation->lab->id,
					"owner_id"=>$reservation->owner->id,
					"validator_id"=>$reservation->validator->id,
					"subject"=>$reservation->subject);
	$rstate = ReservationState::getFirstForReservationId($dbhandler, $reservation->id);
	if($rstate) {
		$return["creation_date"]=$rstate->datetime->getTimestamp() * 1000;
	}
	unset($rstate);
	$rstate = ReservationState::getLatestForReservationId($dbhandler, $res_id);
	if($rstate) {
		$return["state"]= $rstate->state;
		$return["description"]= $rstate->description;
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
			if((!$open_only && ($rstate->state == RES_STATE_CONFIRMED)) ||
			   ($open_only && ($rstate->state == RES_STATE_APPROVED_BY_OWNER || 
							   $rstate->state == RES_STATE_APPROVED_BY_VALIDATOR))) {
				if($rstate) {
					$info["state"]= $rstate->state;
					$info["description"]= $rstate->description;
				}
				array_push($return, $info);
			}
			unset($reservation);
		}
	}

	include_once 'get_glpi_reservations.php';
	$from_glpi_resa = [];
	if(!isset($_GET["open_only"])) {
		$from_glpi_resa = get_glpi_reservations($begin,$end);
	}	

	$printable = print_r($from_glpi_resa, true);
	error_log("FROM_GLPI_RESA");
	error_log($printable);

	$merged_return = array_merge($return, $from_glpi_resa);
	
	$printable = print_r($merged_return, true);
	error_log("MERGE_RETURN");
	error_log($printable);

	$full_return=[];

	if(!empty($from_glpi_resa)){
		foreach($merged_return as &$node){
			$eval_array = array_filter($full_return, array(new Check_Filter($node['begin'], $node['end'], $node['lab_id']), 'date_lab_filter'));
			if(empty($eval_array)){
				array_push($full_return, $node);
			}
		}
	}else{
		$full_return = $merged_return;
	}

	$printable = print_r($full_return, true);
	error_log("FULL_RETURN");
	error_log($printable);

	echo json_encode(objToUTF8($full_return));
	$dbhandler->disconnect();
}

class Check_filter {
        private $beginDate;
        private $endDate;
        private $lab_id;

        function __construct($beginDate, $endDate, $lab_id) {
                $this->beginDate = $beginDate;
                $this->endDate = $endDate;
                $this->lab_id = $lab_id;
        }

        function date_lab_filter($node) {
                
                return $node['begin'] == $this->beginDate && $node['end'] == $this->endDate && $node['lab_id'] == $this->lab_id;

        }
}
?>