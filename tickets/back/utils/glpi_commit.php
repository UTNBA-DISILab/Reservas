<?php

/******************************************************************************

	Informacion de login

******************************************************************************/

		$login_name = "gsardon";
		$login_password = "ale";

/******************************************************************************

	Definicion del ticket

******************************************************************************/

		$_POST["ticket_type"] = 1;
										//Abrir una peticion
		$_POST["status"]="new";			//Estado: 	"Nueva (no asignado)" "new"/"Asignado" "assign"/"Planificado" "plan"/"En espera" "waiting"
										//			"Resuelto" "old_done"/"Cancelado" "old_notdone"
		$_POST["author"] = "12";		//Autor: id (glpi_users)
		$_POST["FK_group"]="0";			//Grupo: "Aplicaciones" "146"/"Calidad" "147"/"Coordinadores" "150"/"Infraestructura" "144"
										//		 "Jefes de Turno" "149"/"Responsables" "148"/"Servicios" "145"></option>
		$_POST["assign"]="12";			//Asignar - técnico (Sería el mismo de author o lo debería poder establecer cuando acepta el ticket?)
		$_POST["assign_group"]="145";	//Asignar - grupo: "Aplicaciones" "146"/"Calidad" "147"/"Coordinadores" "150"/"Infraestructura" "144"
										//		 "Jefes de Turno" "149"/"Responsables" "148"/"Servicios" "145"></option>
		$_POST["minute"]="30";			//Duracion total- minutos (0-59)
		$_POST["hour"]="2";				//Duracion total- horas (0-100)

		$_POST["date"]="2014-05-05 12:00:00";  //$diahora->format('Y-m-d H:i:s');				//Fecha
		$_POST["category"]="70";		//Categoria (Estructura arbol: Peticiones->Compras/Hw/Mantenimiento/Otros/Salas->Reservas "70")
		$_POST["priority"]="5";			//Prioridad ("Critica" "5"/"Alta" "4"/"Media" "3"/"Baja" "2")
		$_POST["request_type"]="4";		//Origen de la solicitud (E-mail/Telefono/"Directa" "4"/"Propia" "7"/"Otro" "6"))
		$_POST["service_type"]="3";		//Servicio afectado ("Reserva de salas" "3")
		$_POST["name"]="Reserva en la compu de javi";			//Título (Texto libre)
		$_POST["contents"]="Ticket\nMateria: PPS\nProfesor: Ing. A";			//Descripcion: (Texto libre)
	//	$_POST["_followup"];
	//	$_POST["plan"];
		$_POST["location"]="122";		//Lugar ("Campus" "122"/"Medrano" "123")
		$_POST["device_type"]="1050";	//device_type	"Sala" "1050"
		$_POST["computer"]="5";			//computer 	(variable q guarda en funcion al device_type) 
												//			"Laboratorio Azul" 			"4"
												//			"Laboratorio Campus" 		"5"
												//			"Laboratorio Rojo" value=	"1"
												//			"Laboratorio Verde" 		"2"
												//			"Sala multimedia" 			"7"
												//			"Sala Servidores" 			"9"
												//			"WorkGroup Lab 1" value=	"3"
												//			"WorkGroup Lab 2" value=	"6"
		$_POST["state_reason"]="0";			//state_reason	Motivos para el estado  NO ASIGNADO EN GLPI
		$_POST["applicant"]="0";
											/* applicant = 	"alumnos de otras carreras - " 		value="25"
															"Alumnos DISI - " 					value="17"
															"Ayudante DISI LAB - " 				value="20"
															"Comité Calidad - " 				value="22"
															"Coord. DISI LAB - " 				value="11"
															"Director DISI - " 					value="9"
															"Docente otros Departamentos - " 	value="16"
															"Docentes DISI - " 					value="15"
															"Jefe de Turno - " 					value="21"
															"Responsable de Aplicaciones - " 	value="13"
															"Responsable de Infraestrucura - " 	value="14"
															"Responsable de Redes - " 			value="24"
															"Responsable de Servicios - " 		value="12"
															"Secretarías - " 					value="18"
											*/

/****************************************************************************o*

	Definicion de la reserva

******************************************************************************/

	/*
		La tabla de donde toma los id de laboratorios para los tickets es distinta a la de las reservas 
		para los siguientes laboratorios:
		"Laboratorio Azul" 			"4" -> "4"
		"Laboratorio Campus" 		"5" -> "8"
		"Laboratorio Rojo" value=	"1" -> "2"
		"Laboratorio Verde" 		"2" -> "3"
		"Sala multimedia" 			"7" -> "9"
		"Sala Servidores" 			"9" -> No asignada
		"WorkGroup Lab 1" value=	"3" -> "5"
		"WorkGroup Lab 2" value=	"6" -> "7"
	*/
	switch ($_POST['computer']) {
		case '1':
			$_POST["items"] =  array("2");
			break;
		
		case '2':
			$_POST["items"] =  array("3");
			break;

		case '3':
			$_POST["items"] =  array("5");
			break;

		case '4':
			$_POST["items"] =  array("4");
			break;

		case '5':
			$_POST["items"] =  array("8");
			break;

		case '6':
			$_POST["items"] =  array("7");
			break;

		case '7':
			$_POST["items"] =  array("9");
			break;

		default:
			# code...
			break;
	}
	$_POST['begin'] = "2015-01-07 15:00:00";
	$_POST['end'] = "2015-01-07 16:30:00";
	
											/*
												Comienzo y fin del uso del laboratorio, el primer día.
												Si se repite la reserva en dias o semanas sucesivas, usa el mismo horario.
												Ademas verifica la disponibilidad del recurso.
											*/
	$_POST['periodicity'] = "week";			// Periodicidad: si va a contar periodicity_times por dia "day" o por semana "week"
	$_POST['periodicity_times'] = "6";			// La cantidad de reservas "efectivas" a realizar
											/*
												$_POST["periodicity"] = "week";	
												$_POST["periodicity_times"] = 4; reserva 4 semanas seguidas

												$_POST["periodicity"] = "day";		
												$_POST["periodicity_times"] = 4; reserva 4 dias seguidos
											*/
	$_POST['comment'] = "Reserva'\nMateria: PPS'\nProfesor: Ing. B";	// Comentario de la reserva												
	$_POST['addReservation'] = "on";				// Crear la reserva


	include('./reservations/reservations.php');

	echo "<p>Genero ticket y reserva</p>";

?>
