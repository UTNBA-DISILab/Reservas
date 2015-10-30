<?php
/**
* Tickets System glpi_reservations information display
request:
GET

params:
+ glpi_reservation_id

return:
[{id_item:<int>, begin:<datestr>, end:<datestr>, ..}, ..] or error string
*/
include_once 'utils/includes.php';

listAll();

error_log("GLPI RESERVATIONNSNSNSNSNSNSNSNSNS");

function listAll() {
	//Para conectarme a GLPI
	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "glpi";
	$dbhandler = new MySqlDB($host, $user, $password, $database_name);

	$dbhandler->connect();

	$glpi_reservations = Glpi_reservation_resa::listAll($dbhandler);

	$result = print_r($glpi_reservations, true);
	error_log($result);
	error_log("TERMINO EL GLPI RESERVATIONS");
}

?>