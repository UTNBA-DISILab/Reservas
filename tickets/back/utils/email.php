<?php

require 'class.phpmailer.php';
require 'class.smtp.php';

//// parametros para el envio de mails
//direccion de destino y nombre y apellido de la persona

$address = "javisd.21@hotmail.com";
$nombre = "Javier Sanchez";
//direccion de destino CC
$addressCC=" javier.sz.33@gmail.com";
$asunto = "Confirmacion de reserva";

////cuerpo del mail
$body = "Reserva confirmada!";

/// encabezados
$html ='<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Reserva</title>
</head>
<body>

    <div align="left" style=" border-style: double; width: 342px; height:92px" >
      <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
  </div>
  </br>
  </br>
  <a style="font-size: 18px ; padding-left: 2000px; color: darkgrey" > '.$body .'<?=$body?> </a>

</body>
</html>';


/*
function mails(){
  
  // Crear una nueva  instancia de PHPMailer habilitando el tratamiento de excepciones
  $mail = new PHPMailer(true);
  // Configuramos el protocolo SMTP con autenticaci�n

  $mail->IsSMTP();
  $mail->SMTPAuth = false;
  //$mail->SMTPSecure = "tls";
  // $mail->SMTPDebug  = 2;                     // enables SMTP debug information (for testing)
  // Puerto de escucha del servidor
  $mail->Port       = 25;
  // Direcci�n del servidor SMTP
  $mail->Host       = "smtp.frba.utn.edu.ar";

  // Usuario y contrase�a para autenticaci�n en el servidor

  //$mail->Username   = "javier.sz.33@gmail.com";

  //$mail->Password = "";
  $mail->IsHTML(true);

  $mail->    MsgHTML($html);
  //$mail->AddReplyTo("name@yourdomain.com","First Last");

  $mail->Subject    = $asunto;

  $mail->AltBody    = $body; // optional, comment out and test

  $mail->  AddAddress($address, $nombre);
  $mail->AddBCC($addressCC);

  $mail->SetFrom('disilab-soporte@sistemas.frba.utn.edu.ar', 'UTN-DisiLAB');

  if(!$mail->Send()) {

      echo "Mailer Error: " . $mail->ErrorInfo;

  } else {

      echo "Message sent!";

  }
}
*/

function confirmacionReservaBody($name, $labName, $from, $until, $subjectName, $labCapacity, $ticketNumber) {
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Estimado/a '. $name .',<br />
      <br />
      Le informamos que el pedido realizado a trav�s de nuestro sistema de reservas ha sido confirmado.<br />
      <br />
      Queda reservado el Laboratorio '. $labName .' para el d�a [DiaNombre] '. $from->format('d-m-Y') .' de '. $from->format('H:i:s') .' a 
      '. $until->format('H:i:s') .' para la materia '. $subjectName .' con capacidad para '. $labCapacity .' de alumnos.<br />
      <br />
      Esta reserva queda registrada bajo el Ticket N�: '. $ticketNumber .'.<br />
      <br />
      Desde ya muchas gracias.<br />      
      <br />
      <div align="left" style=" border-style: double; width: 342px; height:92px" >
        <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
      </div>
    </body>
  </html>
  ';
  return $body;
}

function pedidoCambioReservaBody($name, $labName, $from, $until, $subjectName, $labCapacity){
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Estimado/a '. $name .',<br />
      <br />
      Le informamos que el pedido realizado a trav�s de nuestro sistema de reservas no se encuentra disponible. 
      Por esto, le pedimos que elija otra alternativa.<br />
      <br />
      Su pedido fue para el Laboratorio '. $labName .' para el d�a [Nombre D�a] '. $from->format('d-m-Y') .' de '. $from->format('H:i:s') .' a 
      '. $until->format('H:i:s') .' para la materia '. $subjectName .' con capacidad para '. $labCapacity .' de alumnos.<br />
      <br />
      Haga click en el siguiente link para elegir otra alternativa: [Link].<br />
      <br />
      Desde ya muchas gracias.<br />
      <br />
      <div align="left" style=" border-style: double; width: 342px; height:92px" >
        <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
      </div>
    </body>
  </html>
  ';
  return $body;
}

