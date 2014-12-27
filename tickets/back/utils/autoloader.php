<?php
spl_autoload_register(function ($className) { 
	$directorys = array(
		'model/',
		'model/database/',
		'database/'
	);
        
	//for each directory
	foreach($directorys as $directory)
	{
		$filename = $directory.strtolower($className).'.class.php';
		if (file_exists($filename)) { 
			require_once $filename; 
			return true; 
		}
	}				
	return false; 
});
?>