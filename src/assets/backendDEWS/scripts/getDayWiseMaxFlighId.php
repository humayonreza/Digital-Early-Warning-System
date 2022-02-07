<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
 
include('../connect/connect.php');
$output = array();  

$d = date("Y-m-d");
$attkDate = date("Y-m-d", strtotime($d. ' + 0 days'));

$sql="SELECT max(Ser) FROM daywisemaxflighid";
$sql = mysqli_query($connect,$sql) or die(mysqli_error());
while($row = mysqli_fetch_array($sql))
{
	$ser  = ($row['0'] == 0) ? 1 : $row['0'] + 1;	
} 

$sql="SELECT max(acId) FROM daywisemaxflighid WHERE attkDate = '$attkDate'";
$sql = mysqli_query($connect,$sql) or die(mysqli_error());
while($row = mysqli_fetch_array($sql))
{
	$flightId  = ($row['0'] == 0) ? 101 : $row['0'] + 1;	
} 


$queryInsert="INSERT INTO daywisemaxflighid VALUES($ser,'$attkDate',$flightId)";
mysqli_query($connect,$queryInsert);

$query = "SELECT Max(acId) as flightId FROM daywisemaxflighid WHERE attkDate = '$attkDate'";  
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