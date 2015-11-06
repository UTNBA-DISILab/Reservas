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
	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "glpi";
	$dbhandler = new MySqlDB($host, $user, $password, $database_name);

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

	return $tracking;
}

?>