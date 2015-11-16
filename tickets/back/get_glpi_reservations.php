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

//----------------------------------------------------------------------

function get_glpi_reservations($begin, $end) {
	
/*
	//SOLO PARA TEST
	//-----------------------------------------------------------------
	$timestamp = strtotime('01-01-2014');
	$begin = $timestamp;
	$end = strtotime('01-05-2014');
	//-----------------------------------------------------------------
	//SOLO PARA TEST
*/

	$dbhandler = getGlpiDatabase();
	$dbhandler->connect();

	$beginDate = DateTime::createFromFormat('U', $begin / 1000);
	$endDate = DateTime::createFromFormat('U', $end / 1000);

	$fields = array("begin");
	$minvalues = array(Glpi_reservation_resa::sqlDateTime($beginDate));
	$maxvalues = array(Glpi_reservation_resa::sqlDateTime($endDate));

	$glpi_reservations = Glpi_reservation_resa::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);

	$return = array();
	if (is_array($glpi_reservations)) {
		
		$arrayLaboratorios = array(
		"4" => "1", //Azul
		"2" => "2", //Rojo
		"3" => "3", //Verde
		"5" => "4", //Amarillo - Workgroup 1
		"8" => "6", //Campus - Workgroup 2
		"7" => "7", //Campus lab
		"9" => "5"); //Multimedia

		foreach ($glpi_reservations as &$glpi_reservation) {
			$glpi_reservation_info = array(
				"id"=>-1,
				"lab_id"=>$arrayLaboratorios[$glpi_reservation->id_item],
				"begin"=>$glpi_reservation->begin->getTimestamp() * 1000,
				"end"=>$glpi_reservation->end->getTimestamp() * 1000,
				"description"=>$glpi_reservation->comment,
				"owner_id"=>-1,
				"subject"=>-1,
				"creation_date"=>$glpi_reservation->begin->getTimestamp() * 1000,
				"state"=> RES_STATE_CONFIRMED);
			array_push($return, $glpi_reservation_info);
			unset($glpi_reservation);
		}
	}

	$dbhandler->disconnect();
	return $return;
}

//----------------------------------------------------------------------

function getGlpiReservationResa($ticket) {
	$dbhandler = getGlpiDatabase();
	$dbhandler->connect();

	$query = "SELECT * FROM glpi_reservation_resa WHERE ticket = ". $ticket . ";";	
	
	$result = $dbhandler->query($query);
	if($result) {
		while($row = mysqli_fetch_array($result)) {
			$tracking = new Glpi_reservation_resa();
			$tracking->id = $row['ID'];
			$tracking->setValues($row);	
		}
	}
	
	$dbhandler->disconnect();

	if(isset($tracking)){
		return $tracking;
	}else{
		returnError(500, "Glpi impact error");
	}
}

?>