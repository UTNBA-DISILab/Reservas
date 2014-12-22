<?php
/**
* Tickets System connection information display
request:
GET

params:
+ user_id  (for specific user info)
+ terminal_id (for specific terminal info)

- begin (timestamp)
- end (timestamp)

return:
[{"user_id":<int>, "time":<datestr>, "action":<string>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl == USR_LVL_EX_USR) {
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

$user = false;
if(isset($_GET["user_id"])) {
	$user = validateUser($dbhandler, $_GET["user_id"]);
	if(!$user) {
		returnError(500, "invalid user");
		$dbhandler->disconnect();
		return;
	}
}

$terminal = false;
if(isset($_GET["terminal_id"])) {
	$terminal = validateTerminal($dbhandler, $_GET["terminal_id"]);
	if(!$terminal) {
		returnError(500, "invalid user");
		$dbhandler->disconnect();
		return;
	}
}

$beginDate = DateTime::createFromFormat('U', $begin / 1000);
$endDate = DateTime::createFromFormat('U', $end / 1000);

$fields = array("date");
$minvalues = array(Reservation::sqlDateTime($beginDate));
$maxvalues = array(Reservation::sqlDateTime($endDate));

if($user) {
	array_push($fields, "user_id");
	array_push($minvalues, $user->id);
	array_push($maxvalues, $user->id);
}

if($terminal) {
	array_push($fields, "terminal_id");
	array_push($minvalues, $terminal->id);
	array_push($maxvalues, $terminal->id);
}


$sessions = Session::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);

$return = array();
if(is_array($sessions)) {
	foreach($sessions as &$session) {
		$session->user->load($dbhandler);
		$session->terminal->load($dbhandler);
		
		$info = array("id"=>$session->id,
					  "date"=>$session->datetime->getTimestamp() * 1000,
					  "user"=>$session->user->name,
					  "terminal"=>$session->terminal->ip,
					  "openration"=>($session->operation == SES_LOGIN)?"login":"logout");
		array_push($return, $info);
		unset($session);
	}
}

echo json_encode(objToUTF8($return));
$dbhandler->disconnect();
?>