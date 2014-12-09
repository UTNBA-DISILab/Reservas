<?php
/**
* Tickets System login script
request:
POST

params:
- username
- password
- from_sigma (optional)#
- from_glpi (optional)#
 # one of this fields must be included in order to autenticate user
 
return:
{"id":<id>,"access_level":<int>} or error string if error
*/

include_once 'utils/includes.php';
include_once 'utils/glpi_authorize.php';

$username = "";
$password = "";
$from_sigma = false;
$from_glpi = false;
if(isset($_SERVER["PHP_AUTH_USER"])) {
	$username = $_SERVER["PHP_AUTH_USER"];
}
if(isset($_SERVER["PHP_AUTH_PW"])) {
	$password = $_SERVER["PHP_AUTH_PW"];
}
if(isset($_GET["from_sigma"])) {
	$from_sigma = $_GET["from_sigma"];
}
if(isset($_GET["from_glpi"])) {
	$from_glpi = $_GET["from_glpi"];
}
if($from_sigma == $from_glpi) {
	returnError(500, "undefined login network");
	return;
}

if($from_glpi) {
	if(empty($username) || empty($password)) {
		returnError(500, "missing username or password");
		return;
	}
}

$user_data = false;
if($from_sigma) {
	$user_data = loginSigmaUser();
}
if($from_glpi) {
	$user_data = loginGLPIUser($username, $password);
}

if(!$user_data) {
	returnError(401, "invalid username or password");
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
	array_push($params, $user_data["id"]);	//TODO get sigma id
}

$user = new User();
$success = $user->loadUsingValues($dbhandler, $fields, $params);
if(!$success) {
//must add
	if($from_glpi) {
		$user->name = $user_data["name"];
		$user->glpiId = $user_data["id"];
		$user->accessLvl = $user_data["level"];
		$user->email = $user_data["email"];
	}
	if($from_sigma) {
		$user->name = $user_data["name"];
		$user->sigmaId = $user_data["id"];
		$user->email = $user_data["email"];
		$user->accessLvl = 0;
	}
	$user->commit($dbhandler);
}
//check if we have to log this login on the system
if($user->accessLvl >= USR_LVL_IN_USR) {
	// get ip
	$ip = (getenv("HTTP_X_FORWARDED_FOR") ? getenv("HTTP_X_FORWARDED_FOR") : getenv("REMOTE_ADDR"));
	$terminal = new Terminal();
	$success = $terminal->loadUsingValues($dbhandler, array("lan_ip_address"), array($terminal->ipToNumber($ip)));
	if($success) {
		$session = new Session();
		$session->user = $user;
		$session->terminal = $terminal;
		$session->operation = SES_LOGIN; //login code
		$ok = $session->commit($dbhandler);
		if(!$ok) {
			returnError(500, "server error");
			$dbhandler->disconnect();
			return;
		}
	}
}
$sessionid = createSessionForUser($user);
$response = array('id'=>$user->id,'name'=>$user->name,'access_level'=>$user->accessLvl, 'session_id'=>$sessionid);
echo json_encode(objToUTF8($response));

$dbhandler->disconnect();
return;


//-----------------------------------------------------------

function loginSigmaUser() {
	/*$auth= new SimpleSAML_Auth_Simple('default-sp');
    $auth->requireAuth();

    $attributes = $auth->getAttributes();
	return array("id"=>$attributes['givenName'][0],"name"=>$attributes['sn'][0],"email"=>$attributes['mail'][0]);*/
	return array("id"=>"aweichandt","name"=>"Alejandro","email"=>"aweichandt@frba.utn.edu.ar");
}

function loginGLPIUser($username, $password) {
	return authorizeGLPIUser($username, $password);
}
?>