<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Subject extends DBObject {
	var $name = "";
	var $career = "";
	var $code = "";
	
	function Subject($objid = -1) {
		$this->id = $objid;
		$this->name = "";
		$this->career = "";
		$this->code = "";
	}
	
	function table() {
		return "subjects";
	}
	
	function fields() {
		return array("name", "career", "code");
	}
	
	function values() {
		$name = $this->replaceNullValue($this->name, "");
		$career = $this->replaceNullValue($this->career, "");
		$code = $this->replaceNullValue($this->code, "");
		return array($name, $career, $code);
	}
	
	function setValues($row) {
		$this->name = $this->replaceNull($row["name"],"");
		$this->career = $this->replaceNull($row["career"],"");
		$this->code = $this->replaceNull($row["code"],"");
	}
}
?>