<?php
/**
* Tickets System subject information display
request:
GET

params:
level

return:
[{id:<int>,name:<string>, surname:<string>}, ..] or error string
*/
include_once 'utils/autoloader.php';
include_once 'utils/init_db.php';

$acclvl = 0;
if(isset($_GET["level"])) {
	$acclvl = $_GET["level"];
}

$fields = array("access_level");
$values = array($acclvl);

$dbhandler = getDatabase();
$dbhandler->connect();

$usrs = User::listAll($dbhandler, $fields, $values);

$return = array();
if(is_array($usrs)) {
	foreach($usrs as &$usr) {
		$info = array("id"=>$usr->id,
					  "name"=>$usr->name,
					  "surname"=>$usr->surname);
		array_push($return, $info);
		unset($usr);
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