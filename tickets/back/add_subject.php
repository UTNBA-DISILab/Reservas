<?php
/**
* Tickets System add subject form
request:
POST

params:
- name
- career
- code

return:
nothing or error
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < USR_LVL_IN_USR) {
	returnError(401, "unauthorized");
	return;
}

$body = file_get_contents('php://input');
if(!isset($body)) {
	returnError(500, "invalid params1");
	return;
}

$jsonparams = json_decode($body, true);
if(!$jsonparams) {
	returnError(500, "invalid params2");
	return;
}
if(isset($jsonparams["name"])) {
	$name = $jsonparams["name"];
}
if(isset($jsonparams["career"])) {
	$career = $jsonparams["career"];
}
if(isset($jsonparams["code"])) {
	$code = $jsonparams["code"];
}

if(!isset($name )|| !isset($code)) {
	returnError(500, "invalid params3");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing code
$existing = new Subject();
if($existing->loadUsingValues($dbhandler, array('code'), array($code))) {
	returnError(500, "invalid name4");
	$dbhandler->disconnect();
	return;
}

//add subject
$subject = new Subject();
$subject->name = $name;
$subject->career = $career;
$subject->code = $code;
if(!$subject->commit($dbhandler)) {
	returnError(500, "server error5");
	$dbhandler->disconnect();
	return;
}

$dbhandler->disconnect();
return;
?>