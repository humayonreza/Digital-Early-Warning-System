import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../../services/auth.service';
import { MapthemeService } from './../../../services/maptheme.service';
import { BackendService } from './../../../services/backend.service';
import { FlightdataService } from './../../../services/flightdata.service';

@Component({
  selector: 'app-deplenairbase',
  templateUrl: './deplenairbase.component.html',
  styleUrls: ['./deplenairbase.component.css'],
})
export class DeplenairbaseComponent implements OnInit {
  isLinear: boolean = false;
  lat: number = 0;
  lng: number = 0;
  zoom: number = 0;
  color = 'primary';
  checked = false;
  disabled = false;

  baseLat: number = 0;
  baseLng: number = 0;
  baseId: number = 0;
  exName: string = '';
  mapMode: any[] = [];
  arrElementData: any[] = [];
  arrElementLabel: any[] = [];

  baseList: any[] = [];
  kpiList: any[] = [];
  origId: number = 0;
  attkId: number = 0;
  backend_resp: string = 'Waiting for Backend Response....';
  NavId: string = 'encon';
  constructor(
    public authService: AuthService,
    private themeService: MapthemeService,
    private backendService: BackendService,
    private fltDataSvc: FlightdataService
  ) {}

  // ===============
  // printLocation() {
  //   let category = this.authService.LoggedUserData(2);
  //   let loggedUnit =
  //     this.authService.LoggedUserData(3) == 0
  //       ? this.authService.LoggedUserData(4)
  //       : this.authService.LoggedUserData(5);
  //   let data = { queryId: 15 };
  //   this.layoutService.getDeplElmData(data).subscribe((result) => {
  //     result ? this.layoutService.layout(loggedUnit, category) : null;
  //     this.arrElementData = this.layoutService.printDeplElementLoc();
  //     this.arrElementLabel = this.layoutService.printDeplElmLabel();
  //     this.kpiList = this.arrElementLabel.filter((m) => m.origin == 1);
  //     console.log('arrElementLabel : ', this.arrElementData);
  //   });
  // }
  // setElmLoc() {
  //   let infoFetched = localStorage.getItem('arrDeplElm');
  //   if (infoFetched != null) {
  //     let d = JSON.parse(infoFetched);
  //     for (let index = 0; index < d.length; index++) {
  //       let data = {
  //         elementId: d[index].ElementId,
  //         elementName: d[index].ElementName,
  //         origin: d[index].Origin,
  //         lat: parseFloat(d[index].lat),
  //         lng: parseFloat(d[index].lng),
  //         latLabel: parseFloat(d[index].lat) - parseFloat('0.41'),
  //         rad: 15000,
  //       };
  //       this.arrElementData.push(data);
  //       if (d[index].Origin == 1) {
  //         this.kpiList.push(data);
  //       }
  //     }
  //     // console.log('1001 : ', this.arrElementData);
  //   }
  // }
  // ================================
  setPatternNotLogged(data: any) {
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        let dx0 = {
          origin: data.origin,
          elementName: data.ElementName,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
          radius: 5000,
        };
        this.arrElementData.push(dx0);
      } else {
        let dx1 = {
          origin: data.origin,
          elementName: data.ElementName,
          lat: parseFloat(data.lat),
          lng: parseFloat(data.lng),
          radius: 20000,
        };
        this.arrElementData.push(dx1);
      }
    }
  }
  arrLabel: any[] = [];
  setElmLoc() {
    let infoFetched = localStorage.getItem('arrDeplElm');
    if (infoFetched != null) {
      let d = JSON.parse(infoFetched);
      console.log(d);
      for (let index = 0; index < d.length; index++) {
        let data = {
          origin: parseInt(d[index].Origin),
          elementName: d[index].ElementName,
          lat: parseFloat(d[index].lat),
          lng: parseFloat(d[index].lng),
          latLabel: parseFloat(d[index].lat) - 0.38,
        };
        this.arrLabel.push(data);
        this.setPatternNotLogged(data);
      }
    }
  }
  getBaseList(orig: number) {
    this.origId = orig;
    this.baseList = [];
    this.baseList = this.arrElementData.filter((m) => m.origin == orig);
    console.log('Array BaseList :', this.baseList);
  }

  // s

  deplAirBase(inputValue: any) {
    let data = {
      ElementId: inputValue.baseId,
      ExName: inputValue.exName ? inputValue.exName : 'NA',
      baseLat: inputValue.baseLat,
      baseLng: inputValue.baseLng,
      queryId: '12',
    };

    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      // console.log(result.Response);
      if (result.Response == '201') {
        this.backend_resp = 'Air Base Redeployed successfully...';
        let index = this.arrElementData.findIndex(
          (p) => p.elementId == inputValue.baseId
        );
        this.arrElementData[index].lat = inputValue.baseLat;
        this.arrElementData[index].lng = inputValue.baseLng;
        // this.printLocation();
      } else {
        console.log('No data...');
      }
    });
  }

  getLocation($event: any) {
    this.baseLat = $event.coords.lat;
    this.baseLng = $event.coords.lng;
  }

  reset(val: number) {
    console.log(val);
  }
  arrMapSetup: any[] = [];
  ngOnInit() {
    this.kpiList = [];
    this.mapMode = this.themeService.mapMode();
    this.arrMapSetup = this.fltDataSvc.returnMapSetupData();
    this.lat = this.arrMapSetup[0].lat;
    this.lng = this.arrMapSetup[0].lng;
    this.zoom = this.arrMapSetup[0].zoom;
    this.setElmLoc();
  }
}
