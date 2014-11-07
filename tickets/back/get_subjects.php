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
include_once 'utils/autoloader.php';
include_once 'utils/init_db.php';

$dbhandler = getDatabase();
$dbhandler->connect();

$subjects = Subject::listAll($dbhandler);

$return = array();
if(is_array($subjects)) {
	foreach($subjects as &$subject) {
		$info = array("name"=>$subject->name,
					  "code"=>$subject->code);
		array_push($return, $info);
		unset($subject);
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