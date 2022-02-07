<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	$output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$menuId = $request->menuId;	
	// $stage = $request->stage;	
	// echo json_encode($stage);
	if (isset($menuId))
	{
		$query = "SELECT *FROM menu WHERE menuId = $menuId ORDER BY Ser DESC";  
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
	else 
	{
		$output =401;
		echo json_encode($output);
	}	
?>


