<?php
/**
* Tickets System reservation information display
request:
GET

params:
- year
- month
- day
- offset (period length in days)
+ for_owner_id (id of user to retrieve info)

return:
[{"id":<int>, "begin":<datestr>, "end":<datestr>, "lab_id":<int>}, ..] or error string
*/
include_once 'utils/autoloader.php';
include_once 'utils/init_db.php';
include_once 'utils/user_session.php';

if(!isset($_GET["year"]) ||
   !isset($_GET["month"]) ||
   !isset($_GET["day"]) ||
   !isset($_GET["offset"])) {
   returnError(500, "missing values");
   return;
}
$year = $_GET["year"];
$month = $_GET["month"];
$day = $_GET["day"];

$days = $_GET["offset"];

$dbhandler = getDatabase();
$dbhandler->connect();

$owner = false;
$validator = false;
if(isset($_GET["for_owner_id"]) || isset($_GET["for_validator_id"])){
	$myUser = getUserFromSession();
	if(!$myUser) {
		returnError(401, "unauthorized");
		$dbhandler->disconnect();
		return;
	}
	if(isset($_GET["for_owner_id"])) {
		$owner = new User();
		$owner->id = $_GET["for_owner_id"];
		$owner->load($dbhandler);
		if(!$owner) {
			returnError(500, "invalid owner");
			$dbhandler->disconnect();
			return;
		}
	}
	if(isset($_GET["for_validator_id"])){
		$validator = new User();
		$validator->id = $_GET["for_validator_id"];
		$validator->load($dbhandler);
		if(!$validator) {
			returnError(500, "invalid validator");
			$dbhandler->disconnect();
			return;
		}
	}
}

$fromDate = new DateTime();
$toDate = new DateTime();
$fromDate->setDate($year, $month, $day);
$toDate->setDate($year, $month, $day);
$toDate->add(new DateInterval('P'.$days.'D'));

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
					  "begin"=>$reservation->beginDate,
					  "end"=>$reservation->endDate,
					  "lab_id"=>$reservation->lab->id);
		array_push($return, $info);
		unset($reservation);
	}
}

echo json_encode($return);

$dbhandler->disconnect();
return;


//-----------------------------------------------------------

function returnError($error_code, $error_msg) {
	http_response_code($error_code);
	echo "Error:".$error_msg;
}
?>