<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	$output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	// Ser,date,acId,speed,height,origin,heading,lat,lng

	// 	baseId: undefined
	// tgtId: undefined
	// Ser,attkId,Origid,BaseId,TgtId,Tacs,active
	// $d = date("Y-m-d");
	// $attkDate = date("Y-m-d", strtotime($d. ' + 0 days'));
	
	$origin = 2;
	$baseId = $request->baseId;
	$tgtId = $request->tgtId;	
	$tacs = 4;
	$active = 1;

	$sql="Select max(Ser) from createairattkindex";
	$sql = mysqli_query($connect,$sql) or die(mysqli_error());
	while($row = mysqli_fetch_array($sql))
	{
		$Ser = ($row['0']==0) ? 1 : $row['0'] + 1;
	} 
	$query = "INSERT INTO createairattkindex (Ser,attkId,Origid,BaseId,TgtId,Tacs,active) VALUES ($Ser,$Ser,
	$origin,$baseId,$tgtId,$tacs,$active)"; 
	$resp = mysqli_query($connect, $query) ? $Ser : 401;
	echo json_encode($resp);	
?>