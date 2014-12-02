<?php
/**
* Tickets System labs information display
request:
GET

params:
+ lab_id

return:
[{name:<string>, location:<string>, size:<string>, ..}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

if(isset($_GET["lab_id"])) {
	listId($_GET["lab_id"]);
}
else {
	listAll();
}
 return;
//----------------------------------------------------

function listId($lab_id) {
	$dbhandler = getDatabase();
	$dbhandler->connect();
	
	$lab = validateLab($dbhandler, $lab_id);
	if(!$lab) {
		returnError(404, "not found");
		return;
	}
	$labinfo = array("id"=>$lab->id,
					 "nombre"=>$lab->name,
					 "sede"=>$lab->location,
					 "cant_puestos"=>$lab->size);
	$return = array_merge($labinfo, (array)$lab->specifications));
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}

//----------------------------------------------------

function listAll() {
	$dbhandler = getDatabase();
	$dbhandler->connect();

	$labs = Lab::listAll($dbhandler);

	$return = array();
	if(is_array($labs)) {
		foreach($labs as &$lab) {
			$labinfo = array("id"=>$lab->id,
							 "nombre"=>$lab->name,
							 "sede"=>$lab->location,
							 "cant_puestos"=>$lab->size);
			array_push($return, array_merge($labinfo, (array)$lab->specifications));
			unset($lab);
		}
	}

	echo json_encode(objToUTF8($return));

	$dbhandler->disconnect();
}
?>