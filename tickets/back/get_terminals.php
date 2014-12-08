<?php
/**
* Tickets System terminal information display
request:
GET

params:
+ terminal_id

return:
[{name:<string>, ip:<string>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < USR_LVL_IN_USR) {
	returnError(401, "unauthorized");
	return;
}

if(isset($_GET["terminal_id"])) {
	listId($_GET["terminal_id"]);
}
else {
	listAll();
}
 return;


//----------------------------------------------------

function listId($trm_id) {
	$dbhandler = getDatabase();
	$dbhandler->connect();
	
	$trm = validateTerminal($dbhandler, $trm_id);
	if(!$trm) {
		returnError(404, "not found");
		return;
	}
	$return = array("id"=>$trm->id,
				 "nombre"=>$trm->name,
				 "ip"=>$trm->ip);
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}

//----------------------------------------------------

function listAll() {
	$dbhandler = getDatabase();
	$dbhandler->connect();

	$terminals = Terminal::listAll($dbhandler);

	$return = array();
	if(is_array($terminals)) {
		foreach($terminals as &$trm) {
			$trminfo = array("id"=>$trm->id,
							 "nombre"=>$trm->name,
							 "ip"=>$trm->ip);
			array_push($return, $trminfo);
			unset($trm);
		}
	}
	echo json_encode(objToUTF8($return));
	$dbhandler->disconnect();
}
?>