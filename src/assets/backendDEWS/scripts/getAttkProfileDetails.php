<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	// $output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$id = $request->id;
	// echo json_encode($id);

	$sql="SELECT * FROM createairattkindexdata WHERE attkId = $id ORDER BY Ser";
	
	
	$result = mysqli_query($connect, $sql);  
	if(mysqli_num_rows($result) > 0)  
	{  
		while($row = mysqli_fetch_assoc($result))  
		{  
	    	$output[] = $row;  
		}  
		echo json_encode($output);  
	}  
	mysqli_close($connect);
 
?>


