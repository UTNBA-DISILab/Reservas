<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Terminal extends DBObject {
	var $name = "";
	var $ip = "";
	var $network = "";
	
	function Terminal($objid = -1) {
		$this->id = $objid;
		$this->name = "";
		$this->ip = "";
		$this->network = "";
	}
	
	function table() {
		return "terminals";
	}
	
	function fields() {
		return array("name", "lan_ip_address", "lan_network");
	}
	
	function values() {
		$name = $this->replaceNullValue($this->name, "");
		$lan_ip_address = $this->replaceNullValue($this->ipToNumber($this->ip), 0);
		$lan_network = $this->replaceNullValue($this->ipToNumber($this->network), 0);
		return array($name, $lan_ip_address, $lan_network);
	}
	
	function setValues($row) {
		$this->name = $this->replaceNull($row["name"],"");
		$this->ip = $this->numberToIp($this->replaceNull($row["lan_ip_address"],0));
		$this->network = $this->numberToIp($this->replaceNull($row["lan_network"],0));
	}
}
?>