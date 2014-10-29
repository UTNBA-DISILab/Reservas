<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Subject extends DBObject {
	var $name = "";
	
	function Subject($objid = -1) {
		$this->id = $objid;
		$this->table = "subjects";
		$this->fields = array("name");
		$this->name = "";
	}
	
	function values() {
		$name = $this->replaceNullValue($this->name, "");
		return array($name);
	}
	
	function setValues($row) {
		$this->name = $this->replaceNull($row["name"],"");
	}
}
?>