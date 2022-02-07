<?php 

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers'); 
 include('../connect/connect.php');
 $data = json_decode(file_get_contents("php://input")); 
 $output = array();  
 
 $query = "SELECT DISTINCT 
 intruderprofile_ops.Ser,
 intruderprofile_ops.Attk_date_time, 
 intruderprofile_ops.Attk_ser, 
 intruderprofile_ops.Origid, 
 intruderprofile_ops.Ht, 
 intruderprofile_ops.Speed, 
 intruderprofile_ops.Tacs, 
 intruderprofile_ops.lat, 
 intruderprofile_ops.lng, 
 intruderprofile_ops.heading,
 intruderprofile_ops.Ac_id,
 intruderprofile_ops.FOE_Id,
 intruderprofile_ops.Sender_Id  
 FROM intruderprofile_ops Order by intruderprofile_ops.Attk_ser desc";

 $result = mysqli_query($connect, $query);  
 if(mysqli_num_rows($result) > 0)  
 {  
      while($row = mysqli_fetch_assoc($result))  
      {  
           $output[] = $row;  
      }  
      echo json_encode($output);  
 } 
 else{
 	$output[] = "401";
 	echo json_encode($output); 
 } 
 mysqli_close($connect);
?> 