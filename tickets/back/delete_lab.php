<?php
/**
* Tickets System delete lab form
request:
POST

params:
- lab_id

return:
nothing
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < USR_LVL_IN_USR) {
	returnError(401, "unauthorized");
	return;
}

if(!isset($_GET["lab_id"])) {
	returnError(500, "missing id");
	return;
}
$lab_id = $_GET["lab_id"];

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing reservations in that time
$lab = validateLab($dbhandler, $lab_id);
if(!$lab) {
	returnError(404, "lab not found");
	$dbhandler->disconnect();
}

//delete lab
$lab->remove();
if(!$lab->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
}

$dbhandler->disconnect();
return;
?>