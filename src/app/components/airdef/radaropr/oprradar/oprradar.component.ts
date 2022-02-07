import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import { ThemePalette } from '@angular/material/core';
//
import { FlightdataService } from './../../../../services/flightdata.service';
import { BackendService } from './../../../../services/backend.service';
import { AuthService } from './../../../../services/auth.service';
@Component({
  selector: 'app-oprradar',
  templateUrl: './oprradar.component.html',
  styleUrls: ['./oprradar.component.css'],
})
export class OprradarComponent implements OnInit {
  map: any;
  NavId: string = 'adcp';
  baseRadarX: number = 0;
  baseRadarY: number = 0;
  rngRadar: number = 0;
  CenKPI: string = '';
  loggedRadarId: number = 0;
  t: any;
  delay: number = 4000;
  Speed: number = 1.5;
  Height: number = 4;
  ProfileType: number = 0;
  //
  acId: number = 0;
  lastLat: number = 0;
  lastLng: number = 0;
  currentAcId: number = 0;
  arrAxis: any[] = [];
  arrProfileType: any[] = [];
  arrSpeed: any[] = [];
  arrHeight: any[] = [];
  arrAcMarker: any[] = [];
  arrElm: any[] = [];
  line: any[] = [];
  lbl: any[] = [];
  arrParam: any[] = [];
  arrFetchedFltData: any[] = [];
  arrProfiles: any[] = [];
  color: ThemePalette = 'primary';
  imgPath: string = 'http://52.63.82.10/backendDEWS/images/icon_ac/';
  // imgPath: string = 'http://localhost:8080/backendDEWS/images/icon_ac/';
  constructor(
    private authService: AuthService,
    private fltDataSvc: FlightdataService,
    private backendService: BackendService
  ) {}
  initMap(): void {
    this.map = L.map('map', {
      center: [23.5, 90],
      zoom: 6.5,
    });

    // L.DomUtil.addClass(this.map._container, 'crosshair-cursor-enabled');
    // const tiles = L.tileLayer(
    //   'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    //   {
    //     attribution:
    //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //     subdomains: 'abcd',
    //     maxZoom: 19,
    //   }
    // ).addTo(this.map);

    const tiles = L.tileLayer(
      'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.map);
  }
  //
  // L.tileLayer(
  //     'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
  //     {
  //       maxZoom: 19,
  //       attribution:
  //         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //     }
  //   )
  //
  //   L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
  // 	maxZoom: 19,
  // 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // })
  set_arr_param_air_profile() {
    for (let i = 0; i < this.arrParam.length; i++) {
      this.arrParam[i].Category == 1
        ? this.arrProfileType.push(this.arrParam[i])
        : this.arrParam[i].Category == 2
        ? this.arrSpeed.push(this.arrParam[i])
        : this.arrHeight.push(this.arrParam[i]);
    }
    // console.log('Arr Height : ', this.arrHeight);
  }
  //

  set_profile_type(OptVal: number) {
    console.log('ProfileType : ', OptVal);
    this.ProfileType = OptVal;
    this.Speed = 1.5;
    this.Height = 4;
    for (let i = 0; i < this.arrProfileType.length; i++) {
      this.arrProfileType[i].cl =
        this.arrProfileType[i].OptVal == OptVal ? 1 : 0;
    }
  }
  //
  set_profile_speed(val: number) {
    this.Speed = val;
  }
  //
  set_profile_height(val: number) {
    this.Height = val;
  }
  //
  setElmLoc(loggedId: number) {
    let infoFetched = localStorage.getItem('arrDeplElm');
    if (infoFetched != null) {
      let d = JSON.parse(infoFetched);
      for (let index = 0; index < d.length; index++) {
        let data = {
          elementId: parseInt(d[index].ElementId),
          elementName: d[index].ElementName,
          origin: parseInt(d[index].Origin),
          lat: parseFloat(d[index].lat),
          lng: parseFloat(d[index].lng),
          latLabel: parseFloat(d[index].lat) - parseFloat('0.41'),
          radarRange: parseInt(d[index].OpRange),
          elementType: parseInt(d[index].ElementType),
        };
        this.arrElm.push(data);
        // console.log('Element Type : ', this.arrElm);
        if (data.elementId == loggedId) {
          this.setPatternLogged(data);
          this.baseRadarX = parseFloat(d[index].lat);
          this.baseRadarY = parseFloat(d[index].lng);
          this.rngRadar = parseFloat(d[index].OpRange) * 1000;
          this.create_ppi_scale(
            this.baseRadarX,
            this.baseRadarY,
            this.rngRadar + 10000
          );
          this.CenKPI =
            parseFloat(d[index].lat) + ',' + parseFloat(d[index].lng);
          // console.log('XY : ', XY);
        } else {
          this.setPatternNotLogged(data);
        }
      }
      console.log('Depl Data @opr radar : ', this.arrElm);
    }
  }
  // line_upto_ac(orig: any, dest: any, info: string)

  draw_axis_at_ppi(pointA: any, pointB: any, lineColor: string) {
    let pointList = [pointA, pointB];
    new L.Polyline(pointList, {
      color: lineColor,
      weight: 0.7,
      opacity: 1,
      smoothFactor: 1,
    }).addTo(this.map);
  }
  //
  create_ppi_scale(x: number, y: number, r: number) {
    for (let ang = 0; ang <= 360; ang = ang + 1) {
      if (ang % 45 == 0) {
        let pointA = new L.LatLng(x, y);
        let ptB = this.fltDataSvc.destinationPoint(x, y, ang, r);
        let pt2 = ptB.split('-');
        let pointB = new L.LatLng(parseFloat(pt2[0]), parseFloat(pt2[1]));
        this.draw_axis_at_ppi(pointA, pointB, '#777');
      } else if (ang % 5 == 0 && ang % 45 != 0) {
        let rad = r - 20000;
        let ptA = this.fltDataSvc.destinationPoint(x, y, ang, rad);
        let pt1 = ptA.split('-');
        let pointA = new L.LatLng(parseFloat(pt1[0]), parseFloat(pt1[1]));
        let ptB = this.fltDataSvc.destinationPoint(x, y, ang, r);
        let pt2 = ptB.split('-');
        let pointB = new L.LatLng(parseFloat(pt2[0]), parseFloat(pt2[1]));
        this.draw_axis_at_ppi(pointA, pointB, '#f00');
      } else if (ang % 5 != 0 && ang % 45 != 0) {
        let rad = r - 10000;
        let ptA = this.fltDataSvc.destinationPoint(x, y, ang, rad);
        let pt1 = ptA.split('-');
        let pointA = new L.LatLng(parseFloat(pt1[0]), parseFloat(pt1[1]));
        let ptB = this.fltDataSvc.destinationPoint(x, y, ang, r);
        let pt2 = ptB.split('-');
        let pointB = new L.LatLng(parseFloat(pt2[0]), parseFloat(pt2[1]));
        this.draw_axis_at_ppi(pointA, pointB, '#555');
      }
    }
    console.log('arrAXIS :', this.arrAxis);
  }
  //
  setPatternLogged(data: any) {
    for (let rad = 0; rad <= data.radarRange * 1000; rad = rad + 10000) {
      let d = {
        lat: data.lat,
        lng: data.lng,
        radarRange: rad,
        elementType: data.elementType,
        fillColor: 'white',
        isLogged: 1,
      };
      this.printLayput(d);
    }
  }
  //
  setPatternNotLogged(data: any) {
    for (let i = 0; i < 2; i++) {
      if (data.elementType == 2) {
        let rng2 = i == 0 ? 6000 : 20000;
        let fcolor = i == 0 ? '#f00' : '#999';
        let d2 = {
          lat: data.lat,
          lng: data.lng,
          radarRange: rng2,
          elementType: data.elementType,
          fillColor: fcolor,
          isLogged: 0,
        };
        this.printLayput(d2);
      } else if (data.elementType == 6) {
        let rng6 = i == 0 ? 3000 : data.radarRange * 1000;
        let fcolor = i == 0 ? '#f00' : 'red';
        let d6 = {
          lat: data.lat,
          lng: data.lng,
          radarRange: rng6,
          elementType: data.elementType,
          fillColor: fcolor,
          isLogged: 0,
        };
        this.printLayput(d6);
      }
    }
  }
  //
  // group: any;
  printLayput(data: any) {
    L.circle([data.lat, data.lng], {
      color: data.elementType == 2 ? '#ff0' : '#667',
      fillColor: data.fillColor,
      // data.elementType == 2 ? '#f00' : data.isLogged == 1 ? '#555' : '#444',
      fillOpacity: data.elementType == 2 ? 0.3 : 0.04,
      radius:
        data.elementType == 2
          ? data.radarRange
          : data.isLogged == 1
          ? data.radarRange
          : data.radarRange,
      weight: data.elementType == 2 ? 0.4 : data.isLogged == 1 ? 0.5 : 0.2,
    }).addTo(this.map);
    // .on('click', this.circleClick);
    // L.DomUtil.addClass(this.map._container, 'crosshair-cursor-enabled');
  }
  //
  locateAircraft() {
    this.map.on('mousemove', (e: any) => {
      this.map.removeLayer(this.lbl);
      let coord = e.latlng;
      let dest = new L.LatLng(coord.lat, coord.lng);
      let distance = this.fltDataSvc.calculateDistance(
        this.baseRadarX,
        this.baseRadarY,
        coord.lat,
        coord.lng
      );
      let ang = Math.floor(
        this.fltDataSvc.calculateAngle(
          this.baseRadarX,
          this.baseRadarY,
          coord.lat,
          coord.lng
        )
      );
      // this.insertAirCraftLocation();
      let infoLbl = ang + ' Deg | ' + Math.floor(distance / 1000) + ' kms';
      let info = infoLbl;
      // distance <= this.rngRadar ? this.line_upto_ac(orig, dest, info) : null;
      distance <= this.rngRadar ? this.display_flight_info(dest, info) : null;
    });
  }
  //
  //
  display_flight_info(dest: any, info: string) {
    let infoLbl: any = L.marker(dest, { opacity: 0.6 })
      .bindTooltip(info, {
        permanent: true,
        className: 'lblCl',
      })
      .addTo(this.map);
    this.lbl = infoLbl;
  }
  //
  create_line_upto_Aircraft(orig: any, dest: any) {
    let pointList = [orig, dest];
    let l: any = new L.Polyline(pointList, {
      color: '#fff',
      weight: 1,
      opacity: 1,
      smoothFactor: 1,
    });
    l.addTo(this.map);
    this.line = l;
  }
  //
  create_prolile() {
    if (this.ProfileType == 0) {
      confirm('Select Profile Type : [H],[A],[M]');
    } else {
      let data = {
        queryId: '7',
      };
      this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
        let d = {
          acId: resp[0].flightId,
          speed: this.Speed,
          height: this.Height,
          origin: this.ProfileType,
          heading: 0,
          lat: 0,
          lng: 0,
          isVisible: 1,
          senderId: this.loggedRadarId,
          queryId: '6',
        };
        if (d.acId > 0) {
          this.fltDataSvc.SubmitQuery(d).subscribe((resp: any) => {
            console.log('Insert Flight Data@oprradar', resp);
          });
        } else {
          console.log('acId is not valid or 0 @oprradar');
        }
      });
    }
  }
  //

  update_flight_data(data: any) {
    this.acId = data.acId;
    this.lastLat = data.lat;
    this.lastLng = data.lng;
    this.Speed = parseFloat(data.speed);
    this.Height = parseFloat(data.height) / 1000;
    this.currentAcId = data.acId;
    this.ProfileType = data.origin;
    console.log('data ORIGIN : ', data.origin);
    if (parseInt(data.origin) == 1) {
      this.arrProfileType[0].cl = 1;
      this.arrProfileType[1].cl = 0;
    } else if (parseInt(data.origin) == 2) {
      this.arrProfileType[0].cl = 0;
      this.arrProfileType[1].cl = 1;
    }
    // parseInt(data.origin) == 1
    //   ? ((this.arrProfileType[1].cl = 1), (this.arrProfileType[0].cl = 0))
    //   : ((this.arrProfileType[0].cl = 1), (this.arrProfileType[1].cl = 0));
    // this.arrProfileType[1].cl = 1;
    // for (let i = 0; i < this.arrProfileType.length; i++) {
    //   this.arrProfileType[i].cl =
    //     this.arrProfileType[i].acId == parseInt(data.acId) ? 1 : 0;
    // }
  }

  insertAirCraftLocation() {
    this.map.on('click', (c: any) => {
      let coord = c.latlng;
      let data = {
        acId: this.acId,
        speed: this.Speed,
        height: this.Height,
        origin: this.ProfileType,
        heading: this.fltDataSvc.calculateAngle(
          this.lastLat,
          this.lastLng,
          coord.lat,
          coord.lng
        ),
        lat: coord.lat,
        lng: coord.lng,
        isVisible: 1,
        senderId: this.loggedRadarId,
        queryId: '6',
      };
      if (data.acId > 0) {
        this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
          console.log('Insert Flight Data @ oprradar', resp);
          let orig = new L.LatLng(this.baseRadarX, this.baseRadarY);
          let dest = new L.LatLng(coord.lat, coord.lng);
          this.map.removeLayer(this.line);
          this.create_line_upto_Aircraft(orig, dest);
        });
      } else {
        confirm('Select a Profile from Flight Data ....');
      }
    });
  }

  start() {
    this.t = setTimeout(() => {
      let data = {
        queryId: '14A',
      };
      this.arrFetchedFltData = [];
      this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
        if (resp.Response != '401') {
          this.arrFetchedFltData = resp;
          this.setFlightData(this.arrFetchedFltData);
        } else {
          // console.log('No Flight Data ...');
        }
      });
      this.start();
    }, this.delay);
  }
  //
  remove_marker() {
    for (let i = 0; i < this.arrAcMarker.length; i++) {
      this.map.removeLayer(this.arrAcMarker[i]);
    }
  }
  //
  setFlightData(fltData: any) {
    this.remove_marker();
    this.arrProfiles = [];
    this.arrAcMarker = [];
    if (fltData) {
      for (let i = 0; i < fltData.length; i++) {
        let f_data = {
          Ser: fltData[i].Ser,
          acId: fltData[i].acId,
          lat: parseFloat(fltData[i].lat),
          lng: parseFloat(fltData[i].lng),
          dist:
            parseFloat(fltData[i].lat) == 0
              ? 0
              : Math.floor(
                  this.fltDataSvc.calculateDistance(
                    this.baseRadarX,
                    this.baseRadarY,
                    parseFloat(fltData[i].lat),
                    parseFloat(fltData[i].lng)
                  ) / 1000
                ),
          brg:
            parseFloat(fltData[i].lat) == 0
              ? 0
              : Math.floor(
                  this.fltDataSvc.calculateAngle(
                    this.baseRadarX,
                    this.baseRadarY,
                    parseFloat(fltData[i].lat),
                    parseFloat(fltData[i].lng)
                  )
                ),
          heading:
            parseFloat(fltData[i].lat) == 0
              ? 0
              : Math.floor(
                  this.fltDataSvc.calculateAngle(
                    this.lastLat,
                    this.lastLng,
                    parseFloat(fltData[i].lat),
                    parseFloat(fltData[i].lng)
                  )
                ),
          height: parseFloat(fltData[i].height) * 1000,
          speed: fltData[i].speed,
          tac: fltData[i].numberAc,
          origin: parseInt(fltData[i].origin),
          isSelected:
            parseInt(fltData[i].acId) == this.currentAcId && fltData[i].acId > 0
              ? true
              : false,
          isVisible: fltData[i].isVisible,
          senderId: parseInt(fltData[i].senderId),
        };
        this.lastLat = parseFloat(fltData[i].lat);
        this.lastLng = parseFloat(fltData[i].lng);
        parseInt(fltData[i].senderId) == this.loggedRadarId
          ? this.arrProfiles.push(f_data)
          : null;
        this.simulateFlightProfile(f_data);
      }
    } else {
      console.log('No Flight Data..@ Opr Radar');
    }
  }
  //
  simulateFlightProfile(data: any) {
    let imgId = data.isSelected == true ? '3' : '2';
    let acIcon = L.icon({
      iconUrl: this.imgPath + imgId + '.gif',
      iconSize: [7, 7],
    });

    let marker: any = L.marker([data.lat, data.lng], {
      icon: acIcon,
      rotationAngle: data.heading,
    }).addTo(this.map);
    this.arrAcMarker.push(marker);
    // console.log('arr AC Markers..@ Opr Radar', this.arrAcMarker);
  }
  //
  remove_flight_data(acId: number, senderId: number) {
    // console.log(acId + ' ' + senderId);
    let data = {
      reset_id: 5232,
      acId,
      senderId,
      queryId: '10A',
    };
    this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
      console.log('Flight Data Removed@oprradar', resp.acId + ' deleted');
      if (resp) {
        let index = this.arrProfiles.findIndex((p) => p.acId == acId);
        this.arrProfiles.splice(index, 1);
      }
    });
  }
  //
  ngOnInit(): void {
    this.initMap();
    this.arrParam = this.backendService.get_arr_param();
    this.set_arr_param_air_profile();
    this.loggedRadarId = this.authService.LoggedUserData(5);
    this.setElmLoc(this.loggedRadarId);
    this.insertAirCraftLocation();
    this.locateAircraft();
    this.start();
  }
}
