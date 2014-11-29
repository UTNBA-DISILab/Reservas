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
if(!$myUser || myUser->accessLvl < 1) {
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
$lab = new Lab();
$lab->id = $lab_id;
if(!$lab->load($dbhandler)) {
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


//-----------------------------------------------------------

function returnError($error_code, $error_msg) {
	http_response_code($error_code);
	echo "Error:".$error_msg;
}
?>