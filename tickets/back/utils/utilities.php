<?php
/**
* Tickets System utilities funcions

*/
function objToUTF8($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = objToUTF8($value);
        }
    } else if (is_string ($mixed)) {
        return utf8_encode($mixed);
    }
    return $mixed;
}

//-----------------------------------------------------------

function returnError($error_code, $error_msg) {
	http_response_code($error_code);
	echo "Error:".$error_msg;
}

//-----------------------------------------------------------

function validateLab(&$dbhandler, $lab_id) {
	$x = new Lab();
	$x->id = $lab_id;
	if(!$x->load($dbhandler)) {
		return false;
	}
	return $x;
}

function validateSubject(&$dbhandler, $subject_id) {
	$x = new Subject();
	$x->id = $subject_id;
	if(!$x->load($dbhandler)) {
		return false;
	}
	return $subject;
}

function validateUser(&$dbhandler, $user_id) {
	$x = new User();
	$x->id = $user_id;
	if(!$x->load($dbhandler)) {
		return false;
	}
	return $x;
}

function validateReservation(&$dbhandler, $res_id) {
	$x = new Reservation();
	$x->id = $res_id;
	if(!$x->load($dbhandler)) {
		return false;
	}
	return $x;
}
?>