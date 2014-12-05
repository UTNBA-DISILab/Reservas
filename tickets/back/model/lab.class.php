<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Lab extends DBObject {
	var $name = "";
	var $location = "";
	var $size = 0;
	//var $specifications = array();
	var $specifications = "";
	
	function Lab($objid = -1) {
		$this->id = $objid;
		$this->name = "";
		$this->location = "";
		$this->size = 0;
		//$this->specifications = array();
		$this->specifications = "";
	}
	
	function table() {
		return "labs";
	}
	
	function fields() {
		return array("name", "location", "size", "specifications");
	}
	
	function values() {
		$name = $this->replaceNullValue($this->name, "");
		$location = $this->replaceNullValue($this->location, "");
		$size = $this->replaceNullValue($this->size, 0);
		//$specifications = $this->replaceNullValue(json_encode(objToUTF8($this->specifications)),"[]");
		$specifications = $this->replaceNullValue($this->specifications,"");
		return array($name, $location, $size, $specifications);
	}
	
	function setValues($row) {
		$this->name = $this->replaceNull($row["name"],"");
		$this->location = $this->replaceNull($row["location"],"");
		$this->size = $this->replaceNull($row["size"],0);
		//$this->specifications = json_decode($this->replaceNull($row["specifications"],""));
		$this->specifications = $this->replaceNull($row["specifications"],"");
	}
}
?>