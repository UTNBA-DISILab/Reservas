<?php
/**
* Tickets System add terminal form
request:
POST

params:
- name
- ip

return:
nothing or error
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < USR_LVL_IN_ADM) {
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
if(isset($jsonparams["ip"])) {
	$ip = $jsonparams["ip"];
}

if(!isset($name )|| !isset($ip)) {
	returnError(500, "invalid params");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing name
$existing = new Terminal();
if($existing->loadUsingValues($dbhandler, array('name'), array($name))) {
	returnError(500, "invalid name");
	$dbhandler->disconnect();
	return;
}

//add terminal
$trm = new Terminal();
$trm->name = $name;
$trm->ip = $ip;
if(!$trm->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
}

$dbhandler->disconnect();
return;
?>