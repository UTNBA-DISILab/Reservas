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

//Add glpi_tracking
$glpi_tracking = new Glpi_tracking();

$glpi_tracking->FK_entities = 0;
$glpi_tracking->name = "Soy Juan, y quiero que mi reserva funcione";
$glpi_tracking->date = $beginDate;
$glpi_tracking->closedate = $endDate;
$glpi_tracking->date_mod = $beginDate;
$glpi_tracking->status = "assign";
$glpi_tracking->author = 8; //creo q deberia ser una instancia de User
$glpi_tracking->recipient = 8;
$glpi_tracking->FK_group = 0;
$glpi_tracking->request_type = 3;
$glpi_tracking->assign = 8;
$glpi_tracking->assign_ent = 0;
$glpi_tracking->assign_group = 149;
$glpi_tracking->device_type = 4;
$glpi_tracking->computer = 105;
$glpi_tracking->contents = "El Profesor Juan es genial.";
$glpi_tracking->priority = 3;
$glpi_tracking->uemail = "mail_falso123@gmail.com";
$glpi_tracking->emailupdates = 0;
$glpi_tracking->realtime = 0;
$glpi_tracking->category = 72;
$glpi_tracking->cost_time = 0;
$glpi_tracking->cost_fixed = 0;
$glpi_tracking->cost_material = 0;
$glpi_tracking->location = 123;
$glpi_tracking->service_type = 6;
$glpi_tracking->ticket_type = 1;
$glpi_tracking->state_reason = 0;
$glpi_tracking->applicant = 25;

$glpi_tracking->commit($dbhandler);

$dbhandler->disconnect();

?>