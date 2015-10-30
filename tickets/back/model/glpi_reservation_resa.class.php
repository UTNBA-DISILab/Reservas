<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Glpi_reservation_resa extends DBObject {
	//Definir variables de la clase
	var $id_item;
	var $begin;
	var $end;
	var $id_user;
	var $comment;
	var $recipient;
	var $resa_usage;
	var $ticket;

	//Funcion que genera una instancia de la clase
	function Glpi_reservation_resa($objid = -1){
		$this->id = $objid;
		$this->id_item = -1;
		$this->begin = date_create();
		$this->end = date_create();
		$this->id_user = -1;
		$this->comment = "";
		$this->recipient = -1;
		$this->resa_usage = -1;
		$this->ticket = -1;
	}

	function table(){
		return "glpi_reservation_resa";
	}

	function fields(){
		return array("id_item", "begin", "end" , "id_user", "comment", "recipient", "resa_usage", "ticket");
	}

	function values(){
		//Creo que a los strings hay que pasarles un segundo parametro
		//Si no le pasas un segundo parametro a replaceNullValue toma -1 por default
		$id_item = $this->replaceNullValue($this->id_item);
		$begin = $this->replaceNullValue($this->begin);
		$end = $this->replaceNullValue($this->end);
		$id_user = $this->replaceNullValue($this->id_user);
		$comment = $this->replaceNullValue($this->comment, "");
		$recipient = $this->replaceNullValue($this->recipient);
		$resa_usage = $this->replaceNullValue($this->resa_usage);
		$ticket = $this->replaceNullValue($this->ticket);

		return array($id_item, $begin, $end, $id_user, $comment, $recipient, $resa_usage, $ticket);
	}

	function setValues($row){
		$this->id_item = $this->replaceNullValue($row["id_item"]);
		$this->begin = $this->replaceNullValue($row["begin"]);
		$this->end = $this->replaceNullValue($row["end"]);
		$this->id_user = $this->replaceNullValue($row["id_user"]);
		$this->comment = $this->replaceNullValue($row["comment"]);
		$this->recipient = $this->replaceNullValue($row["recipient"]);
		$this->resa_usage = $this->replaceNullValue($row["resa_usage"]);
		$this->ticket = $this->replaceNullValue($row["ticket"]);
	}
}
?>