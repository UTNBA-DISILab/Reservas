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

//TODO: Hablar con el subditic que usuario y pass usar...
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

?>
