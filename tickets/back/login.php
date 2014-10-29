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
include_once 'glpi_authorize.php';

$username = "";
$password = "";
$from_sigma = false;
$from_glpi = false;

if(isset($_GET["username"])) {
	$username = $_GET["username"];
}
if(isset($_GET["password"])) {
	$password = $_GET["password"];
}
if(isset($_GET["from_sigma"])) {
	$from_sigma = $_GET["from_sigma"];
}
if(isset($_GET["from_glpi"])) {
	$from_glpi = $_GET["from_glpi"];
}

if(empty($username) || empty($password)) {
	returnError(500, "missing username or password");
	return;
}

if($from_sigma == $from_glpi) {
	returnError(500, "undefined login network");
	return;
}

$user_data = false;
if($from_sigma) {
	$user_data = loginSigmaUser($username, $password);
}
if($from_glpi) {
	$user_data = loginGLPIUser($username, $password);
}

if(!$user_data) {
	returnError(401, "invalid user");
	return;
}

$dbhandler = getDatabase();
$dbhandler->connect();

$fields = array();
$params = array();
if($from_glpi) {
	array_push($fields, 'glpi_user_id');
	array_push($params, $user_data["id"]);
}
if($from_sigma) {
	array_push($fields, 'sigma_user_id');
	//array_push($params, $user_data["id"]);	//TODO get sigma id
}

$user = new User();
$success = $user->loadUsingValues($dbhandler, $fields, $params);
if(!$success) {
//must add
	if($from_glpi) {
		$user->name = $user_data["name"];
		$user->surname = $user_data["surname"];
		$user->glpiId = $user_data["id"];
		$user->accessLvl = $user_data["level"];
	}
	if($from_sigma) {
		$user->name = $username; //$user_data[?]; TODO verify against real user_data
		//$user->surname = $user_data[?]; TODO verify against real user_data
		//$user->sigmaId = $user_data[?]; TODO verify against real user_data
		$user->accessLvl = 0;
	}
	$user->commit($dbhandler);
}
//check if we have to log this login on the system
if($user->accessLvl > 0) {
	// get ip
	$ip = (getenv("HTTP_X_FORWARDED_FOR") ? getenv("HTTP_X_FORWARDED_FOR") : getenv("REMOTE_ADDR"));
	$terminal = new Terminal();
	$success = $terminal->loadUsingValues($dbhandler, array("lan_ip_address"), array($terminal->ipToNumber($ip)));
	if($success) {
		$session = new Session();
		$session->user = $user;
		$session->terminal = $terminal;
		$session->operation = 0; //login code
		$ok = $session->commit($dbhandler);
		if(!$ok) {
			returnError(500, "server error");
			$dbhandler->disconnect();
			return;
		}
	}
}
$response = array('access_level'=>$user->accessLvl);
echo json_encode($response);

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