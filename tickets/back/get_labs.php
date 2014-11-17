<?php
/**
* Tickets System labs information display
request:
GET

params:
none

return:
[{name:<string>, location:<string>, size:<string>, ..}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

$labs = Lab::listAll($dbhandler);

$return = array();
if(is_array($labs)) {
	foreach($labs as &$lab) {
		$labinfo = array("name"=>$lab->name,
						 "location"=>$lab->location,
						 "size"=>$lab->size);
		array_push($return, array_merge($labinfo, (array)$lab->specifications));
		unset($lab);
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