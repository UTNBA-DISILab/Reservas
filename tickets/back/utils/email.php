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
  // Configuramos el protocolo SMTP con autenticación

  $mail->IsSMTP();
  $mail->SMTPAuth = false;
  //$mail->SMTPSecure = "tls";
  // $mail->SMTPDebug  = 2;                     // enables SMTP debug information (for testing)
  // Puerto de escucha del servidor
  $mail->Port       = 25;
  // Dirección del servidor SMTP
  $mail->Host       = "smtp.frba.utn.edu.ar";

  // Usuario y contraseña para autenticación en el servidor

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

function confirmacionReservaBody() {
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Estimado/a [Nombre] [Apellido],<br />
      <br />
      Le informamos que el pedido realizado a través de nuestro sistema de reservas ha sido confirmado.<br />
      <br />
      Queda reservado el Laboratorio [Lab] para el día [Nombre Día] [Día] [Mes] [Año] de [Hora Inicio] a 
      [Hora Fin] para la materia [Materia] con capacidad para [Cantidad] de alumnos.<br />
      <br />
      Esta reserva queda registrada bajo el Ticket N°: [Nro Ticket].<br />
      <br />
      Desde ya muchas gracias.<br />

      [USAR FIRMA DENTRO DE DOCUMENTACION]
      <br />
      <div align="left" style=" border-style: double; width: 342px; height:92px" >
        <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
      </div>
    </body>
  </html>
  ';
  return $body;
}

function pedidoCambioReservaBody(){
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Estimado/a [Nombre] [Apellido],<br />
      <br />
      Le informamos que el pedido realizado a través de nuestro sistema de reservas no se encuentra disponible. 
      Por esto, le pedimos que elija otra alternativa.<br />
      <br />
      Su pedido fue para el Laboratorio [Lab] para el día [Nombre Día] [Día] [Mes] [Año] de [Hora Inicio] a 
      [Hora Fin] para la materia [Materia] con capacidad para [Cantidad] de alumnos.<br />
      <br />
      Haga click en el siguiente link para elegir otra alternativa: [Link].<br />
      <br />
      Desde ya muchas gracias.<br />

      [USAR FIRMA DENTRO DE DOCUMENTACION]
      <br />
      <div align="left" style=" border-style: double; width: 342px; height:92px" >
        <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
      </div>
    </body>
  </html>
  ';
  return $body;
}

function noDisponibilidadReservaBody(){
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Estimado/a [Nombre] [Apellido],<br />
      <br />
      Le comunicamos que el pedido realizado a través de nuestro sistema de reservas no se encuentra disponible.<br />
      <br />
      Su pedido fue para el Laboratorio [Lab] para el día [Nombre Día] [Día] [Mes] [Año] de [Hora Inicio] a 
      [Hora Fin] para la materia [Materia] con capacidad para [Cantidad] de alumnos.<br />
      <br />
      Para obtener mayor información puede comunicarse respondiendo este email o llamando al 4867­7554.<br />
      <br />
      Desde ya muchas gracias.<br />

      [USAR FIRMA DENTRO DE DOCUMENTACION]
      <br />
      <div align="left" style=" border-style: double; width: 342px; height:92px" >
        <a href="http://www.frba.utn.edu.ar/"><img src="http://www.siga.frba.utn.edu.ar/imag/news/utnba.png" height="90" width="340"></a>
      </div>
    </body>
  </html>
  ';
  return $body;
}

function avisoPedidoAlLaboratorioBody() {
  $body = 
  '
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <title>Reserva</title>
    </head>
    <body>    
      Hay un pedido de reserva para el Laboratorio [Lab] para el día [Nombre Día] [Día] [Mes] [Año] de 
      [Hora Inicio] a [Hora Fin] para la materia [Materia] solicitado por [Nombre] [Apellido]. <br />
      <br />
      Esta solicitud está pendiente para procesar.
    </body>
  </html>
  ';
  return $body;
}


function generarBody($tipo) {
  switch ($tipo) {
    case 'confirmacionReserva':
      $body = confirmacionReservaBody();
      break;
    case 'pedidoCambioReserva':
      $body = pedidoCambioReservaBody();
      break;
    case 'noDisponibilidadReserva':
      $body = noDisponibilidadReservaBody();
      break;
    case 'avisoPedidoAlLaboratorio':
      $body = avisoPedidoAlLaboratorioBody();
      break;
    default:
      error_log("Error al generar el body del mail");
      break;
  }
}

function mails() {
  $subject = "Subject 3.0";  
  $address = "costanzo.ji@gmail.com";
  $name = "Juan";

  //$body = file_get_contents('./mail_format/confirmacionReserva.html');
  $body = pedidoCambioReservaBody();
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

mails();

?>