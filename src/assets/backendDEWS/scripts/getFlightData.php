<?php 
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
 

 include('../connect/connect.php');
 $data = json_decode(file_get_contents("php://input")); 
 $output = array();  

 // $query = "SELECT Ser,attkDate,acId,speed,height,origin,heading,lat,lng FROM flightdata WHERE Ser =(SELECT MAX(Ser) FROM flightdata)";

 $query = "SELECT  *FROM flightdata ORDER BY acId";

 $result = mysqli_query($connect, $query);  
 if(mysqli_num_rows($result) > 0)  
 {  
	while($row = mysqli_fetch_assoc($result))  
	{  
	    $output[] = $row;  
	}  
	echo json_encode($output);  
 }
 else 
 {
		echo json_encode("401");
 }  
 mysqli_close($connect);

 // SELECT Max(Ser),acId, lat,lng FROM flightdata Group by acId
?> 