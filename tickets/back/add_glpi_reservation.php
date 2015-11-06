<?php

include_once 'utils/includes.php';

function addGlpiReservation($ticket, $glpi_tracking, $comment) {
	
	$dbhandler = getGlpiDatabase();
	$dbhandler->connect();

	//Add glpi_reservation
	$glpi_reservation = new Glpi_reservation_resa();

	$arrayLaboratorios = array(
		"4" => "4", //Azul
		"1" => "2", //Rojo
		"2" => "3", //Verde
		"3" => "5", //Amarillo - Workgroup 1
		"5" => "8", //Campus - Workgroup 2
		"6" => "7", //Campus lab
		"7" => "9"); //Multimedia

	$glpi_reservation->id_item = $arrayLaboratorios[$glpi_tracking->computer];
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