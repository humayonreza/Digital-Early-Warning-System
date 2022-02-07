<?php
    
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
include('../connect/connect.php');
    // Ser UnitId UnitName UnitOriginId UnitTypeId UnitInfo lat lng ex_name
	$currentLat = $_GET['currentLat'];
	$currentLong = $_GET['currentLong'];
	
	$sql="SELECT Max(Ser) FROM geodata";
	$sql = mysqli_query($connect,$sql) or die(mysqli_error());
	while($row = mysqli_fetch_array($sql))
	{
		$ser = ($row['0']==0) ? 1 : $row['0'] + 1;
	} 
	$sql_ins="INSERT INTO geodata VALUES($ser,$currentLat,$currentLong)";
	$sql = mysqli_query($connect,$sql_ins) or die(mysqli_error());
	mysqli_close($connect);
?>