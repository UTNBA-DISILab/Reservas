<?php
/**
* 
*/
include 'database/dbobject.class.php';

class Session extends DBObject {
	
	
	function Session($objid = -1) {
		$this->id = $objid;
		$this->table = "sessions";
		$this->fields = array("user_id", "terminal_id", "date", "operation");
	}
	
	function values() {
		return array();
	}
	
	function setValues($row) {
	}
}
?>