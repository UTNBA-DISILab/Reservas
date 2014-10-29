<?php
/**
* Tickets System login script
params:
- username
- password
- from_sigma (optional)#
- from_glpi (optional)#
 # one of this fields must be included in order to autenticate user
*/
include_once 'autoloader.php';
include_once 'init_db.php';

$user_id = "";

if(isset($_GET["user_id"])) {
	$user_id = $_GET["user_id"];
}

if(empty($user_id)) {
	returnError(500, "missing user_id");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

$user = new User();
$user->id = $user_id;
$success = $user->load($dbhandler);
if(!$success) {
	returnError(401, "invalid user");
	$dbhandler->disconnect();
	return;
}
//check if we have to log this logout on the system
if($user->accessLvl > 0) {
	// get ip
	$ip = (getenv("HTTP_X_FORWARDED_FOR") ? getenv("HTTP_X_FORWARDED_FOR") : getenv("REMOTE_ADDR"));
	$terminal = new Terminal();
	$success = $terminal->loadUsingValues($dbhandler, array("lan_ip_address"), array($terminal->ipToNumber($ip)));
	if($success) {
		$session = new Session();
		$session->user = $user;
		$session->terminal = $terminal;
		$session->operation = 1; //logout code
		$ok = $session->commit($dbhandler);
		if(!$ok) {
			returnError(500, "server error");
			$dbhandler->disconnect();
			return;
		}
	}
}
$dbhandler->disconnect();
return;


//-----------------------------------------------------------

function loginSigmaUser($username, $password) {
	//TODO validation against SIGMA
	//return SIGMA data
	return false;
}

function loginGLPIUser($username, $password) {
	return authorizeGLPIUser($username, $password);
}

function returnError($error_code, $error_msg) {
	http_response_code($error_code);
	echo "Error:".$error_msg;
}
?>