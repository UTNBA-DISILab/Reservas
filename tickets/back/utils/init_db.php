<?php
/**
* Default Initializer for Database
*/
//include_once 'autoloader.php';

function getDatabase() {
//override these params
	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "reservas_disilab";	
	
	return new MySqlDB($host, $user, $password, $database_name);
}

function getGlpiDatabase() {
	//This params only work for the development enviroment.
	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "glpi";

	return new MySqlDB($host, $user, $password, $database_name);
}
?>