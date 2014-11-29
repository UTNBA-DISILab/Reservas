<?php
/**
* Tickets System subject information display
request:
GET

params:
none

return:
[{name:<string>, code:<string>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

$subjects = Subject::listAll($dbhandler);
$return = array();
if(is_array($subjects)) {
	foreach($subjects as &$subject) {
		$info = array("id"=>$subject->id,
					  "name"=>$subject->name,
					  "code"=>$subject->code);
		array_push($return, $info);
		unset($subject);
	}
}

echo json_encode(objToUTF8($return));

$dbhandler->disconnect();
return;
?>