<?php

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 

	include('../connect/connect.php');
	$client = $_GET['client'];
	$sql_updt="Update test_client_conn set admin_token = 1,client_token = 0 Where client_id=$client";
	$sql = mysqli_query($connect,$sql_updt) or die(mysqli_error());
	mysqli_close($connect);
?>