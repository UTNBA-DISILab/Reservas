<?php
/**
* codigo
*/
class MySqlDB {
	//Database Host
	var $dbhost	= ""; 
	//Database User
	var $dbuser = "";
	//Database Password 
	var $dbpassword	= "";
	//Database name
	var $dbname	= "";
	
	//Connection
	var $dbc;
	
	function MySqlDB($host = "", $user = "", $password = "", $name = "") {
		$this->dbhost = $host;
		$this->dbuser = $user;
		$this->dbpassword = $password;
		$this->dbname = $name;
	}
	
	function connect() {
		$this->dbc = mysqli_connect($this->dbhost,$this->dbuser,$this->dbpassword,$this->dbname);
		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		  unset($this->dbc);
		}
	}
	
	function disconnect() {
		mysqli_close($this->dbc);
		unset($this->dbc);
	}
	
	function query($query) {
		if(is_null($this->dbc)) {
			return;
		}
		$result = mysqli_query($this->dbc, $query);
		return $result;
	}
	
	function getLastInsertId() {
		return $this->dbc->insert_id;
	}
}
?>