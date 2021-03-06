<?php
/**
* 
*/
include_once 'database/dbobject.class.php';

class Glpi_tracking extends DBObject {
	//Definir variables de la clase
	var $FK_entities;
	var $name;
	var $date;
	var $closedate;
	var $date_mod;
	var $status;
	var $author;
	var $recipient;
	var $FK_group;
	var $request_type;
	var $assign;
	var $assign_ent;
	var $assign_group;
	var $device_type;
	var $computer;
	var $contents;
	var $priority;
	var $uemail;
	var $emailupdates;
	var $realtime;
	var $category;
	var $cost_time;
	var $cost_fixed;
	var $cost_material;
	var $location;
	var $service_type;
	var $ticket_type;
	var $state_reason;
	var $applicant;	

	//Funcion que genera una instancia de la clase
	function Glpi_tracking($objid = -1){
		//Mande fruta y verdura para inicializar esto, no tengo idea lo que estoy haciendo.
		//Test 1.0
		$this->id = $objid;
		$this->FK_entities = -1;
		$this->name = "";
		$this->date = date_create();
		$this->closedate = date_create();
		$this->date_mod = date_create();
		$this->status = "";
		$this->author = -1; //creo q deberia ser una instancia de User
		$this->recipient = -1;
		$this->FK_group = -1;
		$this->request_type = -1;
		$this->assign = -1;
		$this->assign_ent = -1;
		$this->assign_group = -1;
		$this->device_type = -1;
		$this->computer = -1;
		$this->contents = "";
		$this->priority = -1;
		$this->uemail = "";
		$this->emailupdates = -1;
		$this->realtime = -1;
		$this->category = -1;
		$this->cost_time = -1;
		$this->cost_fixed = -1;
		$this->cost_material = -1;
		$this->location = -1;
		$this->service_type = -1;
		$this->ticket_type = -1;
		$this->state_reason = -1;
		$this->applicant = -1;
	}

	function table(){
		return "glpi_tracking";
	}

	function fields(){
		return array("FK_entities", "name", "date", "closedate", "date_mod", "status", "author",
			"recipient", "FK_group", "request_type", "assign", "assign_ent", "assign_group", "device_type",
			"computer", "contents", "priority", "uemail", "emailupdates", "realtime", "category", "cost_time",
			"cost_fixed", "cost_material", "location", "service_type", "ticket_type", "state_reason", "applicant");
	}

	function values(){
		//Creo que a los strings hay que pasarles un segundo parametro
		//Si no le pasas un segundo parametro a replaceNullValue toma -1 por default
		$FK_entities = $this->replaceNullValue($this->FK_entities);
		$name = $this->replaceNullValue($this->name, "");		
		$date = $this->sqlDateTime($this->date);
		$closedate = $this->sqlDateTime($this->closedate);
		$date_mod = $this->sqlDateTime($this->date_mod);		
		$status = $this->replaceNullValue($this->status, "");
		$author = $this->replaceNullValue($this->author);
		$recipient = $this->replaceNullValue($this->recipient);
		$FK_group = $this->replaceNullValue($this->FK_group);
		$request_type = $this->replaceNullValue($this->request_type);
		$assign = $this->replaceNullValue($this->assign);
		$assign_ent = $this->replaceNullValue($this->assign_ent);
		$assign_group = $this->replaceNullValue($this->assign_group);
		$device_type = $this->replaceNullValue($this->device_type);
		$computer = $this->replaceNullValue($this->computer);
		$contents = $this->replaceNullValue($this->contents, "");
		$priority = $this->replaceNullValue($this->priority);
		$uemail = $this->replaceNullValue($this->uemail, "");
		$emailupdates = $this->replaceNullValue($this->emailupdates);
		$realtime = $this->replaceNullValue($this->realtime);
		$category = $this->replaceNullValue($this->category);
		$cost_time = $this->replaceNullValue($this->cost_time);
		$cost_fixed = $this->replaceNullValue($this->cost_fixed);
		$cost_material = $this->replaceNullValue($this->cost_material);
		$location = $this->replaceNullValue($this->location);
		$service_type = $this->replaceNullValue($this->service_type);
		$ticket_type = $this->replaceNullValue($this->ticket_type);
		$state_reason = $this->replaceNullValue($this->state_reason);
		$applicant = $this->replaceNullValue($this->applicant);

		return array($FK_entities, $name, $date, $closedate, $date_mod, $status, $author,
			$recipient, $FK_group, $request_type, $assign, $assign_ent, $assign_group, $device_type,
			$computer, $contents, $priority, $uemail, $emailupdates, $realtime, $category, $cost_time,
			$cost_fixed, $cost_material, $location, $service_type, $ticket_type, $state_reason, $applicant);
	}

	function setValues($row){
		$this->FK_entities = $this->replaceNull($row["FK_entities"]);
		$this->name = $this->replaceNull($row["name"]);
		$this->date = $this->phpDateTime($row["date"]);
		$this->closedate = $this->phpDateTime($row["closedate"]);
		$this->date_mod = $this->phpDateTime($row["date_mod"]);
		$this->status = $this->replaceNull($row["status"]);
		$this->author = $this->replaceNull($row["author"]);
		$this->recipient = $this->replaceNull($row["recipient"]);
		$this->FK_group = $this->replaceNull($row["FK_group"]);
		$this->request_type = $this->replaceNull($row["request_type"]);
		$this->assign = $this->replaceNull($row["assign"]);
		$this->assign_ent = $this->replaceNull($row["assign_ent"]);
		$this->assign_group = $this->replaceNull($row["assign_group"]);
		$this->device_type = $this->replaceNull($row["device_type"]);
		$this->computer = $this->replaceNull($row["computer"]);
		$this->contents = $this->replaceNull($row["contents"]);
		$this->priority = $this->replaceNull($row["priority"]);
		$this->uemail = $this->replaceNull($row["uemail"]);
		$this->emailupdates = $this->replaceNull($row["emailupdates"]);
		$this->realtime = $this->replaceNull($row["realtime"]);
		$this->category = $this->replaceNull($row["category"]);
		$this->cost_time = $this->replaceNull($row["cost_time"]);
		$this->cost_fixed = $this->replaceNull($row["cost_fixed"]);
		$this->cost_material = $this->replaceNull($row["cost_material"]);
		$this->location = $this->replaceNull($row["location"]);
		$this->service_type = $this->replaceNull($row["service_type"]);
		$this->ticket_type = $this->replaceNull($row["ticket_type"]);
		$this->state_reason = $this->replaceNull($row["state_reason"]);
		$this->applicant = $this->replaceNull($row["applicant"]);
	}
}
?>