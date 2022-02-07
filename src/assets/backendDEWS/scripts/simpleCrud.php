<?php
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');


include('../connect/connect.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$rowId = $request->rowId;
$crudId = $request->crudId;
$tabName = $request->tabName;

if ($crudId == 3)
{
	$deleteSql = "Delete From " . $tabName .  " Where Ser =" . $rowId; 
	if(mysqli_query($connect, $deleteSql))  
	{  
	    // $resp = "Data Deleted Successfully , Id : " . $rowId;   
      	// echo json_encode($resp);
      	echo json_encode($rowId);
	}  
	else  
	{  
	    echo 'Error during Delete';  
	}  
}
else 
{
	$loop_no = $request->colNumber; 
	if (!empty($request->rowValue1)) { $rowVal1 = $request->rowValue1; }
	if (!empty($request->rowValue2)) { $rowVal2 = $request->rowValue2; }
	if (!empty($request->rowValue3)) { $rowVal3 = $request->rowValue3; }
	if (!empty($request->rowValue4)) { $rowVal4 = $request->rowValue4; }
	if (!empty($request->rowValue5)) { $rowVal5 = $request->rowValue5; }
	if (!empty($request->rowValue6)) { $rowVal6 = $request->rowValue6; }
	if (!empty($request->rowValue7)) { $rowVal7 = $request->rowValue7; }
	if (!empty($request->rowValue8)) { $rowVal8 = $request->rowValue8; }
	if (!empty($request->rowValue9)) { $rowVal9 = $request->rowValue9; }
	if (!empty($request->rowValue10)) { $rowVal10 = $request->rowValue10; }

	if (!empty($request->colHeaderList)) 
	{ 
		$colHeaderList = $request->colHeaderList; 
		$colName = explode(":",$colHeaderList);
		// $loop_no = sizeof($colName);
	}

	if (!empty($loop_no)) 
	{ 
		// $loop_no = $request->colNumber; 
		if ($loop_no ==1){ $array_str = array($rowVal1); }
		else if ($loop_no ==2){ $array_str = array($rowVal1,$rowVal2); }
		else if ($loop_no ==3){ $array_str = array($rowVal1,$rowVal2,$rowVal3); }
		else if ($loop_no ==4){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4); }
		else if ($loop_no ==5){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4,$rowVal5); }
		else if ($loop_no ==6){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4,$rowVal5,$rowVal6); }
		else if ($loop_no ==7){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4,$rowVal5,$rowVal6,
		$rowVal7); }
		else if ($loop_no ==8){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4,$rowVal5,$rowVal6,
		$rowVal7,$rowVal8); }
		else if ($loop_no ==9){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4,$rowVal5,$rowVal6,
		$rowVal7,$rowVal8,$rowVal9); }
		else if ($loop_no ==10){ $array_str = array($rowVal1,$rowVal2,$rowVal3,$rowVal4,$rowVal5,$rowVal6,
		$rowVal7,$rowVal8,$rowVal9,$rowVal10); }

	}

	$updateStr="";
	$insertStr="";

	// if ($crudId == 1 || $crudId ==2) 
	// {
	for ($i = 0; $i < $loop_no; $i++) 
	{

		if (is_numeric($array_str[$i]))
		{
			if ($i <$loop_no-1)
			{			
				$v = $array_str[$i];
				if ($crudId ==1)
				{
					$insertStr = $insertStr . $v . ", ";
				}
				else
				{
					$updateStr = $updateStr . $colName[$i] . " = " . $array_str[$i] . ", ";
				}	
			}
			else
			{
				$v = $array_str[$i];
				if ($crudId ==1)
				{
					$insertStr = $insertStr . $v;
				}
				else 
				{
					$updateStr = $updateStr . $colName[$i] . " = " . $array_str[$i];
				}					
			}		
		}
		else
		{
			if ($i <$loop_no-1)
			{
				$v = $array_str[$i];
				if ($crudId ==1)
				{
					$insertStr = $insertStr . "'" . $v . "'" . ", ";
				}
				else
				{

					$updateStr = $updateStr . $colName[$i] . " = " . "'" . $array_str[$i] . "'" . ", ";
				}
			}
			else 
			{
				$v = $array_str[$i];
				if ($crudId ==1)
				{
					$insertStr = $insertStr . "'" . $v . "'";
				}
				else
				{
					$updateStr = $updateStr . $colName[$i] . " = " . "'" . $array_str[$i] . "'";
				}				
			}		
		}    
	} 
	// }

	if ($crudId == 1)
	{
		// $sql="select max(ser) from " . $tabName;
		// $sql = mysqli_query($connect,$sql) or die(mysqli_error());
		// while($row = mysqli_fetch_array($sql))
		// {
		// 	$maxId=$row['0'];
		// 	if ($row['0']==0) { $maxId=$maxId+1; } else { $maxId=$maxId+1; }
		// }

		$insertStr = $rowId . ", " . $insertStr;

		$insertSql = "Insert Into " . $tabName . " Values (" . $insertStr . ")" ;
		if(mysqli_query($connect, $insertSql))  
		{  
		    // echo "Data Inserted Successfully , Id : " .  $rowId; 
		    // $resp = "Data Inserted Successfully , Id : " . $rowId;   
      		// echo json_encode($resp);
			echo json_encode($rowId);

		}  
		else  
		{  
		    echo 'Error during insert' . $insertStr;  
		    // echo $insertSql . " " . $tabName;
		} 
		 
	}
	else //if ($crudId == 2) 
	{

		$updateSql = "Update " . $tabName . " Set " . $updateStr . " Where Ser =" . $rowId; 
		if(mysqli_query($connect, $updateSql))  
		{  
		    // $resp = "Data Updated Successfully..." . " " . $loop_no;   
      		// echo json_encode($resp);
			echo json_encode($rowId);

		}  
		else  
		{  
		    echo 'Error during Update' . $updateSql;  
		} 
		// echo $updateSql;
	}
}

?>



	