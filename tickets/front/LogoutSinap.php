</html>
<head>
</head>
<body>
<?php
	require_once '/var/www/saml/lib/_autoload.php';
	$auth= new SimpleSAML_Auth_Simple('default-sp');
	if ($auth->isAuthenticated()){
//		$auth->logout();
		$auth->logout(array(
		    'ReturnTo' => 'http://10.11.0.138/tickets/front/',
//			'ReturnCallback' => cerrarSesion(),
//		    'ReturnStateParam' => 'LogoutState',
//		    'ReturnStateStage' => 'MyLogoutState',
		));
	}
?>
</body>
</html>
