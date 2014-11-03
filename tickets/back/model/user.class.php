<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class User extends DBObject {
	var $sigmaId = -1;
	var $glpiId = -1;
	var $name = "";
	var $surname = "";
	var $accessLvl = 0;
	
	function User($objid = -1) {
		$this->id = $objid;
		$this->sigmaId = -1;
		$this->glpiId = -1;
		$this->name = "";
		$this->surname = "";
		$this->accessLvl = 0;
	}
	
	function table() {
		return "users";
	}
	
	function fields() {
		return array("glpi_user_id", "sigma_user_id",
					 "name", "surname", "access_level");
	}
	
	function values() {
		$glpi_user_id = $this->replaceNullValue($this->glpiId);
		$sigma_user_id = $this->replaceNullValue($this->sigmaId);
		$name = $this->replaceNullValue($this->name,"");
		$surname = $this->replaceNullValue($this->surname,"");
		$access_level = $this->accessLvl;
		return array($glpi_user_id, $sigma_user_id,
					 $name, $surname, $access_level);
	}
	
	function setValues($row) {
		$this->glpiId = $this->replaceNull($row["glpi_user_id"]);
		$this->sigmaId = $this->replaceNull($row["sigma_user_id"]);
		$this->name = $this->replaceNull($row["name"],"");
		$this->surname = $this->replaceNull($row["surname"],"");
		$this->accessLvl = $row["access_level"];
	}
}
?>