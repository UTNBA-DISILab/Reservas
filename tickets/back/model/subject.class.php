<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Subject extends DBObject {
	var $name = "";
	var $code = -1;
	
	function Subject($objid = -1) {
		$this->id = $objid;
		$this->name = "";
		$this->code = -1;
	}
	
	function table() {
		return "subjects";
	}
	
	function fields() {
		return array("name", "code");
	}
	
	function values() {
		$name = $this->replaceNullValue($this->name, "");
		$code = $this->replaceNullValue($this->code);
		return array($name, $code);
	}
	
	function setValues($row) {
		$this->name = $this->replaceNull($row["name"],"");
		$this->code = $this->replaceNull($row["code"]);
	}
}
?>