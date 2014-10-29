<?php
/**
* 
abstract class DBObject
anyone who wants to use this must override values and setValues funcions
*/
class DBObject {
	//table from db
	var $table = "";
	//fields from db
	var $fields = array();
	//id ( >= 0 --> comes from db)
	var $id = -1;
	//must be deleted
	var $deleteTag = false;
	
	
	function DBObject($objid = -1) {
		$this->id = $objid;
	}
	
//abstract
	function values() {
		return array();
	}
	
	function setValues(&$row) {
	}
//end abstract

	function fromDB() {
		return $this->id >= 0;
	}
	
	function remove() {
		$deleteTag = true;
	}
	
	function commit(&$dbhandler) {
		if($this->fromDB()) {
			if($this->deleteTag) {
				return $this->delete($dbhandler);
			} else {
				return $this->update($dbhandler);
			}
		} else {
			return $this->insert($dbhandler);
		}
	}
	
	function insert(&$dbhandler) {
		$query = "INSERT INTO `".$this->table."` (";
		$values = $this->values();
		$len = count($this->fields);
		
		$strfields = "";
		$strvalues = "";
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$this->fields[$i]."`";
			if ($values[$i]=='NULL'){
				$strvalues .= $values[$i];
			} else {
				$strvalues .= "'".$values[$i]."'";
			}
			if ($i!=$len-1) {
				$strfields .= ",";
				$strvalues .= ",";
			}
		}
		$query .= $strfields .") VALUES (".$strvalues.")";
		$result = $dbhandler->query($query);
		if($result) {
			$this->id = $dbhandler->getLastInsertId();
		}
		return ($result);
	}
	
	function update(&$dbhandler) {
		$query = "UPDATE `".$this->table."` SET ";
		$values = $this->values();
		$len = count($this->fields);
		
		for($i=0; $i < $len; $i++) {
			$strvalue;
			$strfield = "`".$this->fields[$i]."`";
			if ($values[$i]=='NULL'){
				$strvalue = $values[$i];
			} else {
				$strvalue = "'".$values[$i]."'";
			}
			$query.= $strfield."=".$strvalue;
			if ($i!=$len-1) {
				$query .= ",";
			}
		}
		$query .= " WHERE `id`= '".$this->id."'";
		
		$result = $dbhandler->query($query);
		return ($result);
	}
	
	function delete(&$dbhandler) {
		$query = "DELETE FROM `".$this->table."`";
		$query .= " WHERE `id`= '".$this->id."'";
		
		$result = $dbhandler->query($query);
		return ($result);
	}
	
	function load(&$dbhandler) {
		if(!$this->fromDB()) {
			return;
		}
		$query = "SELECT ";
		$len = count($this->fields);
		
		$strfields = "";
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$this->fields[$i]."`";
			if ($i!=$len-1) {
				$strfields .= ",";
			}
		}
		
		$query .= $strfields." FROM `".$this->table;
		$query .= " WHERE `id`= '".$this->id."'";
		
		$result = $dbhandler->query($query);
		if($result) {
			$row = mysqli_fetch_array($result);
			if($row) {
				$this->setValues($row);
				return true;
			}
		}
		return false;
	}
	
	function loadUsingValues(&$dbhandler, $fields, $values) {
		$query = "SELECT ";
		$len = count($this->fields);
		
		$strfields = "`id`";
		if($len > 0) {
			$strfields .= ",";
		}
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$this->fields[$i]."`";
			if ($i!=$len-1) {
				$strfields .= ",";
			}
		}
		
		$len = count($fields);
		$wherestr = " WHERE ";
		for($i=0; $i < $len ; $i++) {
			$wherestr.= "`".$fields[$i]."`='".$values[$i]."'";
			if ($i!=$len-1) {
				$wherestr .= " AND ";
			}
		}
		
		$query .= $strfields." FROM `".$this->table."`".$wherestr;
		$result = $dbhandler->query($query);
		if($result) {
			$row = mysqli_fetch_array($result);
			if($row) {
				$this->id = $row['id'];
				$this->setValues($row);
				return true;
			}
		}
		return false;
	}
	
//utils
	function replaceNullValue($value, $nullvalue = -1) {
		if($value == $nullvalue) {
			return "NULL";
		} else {
			return $value;
		}
	}
	function replaceNull($value, $nullvalue = -1) {
		if($value == "NULL") {
			return $nullvalue;
		} else {
			return $value;
		}
	}
	
	function sqlDateTime($phpDateTime) {
		return date( 'Y-m-d H:i:s', $phpDateTime->getTimestamp() );
	}
	
	function phpDateTime($sqlDateTime) {
		$date = new DateTime();
		$date->setTimestamp(strtotime( $sqlDateTime ));
	}
	
	function ipToNumber($strIP) {
		$lngIP = ip2long($strIP);
		if ($lngIP && $lngIP < 0){ $lngIP += 4294967296 ;} 
		return $lngIP;
	}
	
	function numberToIp($lngIP) {
		return long2ip($lngIP);
	}
}
?>