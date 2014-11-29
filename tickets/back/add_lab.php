<?php
/**
* Tickets System add lab form
request:
POST

params:
- name
- location
- size
+ other params saved in specifications

return:
nothing or error
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || myUser->accessLvl < 1) {
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
	unset($jsonparams["name"]);
}
if(isset($jsonparams["location"])) {
	$location = $jsonparams["location"];
	unset($jsonparams["location"]);
}
if(isset($jsonparams["size"])) {
	$size = $jsonparams["size"];
	unset($jsonparams["size"]);
}
if(!empty(array_keys($jsonparams))) {
	$extra = $jsonparams;
}

if(!isset($name )|| !isset($location) || !isset($size)) {
	returnError(500, "invalid params");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

//check existing name
$existing = new Lab();
if($existing->loadUsingValues($dbhandler, array('name'), array($name))) {
	returnError(500, "invalid name");
	$dbhandler->disconnect();
	return;
}

//add labs
$lab = new Lab();
$lab->name = $name;
$lab->location = $location;
$lab->size = $size;
if(isset($extra)) {
	$lab->specifications = $extra;
}
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