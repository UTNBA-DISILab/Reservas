<?php

include_once 'utils/includes.php';
include_once 'get_glpi_tracking.php';
include_once 'get_glpi_reservations.php';

function delete_glpi_reservation($begin, $end, $labName){

	$arrayLaboratorios = array(
        "Azul" => "4",
        "Verde" => "2",
        "Rojo" => "1",
        "Campus" => "5",
        "Campus Lab" => "6",
        "Multimedia" => "7",
        "Amarillo" => "3");

	$computer = $arrayLaboratorios[$labName];

	$glpi_tracking = new Glpi_tracking();

	$old_tracking = getGlpiTracking($glpi_tracking->sqlDateTime($begin), $glpi_tracking->sqlDateTime($end), $computer);

	$reservation_resa = getGlpiReservationResa($old_tracking->id);

	$dbhandler = getGlpiDatabase();
	$dbhandler->connect();

	//Remove tracking and reservation
	$reservation_resa->remove();

	if(!$reservation_resa->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
	}

	$old_tracking->remove();

	if(!$old_tracking->commit($dbhandler)) {
	returnError(500, "server error");
	$dbhandler->disconnect();
	return;
	}

	$dbhandler->disconnect();
	return;
}

?>