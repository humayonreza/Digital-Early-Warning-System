<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	$output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	// Ser,attkId,Ht,Speed,lat,lng

	$attkId = $request->attkId;
	$height = $request->height;
	$speed = $request->speed;	
	$lat = $request->lat;
	$lng = $request->lng;

	$sql="Select max(Ser) from createairattkindexdata";
	$sql = mysqli_query($connect,$sql) or die(mysqli_error());
	while($row = mysqli_fetch_array($sql))
	{
		$ser = ($row['0']==0) ? 1 : $row['0'] + 1;
	} 
	$query = "INSERT INTO createairattkindexdata (Ser,attkId,Ht,Speed,lat,lng) VALUES ($ser,$attkId,
	$height,$speed,$lat,$lng)"; 
	$resp = mysqli_query($connect, $query) ? $attkId : 401;
	echo json_encode($resp);	
?>