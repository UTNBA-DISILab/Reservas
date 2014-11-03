<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Session extends DBObject {
	var $user = -1;
	var $terminal = -1;
	var $datetime;
	var $operation = -1;
	
	function Session($objid = -1) {
		$this->id = $objid;
		$this->userId = new User();
		$this->terminal = new Terminal();
		$this->datetime = new DateTime("now");
		$this->operation = -1;
	}
	
	function table() {
		return "sessions";
	}
	
	function fields() {
		return array("user_id", "terminal_id", "date", "operation");
	}
	
	function values() {
		$user_id = $this->replaceNullValue($this->user->id);
		$terminal_id = $this->replaceNullValue($this->terminal->id);
		$date = $this->sqlDateTime($this->datetime);
		$operation = $this->replaceNullValue($this->operation);
		return array($user_id, $terminal_id, $date, $operation);
	}
	
	function setValues($row) {
		$this->user->id = $this->replaceNull($row["user_id"]);
		$this->terminal->id = $this->replaceNull($row["terminal_id"]);
		$this->datetime = $this->phpDateTime($row["date"]);
		$this->operation = -$this->replaceNull($row["operation"]);;
	}
}
?>