function noDisponibilidadReservaBody($name, $labName, $from, $until, $subjectName, $labCapacity){
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Estimado/a '. $name .',<br />
      <br />
      Le comunicamos que el pedido realizado a trav�s de nuestro sistema de reservas no se encuentra disponible.<br />
      <br />
      Su pedido fue para el Laboratorio '. $labName .' para el d�a [Nombre D�a] '. $from->format('d-m-Y') .' de '. $from->format('H:i:s') .' a 
      '. $until->format('H:i:s') .' para la materia '. $subjectName .' con capacidad para '. $labCapacity .' de alumnos.<br />
      <br />
      Para obtener mayor informaci�n puede comunicarse respondiendo este email o llamando al 4867�7554.<br />
      <br />
      Desde ya muchas gracias.<br />
      <br />
      <div align="left" style=" border-style: double; width: 342px; height:92px" >
        <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
      </div>
    </body>
  </html>
  ';
  return $body;
}

function avisoPedidoAlLaboratorioBody($name, $labName, $from, $until, $subjectName) {
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Hay un pedido de reserva para el Laboratorio '. $labName .' para el d�a [Nombre D�a] '. $from->format('d-m-Y') .' de 
      '. $from->format('H:i:s') .' a '. $until->format('H:i:s') .' para la materia '. $subjectName .' solicitado por '. $name .'. <br />
      <br />
      Esta solicitud est� pendiente para procesar.
    </body>
  </html>
  ';
  return $body;
}


function generarBody($tipo, $name, $labName, $from, $until, $subjectName, $labCapacity, $ticketNumber) {
  switch ($tipo) {
    case 'confirmacionReserva':
      return $body = confirmacionReservaBody($name, $labName, $from, $until, $subjectName, $labCapacity, $ticketNumber);
      break;
    case 'pedidoCambioReserva':
      return $body = pedidoCambioReservaBody($name, $labName, $from, $until, $subjectName, $labCapacity);
      break;
    case 'noDisponibilidadReserva':
      return $body = noDisponibilidadReservaBody($name, $labName, $from, $until, $subjectName, $labCapacity);
      break;
    case 'avisoPedidoAlLaboratorio':
      return $body = avisoPedidoAlLaboratorioBody($name, $labName, $from, $until, $subjectName);
      break;
    default:
      error_log("Error al generar el body del mail");
      break;
  }
}


//SE ESTA EDITANDO MAL LA HORA DE $from y $until, NO REFLEJA EL HORARIO REAL.
function mails($body) {
  $subject = "Subject 3.0";  
  $address = "costanzo.ji@gmail.com";
  $name = "Juan Ignacio";

  $labName ='Azul';
  //Genero un DateTime random para probar cosas locaaasss
  $from = new DateTime();
  $until = new DateTime();   
  /*$from->setDate(2015, 09, 29);
  $from->setTime(16, 15);*/

  $tipo = 'confirmacionReserva';  
  $subjectName = 'Sistemas Operativos';
  $labCapacity = '5000';
  $ticketNumber = '1239875';

  //$body = file_get_contents('./mail_format/confirmacionReserva.html');
  //$body = generarBody($tipo, $name, $labName, $from, $until, $subjectName, $labCapacity, $ticketNumber);
  $mail = new PHPMailer;

  $mail->IsSMTP();
  $mail->Host = "smtp.frba.utn.edu.ar";
  $mail->SMTPAuth = false; //No hace falta autenticarse en el SMTP server de la facultad
  $mail->SMTPSecure = 'tls';
  $mail->Port = 25;

  $mail->SetFrom('disilab-soporte@sistemas.frba.utn.edu.ar', 'UTN-DisiLAB');
  $mail->AddAddress($address);

  $mail->IsHTML(true);
  $mail->Subject = $subject;
  $mail->Body = $body;

  $mail->SMTPDebug = 3; //Usar 3 cuando es para testing, usar 0 para produccion

  if (!$mail->Send()) {
    error_log('Error de mailing: ' . $mail->ErrorInfo);
  } else {
    error_log('Nuevo y mejorado todo legal 3.0');
  }
}


function avisoPedidoAlLaboratorioMail($user, $lab, $beginDate, $endDate, $subject) {
  $body = avisoPedidoAlLaboratorioBody($user->name, $lab->name, $beginDate, $endDate, $subject);
  mails($body);
}

function confirmacionReservaMail($user, $lab, $beginDate, $endDate, $subject){
  //FALTA EL TICKET NUMBER!!!!
  //$userMail = $user->email;
  $body = confirmacionReservaBody($user->name, $lab->name, $beginDate, $endDate, $subject, $lab->size, 951753);
  mails($body);
}

?>