<?php

include_once 'utils/includes.php';

function addGlpiReservation($ticket, $glpi_tracking, $comment) {

	//Para conectarme a GLPI
	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "glpi";
	$dbhandler = new MySqlDB($host, $user, $password, $database_name);

	$dbhandler->connect();

	//Add glpi_reservation
	$glpi_reservation = new Glpi_reservation_resa();

	$glpi_reservation->id_item = 5;
	$glpi_reservation->begin = $glpi_tracking->date;
	$glpi_reservation->end = $glpi_tracking->closedate;
	$glpi_reservation->id_user = $glpi_tracking->author;
	$glpi_reservation->comment = $comment;
	$glpi_reservation->recipient = 0;
	$glpi_reservation->resa_usage = 0;
	$glpi_reservation->ticket = $ticket;

	$glpi_reservation->commit($dbhandler);

	$dbhandler->disconnect();

}

?>