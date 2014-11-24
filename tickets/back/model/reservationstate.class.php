<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class ReservationState extends DBObject {
	var $reservation = -1;
	var $user = -1;
	var $datetime;
	var $state = -1;
	var $description = "";
	function ReservationState($objid = -1) {
		$this->id = $objid;
		$this->reservation = new Reservation();
		$this->user = new User();
		$this->datetime = new DateTime("now");
		$this->state = -1;
		$this->description = "";
	}
	
	function table() {
		return "reservation_states";
	}
	
	function fields() {
		return array("reservation_id", "user_id",
					 "date", "state", "description");
	}
	
	function values() {
		$reservation_id = $this->replaceNullValue($this->reservation->id);
		$user_id = $this->replaceNullValue($this->user->id);
		$datetime = $this->sqlDateTime($this->datetime);
		$state = $this->replaceNullValue($this->state);
		$description = $this->replaceNullValue($this->description, "");
		return array($reservation_id, $user_id,
					 $datetime, $state, $description);
	}
	
	function setValues($row) {
		$this->reservation->id = $this->replaceNull($row["reservation_id"]);
		$this->user->id = $this->replaceNull($row["user_id"]);
		$this->datetime = $this->phpDateTime($row["date"]);
		$this->state = $this->replaceNull($row["state"]);
		$this->description = $this->replaceNull($row["description"], "");
	}
	
	public static function getLatestForReservationId(&$dbhandler, $reservation_id) {
		$reservations = ReservationState::listAllOrdered($dbhandler, array('reservation_id'), array($reservation_id), array("date"), array(true));
		if($reservations) {
			return $reservations[0];
		}
		return false;
	}
}
?>