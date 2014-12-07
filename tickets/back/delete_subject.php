<?php
/**
* Tickets System delete subject form
request:
POST

params:
- subject_id

return:
nothing
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < USR_LVL_IN_USR) {
	returnError(401, "unauthorized");
	return;
}

if(!isset($_GET["subject_id"])) {
	returnError(500, "missing id");
	return;
}
$subject_id = $_GET["subject_id"];

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing subject

$subject = validateSubject($dbhandler, $subject_id);
if(!$subject) {
	returnError(404, "subject not found");
	$dbhandler->disconnect();
}

//delete subject
$subject->remove();
if(!$subject->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
}

$dbhandler->disconnect();
return;
?>