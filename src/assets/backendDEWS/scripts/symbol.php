import { Component, OnInit } from "@angular/core";
import { AddStyleService } from "../services/add-style.service";
import { AuthorizationService } from "../services/auth.service";
import { DeploymentService } from "../services/deployment.service";
import { RetrieveLiveDataService } from "../services/retrieve-live-data.service";
import { CalculationService } from "../services/calculation.service";
import { DepictedLocService } from "../services/depicted-loc.service";

@Component({
  selector: "app-air-attk",
  templateUrl: "./air-attk.component.html",
  styleUrls: ["./air-attk.component.css"]
})
export class AirAttkComponent implements OnInit {
  lat: number = 23.678418;
  lng: number = 90.809007;
  zoom: number = 7;
  delay: number = 2000;
  mapViewMode: any[];
  tempFlightData: any[];
  flightData: any[];
  deplElmData: any[];
  depictedAircraftLoc: any[];
  uid: number;
  pid: number;
  t: any;
  constructor(
    private serviceAddStyle: AddStyleService,
    private authorizationService: AuthorizationService,
    private deplService: DeploymentService,
    private liveFlightDataService: RetrieveLiveDataService,
    private serviceCalculation: CalculationService,
    private depictLocService: DepictedLocService
  ) {}

  confirmFlightChangeLoc(acId, lat, lng, isVisible) {
    console.log(acId);
    let projectedLatLng = this.depictLocService.depictAircraftLoc();
    let index = this.flightData.findIndex(p => p.acId == acId);
    if (index == -1) {
      let data = {
        acId,
        lat,
        lng,
        rotate: 0,
        color: "#f00",
        isVisible
      };
      if (isVisible == 1) {
        this.flightData.push(data);
      }
    } else {
      if (isVisible == 0) {
        this.flightData.splice(index, 1);
      } else {
        this.flightData[index].rotate = this.serviceCalculation.calculateAngle(
          this.flightData[index].lat,
          this.flightData[index].lng,
          lat,
          lng
        );
        this.flightData[index].lat = lat;
        this.flightData[index].lng = lng;
      }
    }
  }

  depictFlightPath() {
    this.liveFlightDataService.getLiveFlighData().subscribe(resp => {
      this.tempFlightData = [];
      this.tempFlightData = resp;
      for (let i = 0; i < this.tempFlightData.length; i++) {
        let acId = this.tempFlightData[i].acId;
        let lat = parseFloat(this.tempFlightData[i].lat);
        let lng = parseFloat(this.tempFlightData[i].lng);
        let isVisible = this.tempFlightData[i].isVisible;
        this.confirmFlightChangeLoc(acId, lat, lng, isVisible);
        // console.log("List : ", this.flightData);
      }
    });
  }

  start() {
    this.t = setTimeout(() => {
      this.depictFlightPath();
      this.start();
    }, this.delay);
  }

  printDeplElement() {
    this.pid = this.authorizationService.currentUser.pid;
    this.uid = this.authorizationService.currentUser.uid;
    let loggedUnit = this.uid;
    this.deplService.getDeplElementData().subscribe(resp => {
      let data = resp.json();
      console.log("List of Units : ", data);
      this.deplElmData = this.deplService.printLayout(data, loggedUnit, 2);
    });
  }

  resetFlightData(data) {
    // let data ={
    //   rid : resetId
    // }
    this.liveFlightDataService.reset(data).subscribe(result => {
      console.log("r : ", result);
    });
  }

  printSymbol(lat, lng) {
    let data = {
      acId: 105,
      lat: parseFloat(lat) + 0.031,
      lng: parseFloat(lng) + 0.105,
      rotate: 125,
      color: "#f00",
      isVisible: 1
    };
    this.depictedAircraftLoc.push(data);
  }

