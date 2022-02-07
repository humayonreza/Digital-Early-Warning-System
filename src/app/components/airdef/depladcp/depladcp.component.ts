import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import { MapthemeService } from 'src/app/services/maptheme.service';
import { BackendService } from 'src/app/services/backend.service';
import { PlotService } from './../../../services/plot.service';
import { FlightdataService } from './../../../services/flightdata.service';
export interface comdStatus {
  ser: number;
  category: number;
  subunitName: string;
  indepStateId: string;
  integralStateId: string;
}

export interface secId {
  value: string;
  viewValue: string;
  cl: number;
}
export interface mslsecId {
  value: string;
  viewValue: string;
  cl: number;
}
// mslsecId
@Component({
  selector: 'app-depladcp',
  templateUrl: './depladcp.component.html',
  styleUrls: ['./depladcp.component.css'],
})
export class DepladcpComponent implements OnInit {
  isLinear: boolean = false;
  latCen: number = 23.5;
  lngCen: number = 91;
  zoom: number = 6.7;
  uLat: number = 0;
  uLng: number = 0;
  opLat: string = '';
  opLng: string = '';
  opRtArc: string = '';
  opLtArc: string = '';
  mapViewMode: any[] = [];
  deployedElement: any[] = [];
  opList: any[] = [];
  arrCS: any[] = [];
  baseId: number = 0;
  exName: string = '';
  deploymentId: number = 200;
  subunitId1: number = 0;
  subunitId2: number = 0;
  subunitId3: number = 0;
  scs1: number = 0;
  scs2: number = 0;
  scs3: number = 0;
  secArr: any[] = [];
  secId: string = '';
  deplOpt: number = 1;
  isOPVisible: boolean = false;
  opIsChecked: boolean = false;
  backendResp_unitDepl: string = 'Waiting for backend response....';
  backendResp_cmdstatus: string = 'Waiting for backend response....';
  backendResp_opDepl: string = 'Waiting for backend response....';
  NavId: string = 'adcp';
  constructor(
    public authService: AuthService,
    // private themeService: MapthemeService,
    private backendService: BackendService,
    public plotService: PlotService,
    private fltDataSvc: FlightdataService
  ) {}

  arrCSReg: comdStatus[] = [
    {
      ser: 1,
      category: 0,
      subunitName: 'P-Bty',
      indepStateId: '01',
      integralStateId: '11',
    },
    {
      ser: 2,
      category: 0,
      subunitName: 'Q-Bty',
      indepStateId: '02',
      integralStateId: '12',
    },
    {
      ser: 3,
      category: 0,
      subunitName: 'R-Bty',
      indepStateId: '03',
      integralStateId: '13',
    },
  ];

  arrCSMsl: comdStatus[] = [
    {
      ser: 1,
      category: 0,
      subunitName: 'A-Tp',
      indepStateId: '01',
      integralStateId: '11',
    },
    {
      ser: 2,
      category: 0,
      subunitName: 'B-Tp',
      indepStateId: '02',
      integralStateId: '12',
    },
    {
      ser: 3,
      category: 0,
      subunitName: 'C-Tp',
      indepStateId: '03',
      integralStateId: '13',
    },
  ];

  opSecArr: secId[] = [
    { value: 'Z', viewValue: 'Z', cl: 0 },
    { value: 'Y', viewValue: 'Y', cl: 0 },
    { value: 'X', viewValue: 'X', cl: 0 },
    { value: 'W', viewValue: 'W', cl: 0 },
    { value: 'V', viewValue: 'V', cl: 0 },
    { value: 'U', viewValue: 'U', cl: 0 },
    { value: 'T', viewValue: 'T', cl: 0 },
    { value: 'S', viewValue: 'S', cl: 0 },
    { value: 'R', viewValue: 'R', cl: 0 },
    { value: 'Q', viewValue: 'Q', cl: 0 },
    { value: 'P', viewValue: 'P', cl: 0 },
  ];

  mslSecArr: mslsecId[] = [
    { value: 'A1', viewValue: 'A1', cl: 0 },
    { value: 'A2', viewValue: 'A2', cl: 0 },
    { value: 'A3', viewValue: 'A3', cl: 0 },
    { value: 'B1', viewValue: 'B1', cl: 0 },
    { value: 'B2', viewValue: 'B2', cl: 0 },
    { value: 'B3', viewValue: 'B3', cl: 0 },
    { value: 'C1', viewValue: 'C1', cl: 0 },
    { value: 'C2', viewValue: 'C2', cl: 0 },
    { value: 'C3', viewValue: 'C3', cl: 0 },
  ];

  setSubunitCommandStatus(scs: string) {
    if (scs == '01') {
      this.scs1 = 0;
    } else if (scs == '11') {
      this.scs1 = 1;
    } else if (scs == '02') {
      this.scs2 = 0;
    } else if (scs == '12') {
      this.scs2 = 1;
    } else if (scs == '03') {
      this.scs3 = 0;
    } else if (scs == '13') {
      this.scs3 = 1;
    }
  }

