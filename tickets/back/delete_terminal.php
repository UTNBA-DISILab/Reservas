<?php
/**
* Tickets System delete terminal form
request:
POST

params:
- terminal_id

return:
nothing
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < USR_LVL_IN_ADM) {
	returnError(401, "unauthorized");
	return;
}

if(!isset($_GET["terminal_id"])) {
	returnError(500, "missing id");
	return;
}
$trm_id = $_GET["terminal_id"];

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing reservations in that time
$trm = validateTerminal($dbhandler, $trm_id);
if(!$trm) {
	returnError(404, "terminal not found");
	$dbhandler->disconnect();
}

//delete terminal
$trm->remove();
if(!$trm->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
}

$dbhandler->disconnect();
return;
?>