<?php
/**
* Default Initializer for Database
*/
include_once 'autoloader.php';

function authorizeGLPIUser($username, $md5password) {
	$dbhandler = getGLPIDatabase();
	$dbhandler->connect();
	
	$result = authGLPIUserWithDB($dbhandler, $username, $md5password);
	if($result) {
		$result = getGLPIUserInfo($dbhandler, $username);
	}
	$dbhandler->disconnect();
	return $result;
}

function authGLPIUserWithDB(&$dbhandler, $username, $md5password) {
	$query = "SELECT password_md5 FROM glpi_users WHERE name = '" . $username . "'";
	$result = $dbhandler->query($query);
	if(!$result) {
		return false;
	}
	$row = mysqli_fetch_array($result);
	if($md5password != $row["password_md5"]) {
		return false;
	}
	return true;
}

function getGLPIUserInfo(&$dbhandler, $username) {
	$query = "SELECT * FROM `glpi_users` WHERE `name` = '" . $username . "'";
	$result = $dbhandler->query($query);
	if(!$result) {
		return false;
	}
	$row = mysqli_fetch_array($result);
	$level = getGLPIUserAccessLevel($dbhandler, $row["ID"]);
	if(!$level) {
		$level = 0;
	}
	$user_info = array("id"=>$row["ID"],"name"=>$row["firstname"],"surname"=>$row["realname"], "level"=>$level);
	return $user_info;
}

function getGLPIUserAccessLevel(&$dbhandler, $userid) {
	$query = "SELECT A.name as level FROM `glpi_profiles` as A, `glpi_users_profiles` as B";
	$query .= " WHERE B.FK_profiles = A.ID AND B.FK_users = '".$userid."'";
	$result = $dbhandler->query($query);
	if(!$result) {
		return false;
	}
	$level = 1;
	while($row = mysqli_fetch_array($result)) {
		if (strpos($row['level'],'admin') !== false) {
			$level = 2;
			break;
		}
	}
	return $level;
}

function getGLPIDatabase() {
	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "glpi";

	return new MySqlDB($host, $user, $password, $database_name);
}
?>