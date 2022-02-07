<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
 
include('../connect/connect.php');
$output = array();  
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = $request->id;
// echo json_encode($id);   

$query = "SELECT 
createairattkindex.Ser as Ser,
createairattkindex.attkId as attkId,
createairattkindex.Origid as Origid,
createairattkindex.BaseId as BaseId,
createairattkindex.TgtId as TgtId,
createairattkindex.Tacs as Tacs,
createairattkindex.active as active,
elementinfo.ElementName as TgtName 
FROM createairattkindex,elementinfo 
WHERE createairattkindex.TgtId = elementinfo.ElementId AND createairattkindex.BaseId = $id 
ORDER BY createairattkindex.Ser";  

$result = mysqli_query($connect, $query);  
if(mysqli_num_rows($result) > 0)  
{  
  while($row = mysqli_fetch_assoc($result)) 
  {  
       $output[] = $row;  
  }  
  echo json_encode($output);    
}  
 
?>







