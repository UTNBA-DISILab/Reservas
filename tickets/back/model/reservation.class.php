<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Reservation extends DBObject {
	//owner. the one who opens this request
	var $owner;
	//validator. resource assigned to resolve this request
	var $validator;
	//begin date. begin date and time of this request
	var $beginDate;
	//end date. end date and time of this request
	var $endDate;
	//lab id. phisical resource trying to be requested
	var $lab;
	//subject id. subject class being used on this reservation
	var $subject;
	
	function Reservation($objid = -1) {
		$this->id = $objid;
		$this->owner = new User();
		$this->validator = new User();
		$this->beginDate = new DateTime("now");
		$this->endDate = new DateTime("now");
		$this->lab = new Lab();
		// $this->subject = new Subject();
		$this->subject = "";
	}
	
	function table() {
		return "reservations";
	}
	
	function fields() {
		return array("owner_id", "validator_id", "begin_date",
					 "end_date", "lab_id", "subject"); // no subject_id
	}
	
	function values() {
		$owner_id = $this->replaceNullValue($this->owner->id);
		$validator_id = $this->replaceNullValue($this->validator->id);
		$begin_date = $this->sqlDateTime($this->beginDate);
		$end_date = $this->sqlDateTime($this->endDate);
		$lab_id = $this->replaceNullValue($this->lab->id);
		// $subject_id = $this->replaceNullValue($this->subject->id);
		$subject = $this->replaceNullValue($this->subject,"");
		return array($owner_id, $validator_id, $begin_date,
					 $end_date, $lab_id, $subject); // no subject_id
	}
	
	function setValues($row) {
		$this->owner->id = $this->replaceNull($row["owner_id"]);
		$this->validator->id = $this->replaceNull($row["validator_id"]);
		$this->beginDate = $this->phpDateTime($row["begin_date"]);
		$this->endDate = $this->phpDateTime($row["end_date"]);
		$this->lab->id = $this->replaceNull($row["lab_id"]);
		// $this->subject->id = $this->replaceNull($row["subject_id"]);
		$this->subject = $this->replaceNull($row["subject"],"");

	}
}
?>