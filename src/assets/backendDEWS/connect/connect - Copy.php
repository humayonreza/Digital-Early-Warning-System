<?php

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 

	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$dbname = "dews";
	$connect = new mysqli($servername, $username, $password, $dbname);
	if ($connect->connect_error) 
	{
		die("Connection failed: " . $connect->connect_error);
	} 
?>