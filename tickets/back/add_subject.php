<?php
/**
* Tickets System add subject form
request:
POST

params:
- name
- code

return:
nothing or error
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < 1) {
	returnError(401, "unauthorized");
	return;
}

$body = file_get_contents('php://input');
if(!isset($body)) {
	returnError(500, "invalid params");
	return;
}

$jsonparams = json_decode($body, true);
if(!$jsonparams) {
	returnError(500, "invalid params");
	return;
}
if(isset($jsonparams["name"])) {
	$name = $jsonparams["name"];
}
if(isset($jsonparams["code"])) {
	$code = $jsonparams["code"];
}

if(!isset($name )|| !isset($code)) {
	returnError(500, "invalid params");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing code
$existing = new Subject();
if($existing->loadUsingValues($dbhandler, array('code'), array($code))) {
	returnError(500, "invalid name");
	$dbhandler->disconnect();
	return;
}

//add subject
$subject = new Subject();
$subject->name = $name;
$subject->code = $code;
if(!$subject->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
}

$dbhandler->disconnect();
return;
?>