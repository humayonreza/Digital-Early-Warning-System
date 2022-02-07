<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
	 
	include('../connect/connect.php');
	$output = array();

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$syString = $request->syString;
	if (isset($syString) && $syString == "h@#5232")
	{
		$query = "SELECT 
		deployment.Ser as Ser, 
		deployment.DeploymentId as DeploymentId, 
		deployment.DeploymentDate as DeploymentDate, 
		deployment.ElementId as ElementId, 
		deployment.lat as lat, 
		deployment.lng as lng, 
		elementinfo.BaseId as BaseId, 
		elementinfo.ElementName as ElementName, 
		elementinfo.Info as Info, 
		elementinfo.Type as Type, 
		elementinfo.Origin as Origin, 
		elementinfo.OpRange as OpRange, 
		elementinfo.isIndependent as isIndependent 
		From deployment, elementinfo 
		Where deployment.ElementId = elementinfo.ElementId 
		AND deployment.isActive = 1 Order by deployment.Ser";  

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