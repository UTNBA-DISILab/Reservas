<?php
/**
* 
*/
include 'database/dbobject.class.php';

class ReservationState extends DBObject {
	
	function ReservationState($objid = -1) {
		$this->id = $objid;
		$this->table = "reservation_states";
		$this->fields = array("reservation_id", "user_id",
							  "date", "state", "description");
	}
	
	function values() {
		return array();
	}
	
	function setValues($row) {
	}
}
?>