<?php

include_once 'utils/includes.php';

//Para conectarme a GLPI
$host = "localhost";
$user = "sistemasmysql";
$password = "17sistemassql06";
$database_name = "glpi";
$dbhandler = new MySqlDB($host, $user, $password, $database_name);

//SOLO PARA TEST
//-----------------------------------------------------------------
$begin = strtotime('29-10-2015');
$end = strtotime('29-10-2015');
//-----------------------------------------------------------------
//SOLO PARA TEST

$beginDate = DateTime::createFromFormat('U', $begin);
$endDate = DateTime::createFromFormat('U', $end);

$dbhandler->connect();

//Add glpi_reservation
$glpi_reservation = new Glpi_reservation_resa();

$glpi_reservation->id_item = 5;
$glpi_reservation->begin = $beginDate;
$glpi_reservation->end = $endDate;
$glpi_reservation->id_user = 11;
$glpi_reservation->comment = "MI COMENTARIO GENIAL HECHO POR MI";
$glpi_reservation->recipient = 0;
$glpi_reservation->resa_usage = 0;
$glpi_reservation->ticket = 3190;

$glpi_reservation->commit($dbhandler);

$dbhandler->disconnect();

?>