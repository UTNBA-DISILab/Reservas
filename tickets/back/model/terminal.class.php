<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Terminal extends DBObject {
	
	
	function Terminal($objid = -1) {
		$this->id = $objid;
		$this->table = "terminals";
		$this->fields = array("name", "lan_ip_address", "lan_network");
	}
	
	function values() {
		return array();
	}
	
	function setValues($row) {
	}
}
?>