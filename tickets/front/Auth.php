<html>
<head>
</head>
<body>
	<?php
		require_once '/var/www/saml/lib/_autoload.php';
		$auth= new SimpleSAML_Auth_Simple('default-sp');
		if (!$auth->isAuthenticated()){
				$auth->login(array(
//	    			'ErrorURL' => 'http://10.11.0.138/tickets/front/error_handler.php',
					'ReturnTo' => 'http://10.11.0.138/tickets/front/',
//					'KeepPost' => false,
				));
		}
	?>
</body>


