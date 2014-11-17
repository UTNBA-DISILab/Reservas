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
	$user->id = $_SESSION["user_id"];
	$success = $user->load($dbh);
	if(!$success) {
		return false;
	}
	return $user;
}

function cleanSession() {
	session_unset(); 
	session_destroy();
}
?>