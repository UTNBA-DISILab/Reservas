<?php
/**
* Tickets System logout script
request:
POST

params:
None

return:
nothing or error string
*/
include_once 'utils/includes.php';

$myUser = getUserFromSession();
if(!$myUser) {
	returnError(401, "unauthorized");
	return;
}

//check if we have to log this logout on the system
if($myUser->accessLvl >= USR_LVL_IN_USR) {
	$dbhandler = getDatabase();
	$dbhandler->connect();
	// get ip
	$ip = (getenv("HTTP_X_FORWARDED_FOR") ? getenv("HTTP_X_FORWARDED_FOR") : getenv("REMOTE_ADDR"));
	$terminal = new Terminal();
	$success = $terminal->loadUsingValues($dbhandler, array("lan_ip_address"), array($terminal->ipToNumber($ip)));
	if($success) {
		$session = new Session();
		$session->user = $myUser;
		$session->terminal = $terminal;
		$session->operation = SES_LOGOUT; //logout code
		$ok = $session->commit($dbhandler);
		if(!$ok) {
			returnError(500, "server error");
			$dbhandler->disconnect();
			return;
		}
	}
	$dbhandler->disconnect();
} 
else{
if(RD_USE_SAML) {
    $auth->logout();
}
}

cleanSession();
return;
?>