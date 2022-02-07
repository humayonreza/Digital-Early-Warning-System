import { Component, OnInit } from '@angular/core';
import { FlightdataService } from './../../../../../services/flightdata.service';
import { BackendService } from './../../../../../services/backend.service';

@Component({
  selector: 'app-wl1',
  templateUrl: './wl1.component.html',
  styleUrls: ['./wl1.component.css'],
})
export class Wl1Component implements OnInit {
  constructor(private fltDataSvc: FlightdataService) {}
  i: number = 1;
  k: number = 0;
  isVisible: number = 1;
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;
  speed: number = 0;
  height: number = 0;
  headAngle: number = 0;
  flightId: number = 0;
  delay: number = 1100;
  deltaLat: number = 0;
  deltaLng: number = 0;
  isReset: number = 1;
  distX: number = 0;
  t: any;
  mach: number = 330;
  counter: number = 0;
  calSpeed: any[] = [];
  attkList: any[] = [];
  arrPathProfile: any[] = [];
  baseId: number = 0;
  getProfileListByBase(baseId: number) {
    let param = {
      baseId,
      queryId: 9,
    };
    this.fltDataSvc.SubmitQuery(param).subscribe((resp: any) => {
      console.log('Attk Profile by BaseId :', resp);
      this.attkList = resp;
    });
  }
  //
  //
  launchAttk(attkId: number, BaseId: number) {
    let param = {
      attkId,
      queryId: 8,
    };
    this.fltDataSvc.SubmitQuery(param).subscribe((resp: any) => {
      console.log('Attk Profile Details by BaseId :', resp);
      this.arrPathProfile = resp;
      this.init2Restart(BaseId);
      this.x2 = this.arrPathProfile[this.i].lat;
      this.y2 = this.arrPathProfile[this.i].lng;
      this.speed = this.arrPathProfile[this.i].Speed;
      this.height = this.arrPathProfile[this.i].Ht;
      this.headAngle = this.fltDataSvc.calculateAngle(
        this.x1,
        this.y1,
        this.x2,
        this.y2
      );
      console.log('Head Angle : ', this.headAngle);
    });
    this.start();
  }
  //
  start() {
    this.t = setTimeout(() => {
      this.genFlightData();
      this.start();
    }, this.delay);
  }
  //
  genFlightData() {
    let d = Math.floor(
      this.fltDataSvc.calculateDistance(this.x1, this.y1, this.x2, this.y2)
    );

    let x = {
      dist: d,
    };
    this.calSpeed.push(x);
    // console.log("Distance Remaining : ", x);
    if (this.k > 0) {
      this.distX = this.calSpeed[this.k - 1].dist - this.calSpeed[this.k].dist;
      // console.log("Distance Crossed : ", this.distX + " Spd : ", this.speed);
    }
    this.k = this.k + 1;
    let shift = this.mach * this.speed;
    let thrust = shift * (this.delay / 1000);
    let numDeltas = Math.round(d / thrust);
    this.deltaLat = (this.x1 - this.x2) / numDeltas;
    this.deltaLng = (this.y1 - this.y2) / numDeltas;
    this.x1 -= this.deltaLat;
    this.y1 -= this.deltaLng;
    // Ser	date	acId	speed	height	origin	heading lat	lng
    let data = {
      acId: this.flightId,
      speed: this.speed,
      height: this.height,
      origin: 2,
      heading: this.headAngle,
      lat: this.x1,
      lng: this.y1,
      isVisible: this.isVisible,
      senderId: this.baseId,
      queryId: 6,
    };
    // console.log("Distance: shift ", d + " - " + shift);
    if (d < this.distX + 10) {
      this.i = this.i + 1;
      if (this.arrPathProfile.length <= this.i) {
        this.terminationFlightProfile();
      } else {
        this.x2 = this.arrPathProfile[this.i].lat;
        this.y2 = this.arrPathProfile[this.i].lng;
        this.speed = this.arrPathProfile[this.i].Speed;
        this.height = this.arrPathProfile[this.i].Ht;
        this.headAngle = this.fltDataSvc.calculateAngle(
          this.x1,
          this.y1,
          this.x2,
          this.y2
        );
      }
    } else {
      this.fltDataSvc.processFlightData(data);
    }
  }
  //
  terminationFlightProfile() {
    let data = {
      acId: this.flightId,
      speed: 0,
      height: 0,
      origin: 0,
      heading: 0,
      lat: 0,
      lng: 0,
      isVisible: 0,
      queryId: 6,
    };
    this.fltDataSvc.processFlightData(data);
  }

  init2Restart(BaseId: number) {
    let infoFetched = localStorage.getItem('arrDeplElm');
    if (infoFetched != null) {
      let arrElm = JSON.parse(infoFetched);
      let index = arrElm.findIndex((p: any) => p.BaseId == BaseId);
      if (index == -1) {
        console.log('No Data');
      } else {
        this.i = 1;
        this.isVisible = 1;
        this.x1 = arrElm[index].lat;
        this.y1 = arrElm[index].lng;
        let param = {
          queryId: 7,
        };
        this.fltDataSvc.SubmitQuery(param).subscribe((resp: any) => {
          this.flightId = resp[0].flightId;
          console.log(this.flightId);
        });
      }
      // console.log(arrElm);
    }
  }
  //
  stopTimer() {
    clearTimeout(this.t);
    this.terminationFlightProfile();
  }
  //
  isVisibleAircraft(val: number) {
    // console.log(val);
    this.isVisible = val;
  }
  //
  remove(attkId: number, baseId: number) {
    console.log(attkId);
    let data = {
      attkId,
      queryId: 11,
    };
    this.fltDataSvc.SubmitQuery(data).subscribe((result) => {
      console.log(result);
      if (result) {
        this.getProfileListByBase(baseId);
      }
    });
  }
  ngOnInit(): void {
    this.baseId = 811;
    this.getProfileListByBase(this.baseId);
  }
}
