<!DOCTYPE html>
<html>
<head>
 
<script type="text/javascript">
	function getLocation() 
	{
		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(showPosition);
		} 
		else{ 
			console.log("Not Supported");
		}
	}

	function showPosition(position) {
		let currentLat = position.coords.latitude;
		let currentLong = position.coords.longitude;
		console.log(currentLat + " - " + currentLong);
		if (window.XMLHttpRequest)
        { xmlhttp = new XMLHttpRequest(); }
        else { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) 
          { 
            // document.getElementById('backend-resp').innerHTML = uid + " Deployed at  Lat : " + lat 
            // + " and Lng : " + lng;
            // var db_return = this.responseText;
            // deplSerial = parseInt(db_return);
            // helpMe(3);
            console.log("Success")
          } 
        };
        xmlhttp.open("GET","insertGeoData.php?currentLat="+currentLat+'&currentLong='+currentLong,true);
        //xmlhttp.open("GET","../model/insert_deploymentinfo.php",true);
        xmlhttp.send();
	}



    //document.getElementById('backend-resp').innerHTML = UnitName;
    
</script>
</head>

<body onload="getLocation()">
	
</body>
</html>

