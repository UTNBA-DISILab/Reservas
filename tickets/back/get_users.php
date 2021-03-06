<?php
/**
* Tickets System subject information display
request:
GET

params:
+ user_id
+ level

return:
[{id:<int>,name:<string>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}
if(isset($_GET["user_id"])) {
	listId($_GET["user_id"]);
}
else {
	listAll();
}
 return;
//----------------------------------------------------

function listId($usr_id) {
	$dbhandler = getDatabase();
	$dbhandler->connect();
	
	$usr = validateUser($dbhandler, $usr_id);
	if(!$usr) {
		$return = array("id"=>$usr_id,
						"name"=>"Usuario",
						"email"=>"Usuario@Usuario");
		echo json_encode(objToUTF8($return));
		$dbhandler->disconnect();
		//returnError(404, "not found");
		//return;
	}
	$return = array("id"=>$usr->id,
					"name"=>$usr->name,
					"email"=>$usr->email);
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}

//----------------------------------------------------

function listAll() {
	$acclvl = USR_LVL_EX_USR;
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
						  "name"=>$usr->name);
			array_push($return, $info);
			unset($usr);
		}
	}

	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}
?>