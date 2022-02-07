<?php
header('Content-type: application/json');
	header("Access-Control-Allow-Origin: *");
	header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
	
include('../connect/connect.php');

$output = array();  
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$BaseId = $request->ElementId;
$sid1 = $request->subunitId1;
$sid2 = $request->subunitId2;
$sid3 = $request->subunitId3;

$scs1 = $request->scs1;
$scs2 = $request->scs2;
$scs3 = $request->scs3;

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
$connect->close();
?>