  ngOnInit() {
    this.flightData = [];
    this.depictedAircraftLoc = [];
    let data = {
      acId: 105,
      lat: 23.2137264,
      lng: 87.2127051,
      rotate: 0,
      color: "#f00",
      isVisible: 1
    };
    this.printSymbol(data.lat, data.lng);
    this.flightData.push(data);
    this.tempFlightData = [];
    this.printDeplElement();
    // this.start();
    this.mapViewMode = this.serviceAddStyle.mapMode();
  }
}


/////////////////////////////////////////

if (heading >= 0 && heading < 5) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.08,
      lng: parseFloat(lng) - 0.075,
      lx: 60,
      ly: -40
  };
}
else if (heading >= 5 && heading < 10) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.085,
      lng: parseFloat(lng) - 0.065,
      lx: 60,
      ly: -40
  };
}
else if (heading >= 10 && heading < 15) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.088,
      lng: parseFloat(lng) - 0.045,
      lx: 50,
      ly: -40
  };
}
else if (heading >= 15 && heading < 20) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.085,
      lng: parseFloat(lng) - 0.045,
      lx: 40,
      ly: -40
  };
}
else if (heading >= 20 && heading < 25) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.089,
      lng: parseFloat(lng) - 0.048,
      lx: 30,
      ly: -40
  };
}
else if (heading >= 25 && heading < 30) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.095,
      lng: parseFloat(lng) - 0.035,
      lx: 30,
      ly: -40
  };
}
else if (heading >= 30 && heading < 35) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.101,
      lng: parseFloat(lng) - 0.027,
      lx: 20,
      ly: -40
  };
}
else if (heading >= 35 && heading < 40) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.101,
      lng: parseFloat(lng) - 0.018,
      lx: 10,
      ly: -40
  };
}
else if (heading >= 40 && heading < 45) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.1,
      lng: parseFloat(lng) - 0.01,
      lx: 0,
      ly: -40
  };
}
else if (heading >= 45 && heading < 50) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.1,
      lng: parseFloat(lng) + 0.02,
      lx: -20,
      ly: -40
  };
}
else if (heading >= 50 && heading < 55) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.1,
      lng: parseFloat(lng) + 0.02,
      lx: -20,
      ly: -20
  };
}
else if (heading >= 55 && heading < 60) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.09,
      lng: parseFloat(lng) + 0.025,
      lx: -30,
      ly: -10
  };
}
else if (heading >= 60 && heading < 65) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.09,
      lng: parseFloat(lng) + 0.04,
      lx: -40,
      ly: 0
  };
}
else if (heading >= 65 && heading < 70) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.09,
      lng: parseFloat(lng) + 0.033,
      lx: -50,
      ly: 10
  };
}
else if (heading >= 70 && heading < 75) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.08,
      lng: parseFloat(lng) + 0.045,
      lx: -50,
      ly: 20
  };
}
else if (heading >= 75 && heading < 80) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.082,
      lng: parseFloat(lng) + 0.055,
      lx: -50,
      ly: 30
  };
}
else if (heading >= 80 && heading < 85) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.08,
      lng: parseFloat(lng) + 0.064,
      lx: -50,
      ly: 40
  };
}
else if (heading >= 85 && heading < 90) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.078,
      lng: parseFloat(lng) + 0.071,
      lx: -50,
      ly: 50
  };
}

else if (heading >= 90 && heading < 95) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.065,
      lng: parseFloat(lng) + 0.08,
      lx: -55,
      ly: 60
  };
}
else if (heading >= 95 && heading < 100) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.067,
      lng: parseFloat(lng) + 0.082,
      lx: -55,
      ly: 70
  };
}
else if (heading >= 100 && heading < 105) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.055,
      lng: parseFloat(lng) + 0.091,
      lx: -55,
      ly: 80
  };
}
else if (heading >= 105 && heading < 110) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.045,
      lng: parseFloat(lng) + 0.098,
      lx: -55,
      ly: 90
  };
}
else if (heading >= 110 && heading < 115) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.041,
      lng: parseFloat(lng) + 0.102,
      lx: -55,
      ly: 100
  };
}
else if (heading >= 115 && heading < 120) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.035,
      lng: parseFloat(lng) + 0.102,
      lx: -55,
      ly: 110
  };
}
else if (heading >= 120 && heading < 125) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.025,
      lng: parseFloat(lng) + 0.108,
      lx: -55,
      ly: 120
  };
}



