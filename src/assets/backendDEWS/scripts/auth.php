<?php
	header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
	include('../connect/connect.php');
	$output = array();  
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$userId = $request->UserId;
	$upassword = $request->Password;

	$header ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
	// $query = "SELECT *from auth where userName = '$uName' And userPassword ='$upassword'";  

	// echo json_encode($userId);
	$query = "SELECT 
	auth.Ser as Ser, 
	auth.userId as userId, 
	auth.category as category, 
	auth.menuId as menuId,
	auth.pid as pid, 
	auth.uid as uid, 
	auth.secString as secString,
	elementinfo.isIndependent as isIndependent
	FROM auth, elementinfo
	WHERE auth.uid = elementinfo.ElementId 
	AND  auth.userId = '$userId' And auth.userPassword ='$upassword'";  

	$result = mysqli_query($connect, $query);  
	if(mysqli_num_rows($result) > 0)  
	{  
		while($row = mysqli_fetch_assoc($result)) 
		{ 
		   $client = $row["uid"];
		   $output[] = $row;
		   $secStr = $row["secString"];  
		}  
		$data = json_encode($output);
		$data = ltrim($data, '['); 
		$data = rtrim($data, ']'); 
		$encoded_dbresponse = base64_encode($data);
		$encoded_backend_response = $header.".".$encoded_dbresponse.".".$secStr;
		echo json_encode($encoded_backend_response);
		$sql_updt="Update isclientlivelist set isLive = 1 Where clientId = $client";
		$sql = mysqli_query($connect,$sql_updt) or die(mysqli_error());
		// echo json_encode($encoded_backend_response);
	}  
	else 
	{
		$output =401;
		echo json_encode($output);
	}
 
?>


