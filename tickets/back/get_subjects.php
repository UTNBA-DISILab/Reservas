<?php
/**
* Tickets System subject information display
request:
GET

params:
+ subject_id

return:
[{name:<string>, code:<string>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

if(isset($_GET["subject_id"])) {
	listId($_GET["subject_id"]);
}
else {
	listAll();
}
 return;
//----------------------------------------------------

function listId($sbj_id) {
	$dbhandler = getDatabase();
	$dbhandler->connect();
	
	$subject = validateSubject($dbhandler, $sbj_id);
	if(!$subject) {
		returnError(404, "not found");
		return;
	}
	$return = array("id"=>$subject->id,
				    "name"=>$subject->name,
					"career"=>$subject->career,
				    "code"=>$subject->code);
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}

//----------------------------------------------------

function listAll() {
	$dbhandler = getDatabase();
	$dbhandler->connect();

	$subjects = Subject::listAll($dbhandler);
	$return = array();
	if(is_array($subjects)) {
		foreach($subjects as &$subject) {
			$found = false;
			foreach($return as &$cr) {
				if(strcmp($cr["name"],$subject->career)==0) { 
					$found = true;
					break;
				}
				unset($cr);
			}
			if(!$found) {
				$cr = array("name"=>$subject->career, "subjects"=>array());
			}
			$info = array("id"=>$subject->id,
						  "name"=>$subject->name,
						  "code"=>$subject->code);
			array_push($cr["subjects"], $info);
			if(!$found) {
				array_push($return, $cr);
				unset($cr);
			}
			unset($subject);
		}
	}
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}
?>