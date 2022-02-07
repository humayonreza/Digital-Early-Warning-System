<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
	 
	include('../connect/connect.php');
	$output = array();

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$unitId = $request->unitId;
	if (isset($unitId))
	{
		$query = "SELECT 
		deployment.Ser as Ser, 
		deployment.DeploymentId as DeploymentId,
		deployment.ElementId as ElementId, 
		deployment.lat as lat, 
		deployment.lng as lng, 
		elementinfo.ElementName as ElementName 
		From deployment, elementinfo 
		Where deployment.ElementId = elementinfo.ElementId 
		AND deployment.isActive = 1 And deployment.ElementId = $unitId";  

		$result = mysqli_query($connect, $query);  
		if(mysqli_num_rows($result) > 0)  
		{  
			while($row = mysqli_fetch_assoc($result)) 
			{  
		  		 $output[] = $row;  
			}  
			echo json_encode($output);  
		}  

	}
	else {
		$output = "401";
		echo json_encode($output);
	}

	 
 
?>