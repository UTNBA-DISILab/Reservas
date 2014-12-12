<?php 

// Defines to enable/disable some functionalities
//----------------------------------------------------
define("RD_USE_MAIL", false);
define("RD_USE_GLPI", false);
define("RD_USE_SAML", false);

// Includes
//----------------------------------------------------
include_once 'utils/autoloader.php';
include_once 'utils/init_db.php';
include_once 'utils/user_session.php';
include_once 'utils/utilities.php';
include_once 'utils/email.php';
include_once 'model/consts.php';
?>