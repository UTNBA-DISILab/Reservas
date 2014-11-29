<?php
/**
* Tickets System terminal information display
request:
GET

params:
none

return:
[{name:<string>, ip:<string>}, ..] or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser || $myUser->accessLvl < 1) {
	returnError(401, "unauthorized");
	return;
}

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
return;
?>