<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Subject extends DBObject {
	
	
	function Subject($objid = -1) {
		$this->id = $objid;
		$this->table = "subjects";
		$this->fields = array("name");
	}
	
	function values() {
		return array();
	}
	
	function setValues($row) {
	}
}
?>