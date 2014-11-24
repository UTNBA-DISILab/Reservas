<?php
/**
* Tickets System email script

*/
function sendEmailForReservation(&$reservation) {
	$title = "";
	$to = "";
	$msg = "";
	$headers = "";
	return mail($to,$title,$msg,$headers);
}
?>