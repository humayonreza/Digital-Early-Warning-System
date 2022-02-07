<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	$output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	// Ser,date,acId,speed,height,origin,heading,lat,lng
	$d = date("Y-m-d");
	$dateCO = date("Y-m-d", strtotime($d. ' + 0 days'));

	$t= date('H:i:s');
	$timeCO = date('H:i:s',strtotime('+8 hour',strtotime($t)));

	$elmId = $request->elmId;
	$idCO = $request->coId;	
	// $NewCO = $elmId.$idCO;

	$sql="SELECT max(Ser) FROM controlorder";
	$sql = mysqli_query($connect,$sql) or die(mysqli_error());
	while($row = mysqli_fetch_array($sql))
	{
		$ser = ($row['0']==0) ? 1 : $row['0'] + 1;
	} 
	if(isset($elmId) && isset($idCO)){
	$query = "INSERT INTO controlorder (Ser,elementId,idCO,dateCO,timeCO) VALUES ($ser,$elmId,$idCO,'$dateCO',
	'$timeCO')"; 
	$resp = mysqli_query($connect, $query) ? 201 : 401;
	echo json_encode($resp);
	}

	$sqlRemoveDupicate="DELETE t1 FROM controlorder t1 INNER JOIN controlorder t2 
	WHERE t1.Ser < t2.Ser 
	AND t1.idCO = t2.idCO 
	AND t1.elementId = t2.elementId 
	AND t1.dateCO = t2.dateCO 
	AND t1.timeCO = t2.timeCO";
	$sql = mysqli_query($connect,$sqlRemoveDupicate) or die(mysqli_error());
?>