else if (heading >= 125 && heading < 130) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.006,
      lng: parseFloat(lng) + 0.104,
      lx: -55,
      ly: 130
  };
}
else if (heading >= 130 && heading < 135) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.006,
      lng: parseFloat(lng) + 0.103,
      lx: -35,
      ly: 160
  };
}
else if (heading >= 135 && heading < 140) 
{
  this.data = 
  {
    lat: parseFloat(lat) + 0.007,
      lng: parseFloat(lng) + 0.103,
      lx: -30,
      ly: 180
  };
}
else if (heading >= 140 && heading < 145) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.003,
      lng: parseFloat(lng) + 0.105,
      lx: -30,
      ly: 170
  };
}
else if (heading >= 145 && heading < 150) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.015,
      lng: parseFloat(lng) + 0.103,
      lx: -20,
      ly: 180
  };
}

else if (heading >= 150 && heading < 155) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.019,
      lng: parseFloat(lng) + 0.102,
      lx: -10,
      ly: 200
  };
}

else if (heading >= 155 && heading < 160) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.026,
      lng: parseFloat(lng) + 0.098,
      lx: -1,
      ly: 210
  };
}

else if (heading >= 160 && heading < 165) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.035,
      lng: parseFloat(lng) + 0.097,
      lx: 30,
      ly: 210
  };
}
else if (heading >= 165 && heading < 170) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.043,
      lng: parseFloat(lng) + 0.097,
      lx: 30,
      ly: 200
  };
}
else if (heading >= 170 && heading < 175) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.053,
      lng: parseFloat(lng) + 0.09,
      lx: 40,
      ly: 200
  };
}
else if (heading >= 175 && heading < 180) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.058,
      lng: parseFloat(lng) + 0.071,
      lx: 50,
      ly: 200
  };
}
else if (heading >= 180 && heading < 185) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.065,
      lng: parseFloat(lng) + 0.07,
      lx: 60,
      ly: 210
  };
}
else if (heading >= 185 && heading < 190) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.075,
      lng: parseFloat(lng) + 0.07,
      lx: 70,
      ly: 210
  };
}
else if (heading >= 190 && heading < 195) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.075,
      lng: parseFloat(lng) + 0.065,
      lx: 80,
      ly: 210
  };
}
else if (heading >= 195 && heading < 200) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.085,
      lng: parseFloat(lng) + 0.063,
      lx: 90,
      ly: 210
  };
}
else if (heading >= 200 && heading < 205) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.091,
      lng: parseFloat(lng) + 0.051,
      lx: 100,
      ly: 210
  };
}
else if (heading >= 205 && heading < 210) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.101,
      lng: parseFloat(lng) + 0.041,
      lx: 100,
      ly: 210
  };
}
else if (heading >= 210 && heading < 215) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.101,
      lng: parseFloat(lng) + 0.031,
      lx: 110,
      ly: 210
  };
}
else if (heading >= 215 && heading < 220) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.103,
      lng: parseFloat(lng) + 0.023,
      lx: 130,
      ly: 200
  };
}
else if (heading >= 220 && heading < 225) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.103,
      lng: parseFloat(lng) + 0.02,
      lx: 130,
      ly: 200
  };
}
else if (heading >= 225 && heading < 230) 
{
  this.data = 
  {
    lat: parseFloat(lat) - 0.102,
      lng: parseFloat(lng) + 0.01,
      lx: 140,
      ly: 190
  };
}
else if (heading >= 230 && heading < 235) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.1,
      lng: parseFloat(lng) - 0.01,
      lx: 150,
      ly: 170
  };
}
else if (heading >= 235 && heading < 240) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.1,
      lng: parseFloat(lng) - 0.02,
      lx: 150,
      ly: 170
  };
}
else if (heading >= 240 && heading < 245) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.1,
      lng: parseFloat(lng) - 0.03,
      lx: 160,
      ly: 160
  };
}
else if (heading >= 245 && heading < 250) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.1,
      lng: parseFloat(lng) - 0.04,
      lx: 170,
      ly: 160
  };
}
else if (heading >= 250 && heading < 255) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.09,
      lng: parseFloat(lng) - 0.04,
      lx: 170,
      ly: 140
  };
}
else if (heading >= 255 && heading < 260) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.09,
      lng: parseFloat(lng) - 0.06,
      lx: 170,
      ly: 130
  };
}
else if (heading >= 260 && heading < 265) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.082,
      lng: parseFloat(lng) - 0.065,
      lx: 190,
      ly: 110
  };
}
else if (heading >= 265 && heading < 270) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.082,
      lng: parseFloat(lng) - 0.07,
      lx: 180,
      ly: 100
  };
}
else if (heading >= 270 && heading < 275) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.07,
      lng: parseFloat(lng) - 0.07,
      lx: 180,
      ly: 100
  };
}
else if (heading >= 275 && heading < 280) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.063,
      lng: parseFloat(lng) - 0.08,
      lx: 180,
      ly: 90
  };
}
else if (heading >= 280 && heading < 285) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.06,
      lng: parseFloat(lng) - 0.085,
      lx: 170,
      ly: 80
  };
}
else if (heading >= 285 && heading < 290) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.045,
      lng: parseFloat(lng) - 0.09,
      lx: 180,
      ly: 80
  };
}
else if (heading >= 290 && heading < 295) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.04,
      lng: parseFloat(lng) - 0.09,
      lx: 180,
      ly: 70
  };
}
else if (heading >= 295 && heading < 300) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.031,
      lng: parseFloat(lng) - 0.101,
      lx: 180,
      ly: 40
  };
}
else if (heading >= 300 && heading < 305) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.025,
      lng: parseFloat(lng) - 0.101,
      lx: 180,
      ly: 40
  };
}
else if (heading >= 305 && heading < 310) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.015,
      lng: parseFloat(lng) - 0.101,
      lx: 180,
      ly: 30
  };
}
else if (heading >= 310 && heading < 315) 
{
  this.data = 
  {
     lat: parseFloat(lat) - 0.011,
      lng: parseFloat(lng) - 0.101,
      lx: 160,
      ly: 20
  };
}
else if (heading >= 315 && heading < 320) 
{
  this.data = 
  {
     lat: parseFloat(lat),
      lng: parseFloat(lng) - 0.101,
      lx: 160,
      ly: 20
  };
}
else if (heading >= 320 && heading < 325) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.008,
      lng: parseFloat(lng) - 0.101,
      lx: 150,
      ly: 10
  };
}
else if (heading >= 325 && heading < 330) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.018,
      lng: parseFloat(lng) - 0.104,
      lx: 150,
      ly: 10
  };
}
else if (heading >= 330 && heading < 335) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.021,
      lng: parseFloat(lng) - 0.104,
      lx: 140,
      ly: -10
  };
}
else if (heading >= 335 && heading < 340) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.03,
      lng: parseFloat(lng) - 0.1,
      lx: 140,
      ly: -20
  };
}
else if (heading >= 340 && heading < 345) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.04,
      lng: parseFloat(lng) - 0.09,
      lx: 130,
      ly: -40
  };
}
else if (heading >= 345 && heading < 350) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.055,
      lng: parseFloat(lng) - 0.09,
      lx: 110,
      ly: -50
  };
}
else if (heading >= 350 && heading < 355) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.065,
      lng: parseFloat(lng) - 0.085,
      lx: 110,
      ly: -50
  };
}
else if (heading >= 355 && heading < 360) 
{
  this.data = 
  {
     lat: parseFloat(lat) + 0.068,
      lng: parseFloat(lng) - 0.082,
      lx: 80,
      ly: -50
  };
}