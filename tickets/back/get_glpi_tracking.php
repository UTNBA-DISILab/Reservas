<?php
/**
* Tickets System glpi_tracking information display
request:
GET

params:
-begin
-end
-computer

return:
Glpi_tracking Object.
*/
include_once 'utils/includes.php';

//----------------------------------------------------

function getGlpiTracking($begin, $end, $computer) {
	$dbhandler = getGlpiDatabase();
	$dbhandler->connect();

	$query = "SELECT * FROM glpi_tracking WHERE date = '". $begin . "' AND closedate = '". $end . "' AND computer = ". $computer . ";";
	
	$result = $dbhandler->query($query);
	if($result) {
		while($row = mysqli_fetch_array($result)) {
			$tracking = new Glpi_tracking();
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