  printUnit(lat: number, lng: number) {
    this.deployedElement = [];
    this.deployedElement.push(
      {
        lat: lat,
        lng: lng,
        color: 'rgb(66, 134, 244)',
        rad: 2000,
      },
      {
        lat: lat,
        lng: lng,
        color: '#f00',
        rad: 4500,
      },
      {
        lat: lat,
        lng: lng,
        color: 'rgb(66, 134, 244)',
        rad: 25000,
      }
    );
  }
  //
  setOpSecLtr(e: any) {
    // console.log(e);
    this.secId = e;
  }
  //
  set_op_msl_elm(sector: string) {
    if (this.baseId == 125) {
      let index = this.mslSecArr.findIndex((p) => p.viewValue == sector);
      this.mslSecArr[index].cl = 1;
      this.secId = sector;
    } else {
      let index = this.opSecArr.findIndex((p) => p.viewValue == sector);
      this.opSecArr[index].cl = 1;
      this.secId = sector;
    }
    this.plotService.isDeplOP = true;
    this.plotService.opSec = sector;
    this.deplType(2);
  }
  //
  getLocation($event: any) {
    if (this.deplOpt == 1) {
      this.uLat = $event.coords.lat;
      this.uLng = $event.coords.lng;
      this.printUnit(this.uLat, this.uLng);
    } else {
      this.opLat = $event.coords.lat;
      this.opLng = $event.coords.lng;
      this.printOP(parseFloat(this.opLat), parseFloat(this.opLng));
    }
  }
  //
  printOP(opLat: number, opLng: number) {
    let index = this.opList.findIndex((p) => p.sName == this.secId);
    if (index == -1) {
      let data = {
        lat: opLat,
        lng: opLng,
        sName: this.secId,
      };
      this.opList.push(data);
    } else {
      this.opList[index].lat = opLat;
      this.opList[index].lng = opLng;
    }
  }

  setNextOp(sec: string) {
    if (sec == 'Z') {
      this.secId = 'Y';
    } else if (sec == 'Y') {
      this.secId = 'X';
    } else if (sec == 'X') {
      this.secId = 'W';
    } else if (sec == 'W') {
      this.secId = 'V';
    } else if (sec == 'V') {
      this.secId = 'U';
    } else if (sec == 'U') {
      this.secId = 'T';
    } else if (sec == 'T') {
      this.secId = 'S';
    } else if (sec == 'S') {
      this.secId = 'R';
    } else if (sec == 'R') {
      this.secId = 'Q';
    } else if (sec == 'Q') {
      this.secId = 'P';
    }
  }
  //
  assignSubunitId(baseid: number) {
    let bid = baseid;
    this.baseId = bid;
    this.subunitId1 = bid + 1;
    this.subunitId2 = bid + 2;
    this.subunitId3 = bid + 3;
  }
  //
  unitX: number = 0;
  unitY: number = 0;
  submitDeploymentData(inputValue: any) {
    this.unitX = inputValue.uLat;
    this.unitY = inputValue.uLng;
    let data = {
      ElementId: this.baseId,
      ExName: inputValue.exName,
      lat: inputValue.uLat,
      lng: inputValue.uLng,
      queryId: '1',
    };
    console.log('Deploy Data', data);
    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      if (result) {
        this.deploymentId = result.DeploymentId;
        this.backendResp_unitDepl = 'Deployment Successful. Set Comd Status';
        console.log('Deploy Id', this.deploymentId);
      } else {
        console.log('No data...');
      }
    });
  }

  submitComdStatus() {
    let data = {
      ElementId: this.baseId,
      subunitId1: this.subunitId1,
      subunitId2: this.subunitId2,
      subunitId3: this.subunitId3,
      scs1: this.scs1,
      scs2: this.scs2,
      scs3: this.scs3,
      queryId: '2',
    };
    console.log('Cmd Status Data', data);
    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      if (result) {
        console.log('Cmd Status Resp : ', result);
        this.backendResp_cmdstatus = 'Comd Status is Set Successfully. Depl OP';
      } else {
        console.log('No data...');
      }
    });
  }
  //
  submitOPDeploymentData(inputValue: any) {
    if (this.baseId) {
      let ang = this.fltDataSvc.calculateAngle(
        this.plotService.uLat,
        this.plotService.uLng,
        inputValue.opLat,
        inputValue.opLng
      );
      console.log('Center to OP ang : ', this.plotService.uLat);
      let data = {
        elementId: this.baseId,
        secId: inputValue.secId,
        opLat: inputValue.opLat,
        opLng: inputValue.opLng,
        opLtArc: inputValue.opLtArc,
        opRtArc: inputValue.opRtArc,
        arcId:
          ang >= 0 && ang <= 90
            ? 1
            : ang >= 91 && ang <= 180
            ? 2
            : ang >= 181 && ang <= 270
            ? 3
            : ang >= 271 && ang < 360
            ? 4
            : null,
        queryId: '3',
      };
      console.log('OP Deploy Data', data);
      this.backendService.SubmitQuery(data).subscribe((result: any) => {
        if (result) {
          // this.secId = result.secElementId;
          console.log('Returned Sector Id', result);
          this.backendResp_opDepl =
            'OP Sector ' + this.secId + ' Depl Successfully. Depl next OP';
          // this.setNextOp(result.secElementId);
        } else {
          console.log('No data...');
        }
      });
    } else {
      confirm('No unit is deployed ....');
    }
  }

  deplType(val: number) {
    console.log(val);
    if (val == 2) {
      if (this.deploymentId) {
        this.deplOpt = val;
      } else {
        confirm('Please Deploy Unit First as per Ser (1) ....');
      }
    } else {
      this.deplOpt = val;
      this.plotService.isDeplOP = false;
    }
  }
  //
  ngOnInit() {
    this.plotService.initMap(1); // 1 = deployADCP
    let isIndep = this.authService.LoggedUserData(3);
    this.baseId =
      isIndep == 1
        ? this.authService.LoggedUserData(5)
        : this.authService.LoggedUserData(4);
    this.baseId == 125
      ? ((this.arrCS = this.arrCSMsl), (this.secArr = this.mslSecArr))
      : ((this.arrCS = this.arrCSReg), (this.secArr = this.opSecArr));
    this.assignSubunitId(this.baseId);
    this.plotService.process_depl();
  }
}
