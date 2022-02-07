import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { MapthemeService } from './../../../services/maptheme.service';
import { BackendService } from './../../../services/backend.service';
import { FlightdataService } from './../../../services/flightdata.service';

export interface acSpeed {
  value: string;
  viewValue: string;
}
export interface acHeight {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-createprofile',
  templateUrl: './createprofile.component.html',
  styleUrls: ['./createprofile.component.css'],
})
export class CreateprofileComponent implements OnInit {
  isLinear: boolean = false;
  lat: number = 0;
  lng: number = 0;
  zoom: number = 0;
  color = 'primary';
  checked = false;
  disabled = false;
  speed: number = 0;
  height: number = 0;
  pLat: number = 0;
  pLng: number = 0;
  baseId: number = 0;
  baseName: string = '';
  tgtId: number = 0;
  tgtName: string = '';
  mapThemeDayMode: any[] = [];
  arrElementData: any[] = [];
  arrElementLabel: any[] = [];
  pathCoords: any[] = [];
  baseList: any[] = [];
  kpiList: any[] = [];
  arrLabel: any[] = [];
  arrEnAirBase: any[] = [];
  arrMapSetup: any[] = [];
  origId: number = 0;
  attkId: number = 0;
  backend_resp_initiate_sortie: string = 'Waiting for Backend Response....';
  backend_resp_sortie_details: string = 'Waiting for Backend Response....';
  NavId: string = 'encon';
  constructor(
    public authService: AuthService,
    private themeService: MapthemeService,
    private backendService: BackendService,
    private fltDataSvc: FlightdataService
  ) {}
  // =============
  arrSpeed: acSpeed[] = [
    { value: '0.5', viewValue: '0.5 Mach' },
    { value: '1.0', viewValue: '1.0 Mach' },
    { value: '1.5', viewValue: '1.5 Mach' },
    { value: '2.0', viewValue: '2.0 Mach' },
    { value: '2.5', viewValue: '2.5 Mach' },
    { value: '3.0', viewValue: '3.0 Mach' },
  ];
  arrHeight: acHeight[] = [
    { value: '1.0', viewValue: '1000' },
    { value: '1.5', viewValue: '1500' },
    { value: '2.0', viewValue: '2000' },
    { value: '2.5', viewValue: '2500' },
    { value: '3.0', viewValue: '3000' },
    { value: '4.0', viewValue: '4000' },
    { value: '5.0', viewValue: '5000' },
    { value: '6.0', viewValue: '6000' },
    { value: '8.0', viewValue: '8000' },
  ];

  getBaseList(orig: number) {
    this.origId = orig;
    this.baseList = [];
    this.baseList = this.arrEnAirBase.filter((m) => m.origin == orig);
    console.log('Array BaseList :', this.baseList);
  }

  getIdByName(elmName: string, origin: number) {
    if (origin == 1) {
      let index = this.kpiList.findIndex((p) => p.elementName == elmName);
      return this.kpiList[index].elementId;
    } else {
      let index = this.baseList.findIndex((p) => p.elementName == elmName);
      return this.baseList[index].elementId;
    }
  }

  initiateSortie(inputValue: any) {
    let data = {
      baseId: this.getIdByName(inputValue.baseName, 0),
      tgtId: this.getIdByName(inputValue.tgtName, 1),
      orig: this.origId,
      queryId: '4',
    };
    console.log('initiate Sortie Data', data);
    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      if (result) {
        this.attkId = result;
        this.backend_resp_initiate_sortie = 'Profile Created successfully...';
      } else {
        console.log('No data...');
      }
    });
  }

  submitSortieDetails(inputValue: any) {
    let data = {
      attkId: this.attkId,
      speed: inputValue.speed,
      height: inputValue.height,
      pLat: inputValue.pLat,
      pLng: inputValue.pLng,
      queryId: '5',
    };
    console.log('Deploy Data', data);
    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      if (result) {
        let _Ser = result.Ser;
        this.backend_resp_sortie_details =
          'Path Profile Info Added for Serial ' + this.attkId + '/' + _Ser;
        console.log('attkId : ', this.attkId + ' | ' + _Ser);
      } else {
        console.log('No data...');
      }
    });
  }

  getLocation($event: any) {
    this.pLat = $event.coords.lat;
    this.pLng = $event.coords.lng;
    let data = {
      flightId: this.attkId,
      lineCoordLat: $event.coords.lat,
      lineCoordLng: $event.coords.lng,
    };
    this.pathCoords.push(data);
    console.log('Path Coord : ', this.pathCoords);
  }

  reset(val: any) {
    if (val == 2) {
      this.pathCoords = [];
    }
  }
  // ================================
  setPatternNotLogged(data: any) {
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        let dx0 = {
          origin: data.origin,
          elementName: data.elementName,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
          radius: 5000,
        };
        this.arrElementData.push(dx0);
      } else {
        let dx1 = {
          origin: data.origin,
          elementName: data.elementName,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
          radius: 20000,
        };
        this.arrElementData.push(dx1);
      }
    }
  }
  setElmLoc() {
    let infoFetched = localStorage.getItem('arrDeplElm');
    if (infoFetched != null) {
      let d = JSON.parse(infoFetched);
      console.log(d);
      for (let index = 0; index < d.length; index++) {
        let data = {
          origin: parseInt(d[index].Origin),
          elementId: d[index].ElementId,
          elementName: d[index].ElementName,
          lat: parseFloat(d[index].lat),
          lng: parseFloat(d[index].lng),
          latLabel: parseFloat(d[index].lat) - 0.38,
        };
        if (d[index].Origin == 1) {
          this.kpiList.push(data);
        } else {
          this.arrEnAirBase.push(data);
        }
        this.arrLabel.push(data);
        this.setPatternNotLogged(data);
      }
    }
  }

  ngOnInit() {
    this.kpiList = [];
    this.pathCoords = [];
    this.mapThemeDayMode = this.themeService.mapMode();
    this.arrMapSetup = this.fltDataSvc.returnMapSetupData();
    this.lat = this.arrMapSetup[0].lat;
    this.lng = this.arrMapSetup[0].lng;
    this.zoom = this.arrMapSetup[0].zoom;
    this.setElmLoc();
    // this.printLocation();
  }
}
