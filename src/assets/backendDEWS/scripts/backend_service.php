<?php
header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
include('../connect/connect.php');
$output = array();  
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$queryId = mysqli_real_escape_string($connect, $request->queryId);  
$d = date("Y-m-d");
$currDate = date("Y-m-d", strtotime($d. ' + 0 days'));
$t= date('H:i:s');
$currTime = date('H:i:s',strtotime('+8 hour',strtotime($t)));

switch ($queryId) 
{
	case "0":
		// $menuId = $request->menuId;	
		// if (isset($menuId))
		// {
			$query = "SELECT *FROM menu  ORDER BY Ser DESC";  
			$result = mysqli_query($connect, $query);  
			if(mysqli_num_rows($result) > 0)  
			{  
				while($row = mysqli_fetch_assoc($result))  
				{  
					$output[] = $row;  
				}  
				echo json_encode($output);  
			}  
		// }
		// else 
		// {
		// 	$output =401;
		// 	echo json_encode($output);
		// }	
	break;

    case "1":
   		// Ser DeploymentId DeploymentDate ElementId lat lng isActive
    	$ElementId = mysqli_real_escape_string($connect, $request->ElementId); 
    	$ExName = mysqli_real_escape_string($connect, $request->ExName); 
		$lat = mysqli_real_escape_string($connect, $request->lat); 
		$lng = mysqli_real_escape_string($connect, $request->lng); 
		$DeploymentDate = $currDate; 
		$isActive = 1; 
		$sql="SELECT MAX(Ser), MAX(DeploymentId) FROM deployment";
		$sql = mysqli_query($connect,$sql) or die(mysqli_error());
		while($row = mysqli_fetch_array($sql))
		{
			$Ser = $row['0'] == 0 ?  $row['0'] + 1 : $row['0'] + 1;
			$DeploymentId = $row['1'] == 0 ?  $row['1'] + 1 : $row['1'] + 1;
		}		
		$query = "INSERT INTO deployment (Ser,DeploymentId,DeploymentDate,ElementId,ExName,lat,lng,isActive) VALUES (
		$Ser,$DeploymentId,'$DeploymentDate',$ElementId,'$ExName',$lat,$lng,$isActive)"; 
		$depl_id = array('DeploymentId' => $DeploymentId, 'Response' => "201");
		$output = mysqli_query($connect, $query) ? $depl_id : mysqli_error($connect);
		// $response = 
		echo json_encode($output);
		$sql="UPDATE deployment SET isActive = 0 WHERE  ElementId = $ElementId AND DeploymentId < $DeploymentId";
		$sql = mysqli_query($connect,$sql) or die(mysqli_error());
    break; 

    case "2":    	
    	$BaseId = mysqli_real_escape_string($connect, $request->ElementId);
		$sid1 = mysqli_real_escape_string($connect, $request->subunitId1);
		$sid2 = mysqli_real_escape_string($connect, $request->subunitId2);
		$sid3 =  mysqli_real_escape_string($connect, $request->subunitId3);

		$scs1 =  mysqli_real_escape_string($connect, $request->scs1);
		$scs2 =  mysqli_real_escape_string($connect, $request->scs2);
		$scs3 =  mysqli_real_escape_string($connect, $request->scs3);

		$bid1 = ($scs1 == 1) ? $sid1 : $BaseId;
		$bid2 = ($scs2 == 1) ? $sid2 : $BaseId;
		$bid3 = ($scs3 == 1) ? $sid3 : $BaseId;


		$stmt = $connect->prepare("UPDATE ElementInfo SET BaseId = ?, isIndependent = ? Where ElementID = ?");
		$stmt->bind_param("sss",$BaseId, $isIndependent, $ElementID);

		// set parameters and execute
		$BaseId = $bid1;
		$isIndependent = $scs1;
		$ElementID = $sid1;
		$stmt->execute();

		$BaseId = $bid2;
		$isIndependent = $scs2;
		$ElementID = $sid2;
		$stmt->execute();

		$BaseId = $bid3;
		$isIndependent = $scs3;
		$ElementID = $sid3;
		$stmt->execute();


		$response = "Command Status Updated Successfully";
		echo json_encode($response);  

		$stmt->close();
		// $connect->close();
    break; 

    case "3":  
    	$deployId = mysqli_real_escape_string($connect, $request->deploymentId);
		$secElementId = mysqli_real_escape_string($connect, $request->opSecName);
		$opLat = mysqli_real_escape_string($connect, $request->opLat);
		$opLng = mysqli_real_escape_string($connect, $request->opLng);	
		$lArc = mysqli_real_escape_string($connect, $request->opLtArc);
		$rArc = mysqli_real_escape_string($connect, $request->opRtArc);
		
		$sql="SELECT MAX(Ser) FROM sectorelmdeployment";
		$sql = mysqli_query($connect,$sql) or die(mysqli_error());
		while($row = mysqli_fetch_array($sql))
		{
			$Ser = $row['0'] == 0 ? $row['0'] + 1 : $row['0'] + 1;
		}

		$query = "INSERT INTO sectorelmdeployment (Ser,DeploymentId,secElementId,opLat,opLng,leftArc,rightArc) 
		VALUES ($Ser,$deployId,'$secElementId',$opLat,$opLng,'$lArc','$rArc')";  
		$secElmId = array('secElementId' => $secElementId, 'Response' => "201");
		$output = mysqli_query($connect, $query) ? $secElmId : mysqli_error($connect);
		echo json_encode($output);
 
	break; 
	
	case "4":  
    	$baseId = mysqli_real_escape_string($connect, $request->baseId);
		$tgtId = mysqli_real_escape_string($connect, $request->tgtId);
		$orig = mysqli_real_escape_string($connect, $request->orig);
		$tacs = 4;
		$active = 1;

		$sql="SELECT MAX(Ser) FROM createairattkindex";
		$sql = mysqli_query($connect,$sql) or die(mysqli_error());
		while($row = mysqli_fetch_array($sql))
		{
			$Ser = ($row['0']==0) ? 1 : $row['0'] + 1;
		} 
		$query = "INSERT INTO createairattkindex (Ser,attkId,Origid,BaseId,TgtId,Tacs,active) VALUES ($Ser,$Ser,
		$orig,$baseId,$tgtId,$tacs,$active)"; 
		$resp = mysqli_query($connect, $query) ? $Ser : 401;
		echo json_encode($resp);
 
	break; 

	case "5":
		$attkId = mysqli_real_escape_string($connect, $request->attkId);
		$speed = mysqli_real_escape_string($connect, $request->speed);	
		$height = mysqli_real_escape_string($connect, $request->height);		
		$lat = mysqli_real_escape_string($connect, $request->pLat);
		$lng = mysqli_real_escape_string($connect, $request->pLng);

		$sql="Select max(Ser) from createairattkindexdata";
		$sql = mysqli_query($connect,$sql) or die(mysqli_error());
		while($row = mysqli_fetch_array($sql))
		{
			$Ser = ($row['0']==0) ? 1 : $row['0'] + 1;
		} 
		$query = "INSERT INTO createairattkindexdata (Ser,attkId,Ht,Speed,lat,lng) VALUES ($Ser,$attkId,
		$height,$speed,$lat,$lng)"; 
		$resp = mysqli_query($connect, $query) ? $attkId : 401;
		echo json_encode($resp);
	break;

	case "6":
		$attkDate = $currDate;
		$acId = mysqli_real_escape_string($connect, $request->acId);
		$speed = mysqli_real_escape_string($connect, $request->speed);
		$height = mysqli_real_escape_string($connect, $request->height);
		$origin = mysqli_real_escape_string($connect, $request->origin);
		$heading = mysqli_real_escape_string($connect, $request->heading);
		$lat = mysqli_real_escape_string($connect, $request->lat);
		$lng = mysqli_real_escape_string($connect, $request->lng);
		$numberAc = 4;
		$isVisible = mysqli_real_escape_string($connect, $request->isVisible);
		$senderId = 0;
		// 
		$query = "SELECT Ser FROM flightdata WHERE acId = $acId";
		$result = mysqli_query($connect, $query);  
		if(mysqli_num_rows($result) > 0)  
		{  
			// Update
			$query = "UPDATE flightdata SET speed = $speed, height = $height, origin = $origin, 
			heading = $heading, lat = $lat, lng =$lng , numberAc = $numberAc, isVisible = $isVisible 
			WHERE acId = $acId"; 
			$resp = mysqli_query($connect, $query) ? 201 : 401;
			echo json_encode($resp);
		}
		else 
		{
			// Insert
			$sql="SELECT MAX(Ser) FROM flightdata";
			$sql = mysqli_query($connect,$sql) or die(mysqli_error());
			while($row = mysqli_fetch_array($sql))
			{
				$ser = ($row['0']==0) ? 1 : $row['0'] + 1;
			} 

			$query = "INSERT INTO flightdata (
			Ser,attkDate,acId,speed,height,origin,heading,lat,lng,numberAc,isVisible,senderId) VALUES
			($ser,'$attkDate',$acId,$speed,$height,$origin,$heading,$lat,$lng,$numberAc,$isVisible,
			$senderId)"; 
			$resp = mysqli_query($connect, $query) ? $ser : 401;
			echo json_encode($resp);
		}  

	break;

	case "7":
			$attkDate = $currDate;
			$sql="SELECT MAX(Ser) FROM daywisemaxflighid";
			$sql = mysqli_query($connect,$sql) or die(mysqli_error());
			while($row = mysqli_fetch_array($sql))
			{
				$ser  = ($row['0'] == 0) ? 1 : $row['0'] + 1;	
			} 

			$sql="SELECT MAX(acId) FROM daywisemaxflighid WHERE attkDate = '$attkDate' AND isSimGen = 1";
			$sql = mysqli_query($connect,$sql) or die(mysqli_error());
			while($row = mysqli_fetch_array($sql))
			{
				$flightId  = ($row['0'] == 0) ? 101 : $row['0'] + 1;	
			} 
			$isSimGen = 1;
			$queryInsert="INSERT INTO daywisemaxflighid VALUES($ser,'$attkDate',$flightId,$isSimGen)";
			mysqli_query($connect,$queryInsert);

			$query = "SELECT MAX(acId) AS flightId FROM daywisemaxflighid WHERE attkDate = '$attkDate' 
			AND isSimGen = 1";  
			$result = mysqli_query($connect, $query);  
			if(mysqli_num_rows($result) > 0)  
			{  
			  while($row = mysqli_fetch_assoc($result)) 
			  {  
			       $output[] = $row;  
			  }  
			  echo json_encode($output);    
			} 
	break;

	case "8":
			$id = $request->attkId;
			$sql="SELECT * FROM createairattkindexdata WHERE attkId = $id ORDER BY Ser";	
			$result = mysqli_query($connect, $sql);  
			if(mysqli_num_rows($result) > 0)  
			{  
				while($row = mysqli_fetch_assoc($result))  
				{  
			    	$output[] = $row;  
				}  
				echo json_encode($output);  
			} else {
				echo json_encode('401');
			} 
	break;

	case "9":

			$id = $request->baseId;
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
			WHERE createairattkindex.TgtId = elementinfo.ElementId 
			AND createairattkindex.BaseId = $id 
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
	break;

	case "10":
			// $reset_id = $request->resetId;
			$resetId = mysqli_real_escape_string($connect, $request->resetId);
			if ($resetId == 5232) 
			{
				$sql="DELETE FROM flightdata WHERE Ser > 0";
				$sql = mysqli_query($connect,$sql) or die(mysqli_error());
				echo json_encode("201");
			}
			else {
				echo json_encode("401");
			}
	break;

	case "11":
			$attkId = $request->attkId;
			$sql_01="DELETE FROM createairattkindexdata WHERE attkId = $attkId";
			$sql_01 = mysqli_query($connect,$sql_01) or die(mysqli_error());
			
			$sql_02="DELETE FROM createairattkindex WHERE attkId = $attkId";
			$sql_02 = mysqli_query($connect,$sql_02) or die(mysqli_error());
			echo json_encode(201);
	break;

	case "12":
	  		$ElementId = $request->ElementId;
			$exName = $request->ExName;
			$baseLat = $request->baseLat;
			$baseLng = $request->baseLng;
			$query = "UPDATE deployment SET DeploymentDate = '$currDate', ExName = '$exName',
			lat = $baseLat, lng = $baseLng WHERE ElementId = $ElementId";
			$resp_backend = array('ElementId' => $ElementId, 'Response' => "201");
			$resp = mysqli_query($connect,$query) ? $resp_backend : 401;
			echo json_encode($resp);
	break;

	case "13":
			$depl_Id = $request->deploymentId;
			$query = "SELECT *FROM sectorelmdeployment WHERE DeploymentId = $depl_Id ORDER BY Ser";  
			$result = mysqli_query($connect, $query);  
			if(mysqli_num_rows($result) > 0)  
				{  
				while($row = mysqli_fetch_assoc($result))  
				{  
					$output[] = $row;  
				}  
				echo json_encode($output);  
			} 
			else {
				$output =401;
				echo json_encode($output);		
			} 
	break;

	case "14":
		$query = "SELECT  *FROM flightdata ORDER BY acId";
		$result = mysqli_query($connect, $query);  
		if(mysqli_num_rows($result) > 0)  
		{  
			while($row = mysqli_fetch_assoc($result))  
			{  
				$output[] = $row;  
			}  
			echo json_encode($output);  
		}
		else 
		{
				echo json_encode("401");
		}  
	break;
	// ================== LAYOUT SERVICE ===================
	case "15":
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
		FROM deployment, elementinfo 
		WHERE deployment.ElementId = elementinfo.ElementId 
		AND deployment.isActive = 1 AND elementinfo.Type != 6 Order by deployment.Ser";  

			$result = mysqli_query($connect, $query);  
			if(mysqli_num_rows($result) > 0)  
			{  
				while($row = mysqli_fetch_assoc($result)) 
				{  
			  		 $output[] = $row;  
				}  
				echo json_encode($output);  
			}  
			else {
			$output = "401";
			echo json_encode($output);
			}
	break;

	case "16":
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
				else {
				$output = "401";
				echo json_encode($output);
				}

			}
			else {
				$output = "401";
				echo json_encode($output);
			}
	break;

	case "17":

			$radarName = mysqli_real_escape_string($connect, $request->radarName);
			$sql="SELECT MIN(Ser), BaseId FROM elementinfo WHERE ElementName = 'RS'";
			$sql = mysqli_query($connect,$sql) or die(mysqli_error());
			while($row = mysqli_fetch_array($sql))
			{
				$_Ser  = $row['0'];//($row['0'] == 0) ? 1 : $row['0'] + 1;	
				$_ElementId  = $row['1'];
			} 
			
			$query="UPDATE elementinfo SET ElementName = '$radarName' WHERE Ser = $_Ser";
			mysqli_query($connect,$query);

			$sql = "UPDATE deployment SET isActive = 1 WHERE ElementId = $_ElementId";
			mysqli_query($connect,$sql);	

			echo json_encode($radarName);

	break;
	case "18":
	
	$eid = mysqli_real_escape_string($connect, $request->ElmId);
	$rLat = mysqli_real_escape_string($connect, $request->rLat);
	$rLng = mysqli_real_escape_string($connect, $request->rLng);
	$ExName = mysqli_real_escape_string($connect, $request->ExName);
	
	
	$_OpRange = mysqli_real_escape_string($connect, $request->OpRange);
	$_info = mysqli_real_escape_string($connect, $request->info);


	$query="UPDATE deployment SET ExName = '$ExName', lat = $rLat, lng = $rLng WHERE ElementId = $eid";
	mysqli_query($connect,$query);

	$sql = "UPDATE elementinfo SET OpRange = $_OpRange, Info = '$_info' WHERE ElementId = $eid";
	mysqli_query($connect,$sql);
	echo json_encode($eid);
	
	break;
	case "19":
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
			FROM deployment, elementinfo 
			WHERE deployment.ElementId = elementinfo.ElementId 
			AND deployment.isActive = 1 AND elementinfo.Type = 6 Order by deployment.Ser";  

			$result = mysqli_query($connect, $query);  
			if(mysqli_num_rows($result) > 0)  
			{  
				while($row = mysqli_fetch_assoc($result)) 
				{  
			  		 $output[] = $row;  
				}  
				echo json_encode($output);  
			}  
			else {
			$output = "401";
			echo json_encode($output);
			}

	break;

	// ====================  RESET | MISC ========================
	case "25":
			$clientId = mysqli_real_escape_string($connect, $request->clientId);
			$query = "UPDATE isclientlivelist SET isLive = 0 WHERE clientId = $clientId ";  
			$resp = mysqli_query($connect, $query) ? 201 : 401;
			echo json_encode($resp);

	break;

	case "26":
			$query = "SELECT 
			isclientliveList.clientId as unitId,
			isclientliveList.isLive as status 
			FROM isclientlivelist,elementinfo,deployment 
			WHERE isclientliveList.clientId = elementinfo.ElementId 
			AND isclientliveList.clientId = deployment.ElementId 
			AND elementinfo.isIndependent = 1 AND deployment.isActive = 1 
			Order By isclientliveList.clientId";

			$result = mysqli_query($connect, $query);  
			if(mysqli_num_rows($result) > 0)  
			{  
				while($row = mysqli_fetch_assoc($result)) 
				{  
			  		 $output[] = $row;  
				}  
				echo json_encode($output);  
			}  
			else {
				$output = "401";
				echo json_encode($output);
			}
	break;
    default:
       echo "Choice Not Found...";
}
mysqli_close($connect);
?> 


