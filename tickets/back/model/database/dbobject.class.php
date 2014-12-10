<?php
/**
* 
abstract class DBObject
anyone who wants to use this must override:
- values()
- setValues($row)
- fields()
- table()
*/
class DBObject {
	//id ( >= 0 --> comes from db)
	var $id = -1;
	//must be deleted
	var $deleteTag = false;
	
	
	function DBObject($objid = -1) {
		$this->id = $objid;
	}
	
//abstract
	function table() {
		return "";
	}
	
	function fields() {
		return array();
	}
	
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
		$this->deleteTag = true;
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
		$query = "INSERT INTO `".$this->table()."` (";
		$values = $this->values();
		$fieldnames = $this->fields();
		$len = count($fieldnames);
		
		$strfields = "";
		$strvalues = "";
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$fieldnames[$i]."`";
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
		$query = "UPDATE `".$this->table()."` SET ";
		$values = $this->values();
		$fieldnames = $this->fields();
		$len = count($fieldnames);
		
		for($i=0; $i < $len; $i++) {
			$strvalue;
			$strfield = "`".$fieldnames[$i]."`";
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
		$query = "DELETE FROM `".$this->table()."`";
		$query .= " WHERE `id`= '".$this->id."'";
		
		$result = $dbhandler->query($query);
		if($result) {
			$this->id = -1;
			$this->deleteTag = false;
		}
		return ($result);
	}
	
	function load(&$dbhandler) {
		if(!$this->fromDB()) {
			return;
		}
		$query = "SELECT ";
		$fieldnames = $this->fields();
		$len = count($fieldnames);
		
		$strfields = "";
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$fieldnames[$i]."`";
			if ($i!=$len-1) {
				$strfields .= ",";
			}
		}
		
		$query .= $strfields." FROM `".$this->table()."` WHERE `ID`='".$this->id."'";
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
	
	function loadUsingValues(&$dbhandler, $fields = array(), $values = array()) {
		$query = "SELECT ";
		$fieldnames = $this->fields();
		$len = count($fieldnames);
		
		$strfields = "`id`";
		if($len > 0) {
			$strfields .= ",";
		}
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$fieldnames[$i]."`";
			if ($i!=$len-1) {
				$strfields .= ",";
			}
		}
		$wherestr = "";
		$len = count($fields);
		if($len > 0) {
			$wherestr = " WHERE ";
			for($i=0; $i < $len ; $i++) {
				$wherestr.= "`".$fields[$i]."`='".$values[$i]."'";
				if ($i!=$len-1) {
					$wherestr .= " AND ";
				}
			}
		}
		
		$query .= $strfields." FROM `".$this->table()."`".$wherestr;
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
	
	public static function listAllOrdered(&$dbhandler, $fields = array(), $values = array(), $order_fields = array(), $desc = array()) {
		$orderstr = "";
		$len = count($order_fields);
		if($len > 0) {
			$orderstr = " ORDER BY ";
			for($i=0; $i < $len ; $i++) {
				$descstr = $desc[$i]?"DESC":"ASC";
				$orderstr.= "`".$order_fields[$i]."` ".$descstr;
				if ($i!=$len-1) {
					$orderstr .= ", ";
				}
			}
		}
		return static::listAll($dbhandler, $fields, $values, $orderstr );
	}
	
	public static function listAll(&$dbhandler, $fields = array(), $values = array(), $orderstr = "") {
		$wherestr = "";
		$len = count($fields);
		if($len > 0) {
			$wherestr = " WHERE ";
			for($i=0; $i < $len ; $i++) {
				$wherestr.= "`".$fields[$i]."`='".$values[$i]."'";
				if ($i!=$len-1) {
					$wherestr .= " AND ";
				}
			}
		}
		return static::_listAll($dbhandler, $wherestr, $orderstr );
	}
	
	public static function listAllBetween(&$dbhandler, $fields = array(), $minvalues = array(), $maxvalues = array()) {
		$wherestr = "";
		$len = count($fields);
		if($len > 0) {
			$wherestr = " WHERE ";
			for($i=0; $i < $len ; $i++) {
				$wherestr.= "`".$fields[$i]."`>='".$minvalues[$i]."'";
				$wherestr.= " AND `".$fields[$i]."`<='".$maxvalues[$i]."'";
				if ($i!=$len-1) {
					$wherestr .= " AND ";
				}
			}
		}
		return static::_listAll($dbhandler, $wherestr );
	}
		
	public static function _listAll(&$dbhandler, $wherestr, $orderstr = "" ) {
		$query = "SELECT ";
		$fieldnames = static::fields();
		$len = count($fieldnames);
		
		$strfields = "`id`";
		if($len > 0) {
			$strfields .= ",";
		}
		for($i=0; $i < $len; $i++) {
			$strfields.= "`".$fieldnames[$i]."`";
			if ($i!=$len-1) {
				$strfields .= ",";
			}
		}
		
		$query .= $strfields." FROM `".static::table()."`".$wherestr.$orderstr;
		$ret = array();
		$result = $dbhandler->query($query);
		if($result) {
			while($row = mysqli_fetch_array($result)) {
				$obj = new static();
				$obj->id = $row['id'];
				$obj->setValues($row);
				array_push($ret, $obj);
			}
		}
		return $ret;
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
		if(!$value || $value == "NULL") {
			return $nullvalue;
		} else {
			return $value;
		}
	}
	
	function sqlDateTime($phpDateTime) {
		return date( 'Y-m-d H:i:s', $phpDateTime->getTimestamp() );
	}
	
	function phpDateTime($sqlDateTime) {
		$dt = new DateTime();
		$dt->setTimestamp(strtotime( $sqlDateTime ));
		return $dt;
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