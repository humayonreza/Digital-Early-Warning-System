<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
	
	include('../connect/connect.php');
	$output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$client = $request->client;
	
	// Ser clientId isLive  :: isclientlivelist
	$sql_updt="Update isclientlivelist set isLive = 0 Where clientId = $client";
	$sql = mysqli_query($connect,$sql_updt) or die(mysqli_error()); 
	// $output = 200;
	echo json_encode(201);
	// mysqli_close($connect);
?>