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

	$sql="select isIndependent from elementinfo Where ElementId= $id";
	$sql = mysqli_query($connect,$sql) or die(mysqli_error());
	while($row = mysqli_fetch_array($sql))
	{
		$isIndep=$row['isIndependent'];	
		echo json_encode($isIndep);
	}
	
	// $header ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
	// // $query = "SELECT *from auth where userName = '$uName' And userPassword ='$upassword'";  

	// $query = "SELECT 
	// auth.Ser as Ser, 
	// auth.userName as userName, 
	// auth.userPassword as userPassword, 
	// auth.category as category, 
	// auth.pid as pid, 
	// auth.uid as uid, 
	// auth.secString as secString
	// FROM auth
	// WHERE auth.userName = '$uName' And auth.userPassword ='$upassword'";  

	// $result = mysqli_query($connect, $query);  
	// if(mysqli_num_rows($result) > 0)  
	// {  
	// 	while($row = mysqli_fetch_assoc($result)) 
	// 	{  
	// 	   $output[] = $row;
	// 	   $secStr = $row["secString"];  
	// 	}  
	// 	$data = json_encode($output);
	// 	$data = ltrim($data, '['); 
	// 	$data = rtrim($data, ']'); 
	// 	$encoded_dbresponse = base64_encode($data);
	// 	$encoded_backend_response = $header.".".$encoded_dbresponse.".".$secStr;
	// 	// $encoded_backend_response = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
	// 	echo json_encode($encoded_backend_response);
	// }  
	// else 
	// {
	// 	$output =401;
	// 	echo json_encode($output);
	// }
 
?>


