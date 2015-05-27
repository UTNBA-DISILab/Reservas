Reservas
========

Reservas_disilab.sql es el script para crear todas las tablas de la BD.

	$host = "localhost";
	$user = "sistemasmysql";
	$password = "17sistemassql06";
	$database_name = "reservas_disilab";

Y tambien es para glpi database

LOGIN

Front:

header-html =>  funcion iniciarSesionConGLPI()

Definida en ComunicadorConServidorService(ver tema de la url dejarlo asi relativo al proyecto front o cambiarlo?)

Hace un post a localhost/back/glpi_login

=>Delega el login a Back

En login.php se encuentra definida la función de login:
function loginGLPIUser($username, $password) {
if(RD_USE_GLPI) {
	return authorizeGLPIUser($username, $password);
} else {
	return array("id"=>"rgarbarini","name"=>"Ramiro Garbarini","email"=>"rgarbarini@frba.utn.edu.ar","level"=>2);
}

include_once 'utils/includes.php';
if(RD_USE_GLPI) {
	include_once 'utils/glpi_authorize.php';
}

La variable RD_USE_GLPI Esta por defecto en false definida en includes.php

define("RD_USE_MAIL", false);
define("RD_USE_GLPI", true);
define("RD_USE_SAML", false);

Que a su ves delega en esta otra función
authorizeGLPIUser($username, $password);

Definida en back/ultil/glpi_authorize.php.

Delega en authGLPIUserWithDB

Problema: Da error porque no encuentra esa url localhost/back/glpi_login. 404 not found.
The requested URL /back/glpi_login was not found on this server.
