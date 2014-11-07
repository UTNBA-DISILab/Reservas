<?php
/**
* Generate, Solve and End Session Script
*/
/*include_once 'autoloader.php';
include_once 'utils/init_db.php';*/
function createSessionForUser(&$user) {
	session_start();
	$_SESSION["user_id"] = $user->id;
	$ret = session_id();
	session_write_close();
	return $ret;
}

function getUserFromSession() {
	session_start();
	if(!isset($_SESSION["user_id"])) {
		return false;
	}
	
	$dbh = getDatabase();
	$dbh->connect();
	
	$user = new User();
	$user->id = $_GET["user_id"];
	$success = $user->load($dbhandler);
	if(!$success) {
		return false;
	}
	return $user;
	session_write_close();
}

function cleanSession() {
	session_start();
	unset($_SESSION["user_id"]);
	session_write_close();
}
?>