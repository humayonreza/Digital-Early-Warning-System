<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	// $output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$reset_id = $request->resetId;
	if ($reset_id == 5232) 
	{
		$sql="DELETE FROM flightdata WHERE Ser > 0";
		$sql = mysqli_query($connect,$sql);
		echo json_encode(200);
	}
	else {
		echo json_encode(401);
	}
?>



