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

function listAll() {
	
	if(!isset($_GET["begin"]) || !isset($_GET["end"])) {
	   returnError(500, "missing values");
	   return;
	}
	$begin = $_GET["begin"];
	$end = $_GET["end"];
	
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

	$beginDate = DateTime::createFromFormat('U', $begin);
	$endDate = DateTime::createFromFormat('U', $end);

	$fields = array("begin");
	$minvalues = array(Glpi_reservation_resa::sqlDateTime($beginDate));
	$maxvalues = array(Glpi_reservation_resa::sqlDateTime($endDate));

	$glpi_reservations = Glpi_reservation_resa::listAllBetween($dbhandler, $fields, $minvalues, $maxvalues);

	$return = array();
	if (is_array($glpi_reservations)) {
		foreach ($glpi_reservations as &$glpi_reservation) {
			$glpi_reservation_info = array(
				"id"=>$glpi_reservation->id,
				"id_item"=>$glpi_reservation->id_item,
				"begin"=>$glpi_reservation->begin,
				"end"=>$glpi_reservation->end,
				"id_user"=>$glpi_reservation->id_user,
				"comment"=>$glpi_reservation->comment,
				"recipient"=>$glpi_reservation->recipient,
				"resa_usage"=>$glpi_reservation->resa_usage,
				"ticket"=>$glpi_reservation->ticket);
			array_push($return, $glpi_reservation_info);
			unset($glpi_reservation);
		}
	}

	$dbhandler->disconnect();
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