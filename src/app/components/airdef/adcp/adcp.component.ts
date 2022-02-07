import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import { ThemePalette } from '@angular/material/core';
import { FlightdataService } from './../../../services/flightdata.service';
import { AuthService } from './../../../services/auth.service';
import { TtsService } from './../../../services/tts.service';
import { element } from 'protractor';
import { PlotService } from './../../../services/plot.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './../../modal/modal.component';
@Component({
  selector: 'app-adcp',
  templateUrl: './adcp.component.html',
  styleUrls: ['./adcp.component.css'],
})
export class AdcpComponent implements OnInit {
  NavId: string = 'adcp';
  CenKPI: string = '';
  loggedUnitId: number = 0;
  loggedUnitName: string = '';
  t: any;
  delay: number = 4000;
  prevDist: number = 0;
  readiness: string = 'Guns High';
  gco: string = 'Tight';
  manningState: string = 'A';
  coTime: string = '00:00:00';
  x1: number = 0;
  x2: number = 0;
  x3: number = 0;
  x4: number = 0;
  x5: number = 1;
  isTtsOn: boolean = false;
  currentAcId: number = 0;
  acAOR: any[] = [];
  spkrIconHeader: string = 'volume_off';
  arrCourseSaved: any[] = [];
  arrParamCourseSaved: any[] = [];
  courseSer: number = 0;
  arrFetchedFltData: any[] = [];
  flightData: any[] = [];
  arrOP: any[] = [];
  arrOPWarn: any[] = [];
  arrDiff: any[] = [];
  arrOP2Warn: any[] = [];
  color: ThemePalette = 'primary';
  //
  constructor(
    private authService: AuthService,
    private fltDataSvc: FlightdataService,
    public ttsService: TtsService,
    public plotService: PlotService,
    public dialog: MatDialog
  ) {}
  //
  start() {
    this.t = setTimeout(() => {
      let data = {
        queryId: '14',
      };
      this.arrFetchedFltData = [];
      this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
        if (resp.Response != '401') {
          this.arrFetchedFltData = resp;
          this.setFlightData(this.arrFetchedFltData);
        } else {
          console.log('No Flight Data ...');
        }
      });
      this.start();
    }, this.delay);
  }
  //
  setFlightData(fltData: any) {
    this.plotService.remove_marker();
    this.plotService.arrAcMarker = [];
    this.flightData = [];
    if (fltData) {
      for (let i = 0; i < fltData.length; i++) {
        let f_data = {
          Ser: fltData[i].Ser,
          acId: fltData[i].acId,
          lat: parseFloat(fltData[i].lat),
          lng: parseFloat(fltData[i].lng),
          dist: Math.floor(
            this.fltDataSvc.calculateDistance(
              this.plotService.baseX,
              this.plotService.baseY,
              parseFloat(fltData[i].lat),
              parseFloat(fltData[i].lng)
            ) / 1000
          ),
          brg: Math.floor(
            this.fltDataSvc.calculateAngle(
              this.plotService.baseX,
              this.plotService.baseY,
              parseFloat(fltData[i].lat),
              parseFloat(fltData[i].lng)
            )
          ),
          heading: parseFloat(fltData[i].heading),
          height: parseFloat(fltData[i].height) * 1000,
          speed: fltData[i].speed,
          tac: fltData[i].numberAc,
          origin: parseInt(fltData[i].origin),
          isSelected:
            parseInt(fltData[i].acId) == this.currentAcId && fltData[i].acId > 0
              ? true
              : false,
          isVisible: fltData[i].isVisible,
          op2warn: '',
          senderId: parseInt(fltData[i].senderId),
        };
        this.flightData.push(f_data);
        this.save_course(f_data);
        if (this.prevDist != f_data.dist) {
          let ttsText = f_data.dist + ' Kilo At ' + f_data.brg + ' Degree';
          this.prevDist = f_data.dist;
          f_data.acId == this.currentAcId
            ? this.ttsService.speech(ttsText)
            : null;
        }
        //
        this.generateConOrder(f_data);
        this.plotService.simulateFlightProfile(f_data);
      }
    } else {
      console.log('No Flight Data..@ Opr ');
    }
  }
  //
  save_course(data: any) {
    let index = this.arrCourseSaved.findIndex((p) => p.acId == data.acId);
    if (index == -1) {
      let c1 = {
        courseSer: this.arrCourseSaved.length + 1,
        acId: data.acId,
        heading: data.heading,
        speed: data.speed,
        height: data.height,
        lat: data.lat,
        lng: data.lng,
      };
      this.arrCourseSaved.push(c1);
      let d = {
        acId: data.acId,
        heading: data.heading,
      };
      this.arrParamCourseSaved.push(d);
      console.log('Course Saves @1 :', this.arrCourseSaved);
    } else {
      let i = this.arrParamCourseSaved.findIndex((p) => p.acId == data.acId);
      if (this.arrParamCourseSaved[i].heading !== data.heading) {
        let c2 = {
          courseSer: this.arrCourseSaved.length + 1,
          acId: data.acId,
          heading: data.heading,
          speed: data.speed,
          height: data.height,
          lat: data.lat,
          lng: data.lng,
        };
        this.arrCourseSaved.push(c2);
        this.arrParamCourseSaved[i].heading = data.heading;
        console.log('Course Saves @2 :', this.arrCourseSaved);
      }
    }
  }
  //
  select_op_to_warn(
    intruderId: number,
    brg: number,
    acLat: number,
    acLng: number,
    dist_ac2base: number
  ) {
    this.arrOP2Warn = [];
    this.arrDiff = [];
    for (let i = 0; i < this.plotService.arrOP.length; i++) {
      let dist_ac2op = Math.floor(
        this.fltDataSvc.calculateDistance(
          acLat,
          acLng,
          parseFloat(this.plotService.arrOP[i].lat),
          parseFloat(this.plotService.arrOP[i].lng)
        ) / 1000
      );
      if (dist_ac2op < dist_ac2base && dist_ac2base > 6) {
        let data = {
          secId: this.plotService.arrOP[i].secId,
          dist_ac2op,
        };
        this.arrOP2Warn.push(data);
      } else {
        let data = {
          secId: '',
          dist_ac2op,
        };
        this.arrOP2Warn.push(data);
      }
    }
    this.arrOP2Warn.sort((a, b) => (a.dist_ac2op > b.dist_ac2op ? 1 : -1));
    let index = this.flightData.findIndex((p) => p.acId == intruderId);
    this.flightData[index].op2warn = this.arrOP2Warn[0].secId;
  }

  //
  generateConOrder(data: any) {
    if (data.dist <= 30) {
      data.dist <= 20
        ? this.select_op_to_warn(
            data.acId,
            data.brg,
            data.lat,
            data.lng,
            data.dist
          )
        : null;
      let i = this.acAOR.findIndex((p) => p.acId == data.acId);
      if (i == -1) {
        let info = {
          acId: data.acId,
          orig: data.origin,
        };
        this.acAOR.push(info);
      }
      let j = this.acAOR.findIndex((p) => p.orig == 1);
      if (j == -1) {
        if (this.x1 == 0) {
          this.readiness = 'High';
          this.gco = 'Guns Free';
          this.manningState = 'A';
          let d = new Date();
          this.coTime = d.toLocaleTimeString();
          this.x1 = 1;
          this.x2 = 0;
          this.x3 = 0;
          this.x4 = 0;
          this.x5 = 0;
        }
      } else {
        if (this.x2 == 0) {
          this.readiness = 'High';
          this.gco = 'Hold Fire';
          this.manningState = 'A';
          let d = new Date();
          this.coTime = d.toLocaleTimeString();
          this.x1 = 0;
          this.x2 = 1;
          this.x3 = 0;
          this.x4 = 0;
          this.x5 = 0;
        }
      }
    } else {
      if (this.acAOR.length == 0) {
        if (this.x3 == 0) {
          this.readiness = 'High';
          this.gco = 'Guns Tight';
          this.manningState = 'A';
          let d = new Date();
          this.coTime = d.toLocaleTimeString();
          this.x1 = 0;
          this.x2 = 0;
          this.x3 = 1;
          this.x4 = 0;
          this.x5 = 0;
        }
      } else {
        let k = this.acAOR.findIndex((p) => p.acId == data.acId);
        if (k != -1) {
          if (data.origin == 1) {
            if (this.x4 == 0) {
              this.readiness = 'High';
              this.gco = 'Cancel Hold Fire';
              this.manningState = 'A';
              let d = new Date();
              this.coTime = d.toLocaleTimeString();
              this.acAOR.splice(k, 1);
              this.x1 = 0;
              this.x2 = 0;
              this.x3 = 0;
              this.x4 = 1;
              this.x5 = 0;
            }
          } else {
            if (this.x5 == 0) {
              this.readiness = 'High';
              this.gco = 'Guns Tight';
              this.manningState = 'A';
              let d = new Date();
              this.coTime = d.toLocaleTimeString();
              this.acAOR.splice(k, 1);
              this.x1 = 0;
              this.x2 = 0;
              this.x3 = 0;
              this.x4 = 0;
              this.x5 = 1;
              // this.set_path_data(acId, this.logged_unitId);
            }
          }
        }
      }
    }
  }
  //
  mute_ttsSvc(): void {
    this.isTtsOn = false;
    this.spkrIconHeader = 'volume_up';
    this.currentAcId = 0;
    this.ttsService.pause();
    for (let i = 0; i < this.flightData.length; i++) {
      this.flightData[i].isSelected = false;
    }
  }
  //
  ttsSvc(acId: number) {
    this.ttsService.cancel();
    let index = this.flightData.findIndex((p) => p.acId == acId);
    this.spkrIconHeader = 'volume_off';
    this.currentAcId = acId;
    this.flightData[index].isSelected =
      this.flightData[index].isSelected == false ? true : false;
    this.isTtsOn = true;
    for (let i = 0; i < this.flightData.length; i++) {
      if (this.flightData[i].acId != acId) {
        this.flightData[i].isSelected = false;
      }
    }
  }
  //
  openModal() {
    let viewId = 1;
    let param1 = this.loggedUnitId;
    let param2 = this.loggedUnitName;

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '450px',
      height: '500px',
      data: viewId + '-' + param1 + '-' + param2,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Return from Modal : ', result);
      }
    });
  }
  //
  ngOnInit(): void {
    this.loggedUnitId = this.authService.LoggedUserData(5);
    if (this.loggedUnitId) {
      this.plotService.initMap(0);
    }
    this.loggedUnitName = this.authService.LoggedUserData(6);
    this.plotService.setElmLoc(this.loggedUnitId);
    this.start();
  }
}
