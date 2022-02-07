import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import { FlightdataService } from './flightdata.service';
@Injectable({
  providedIn: 'root',
})
export class PlotService {
  map: any;
  arrElm: any[] = [];
  baseX: number = 0;
  baseY: number = 0;
  uLat: number = 0;
  uLng: number = 0;
  opLat: number = 0;
  opLng: number = 0;
  zoom: number = 8;
  isDeplOP: boolean = false;
  opSec: string = '';
  arrAcMarker: any[] = [];
  arrAdunits: any[] = [];
  arrLabel: any[] = [];
  arrOP: any[] = [];
  arrOPLabel: any[] = [];
  arrCircle: any[] = [];
  constructor(private fltDataSvc: FlightdataService) {}
  // { zoomControl: false }
  imgPath: string = 'http://52.63.82.10/backendDEWS/images/icon_ac/';
  // imgPath: string = 'http://localhost:8080/backendDEWS/images/icon_ac/';
  initMap(isVisZoomCon: number): void {
    this.map = L.map('map', {
      center: [23.8, 90],
      zoom: 7, //baseId == 0 ? 6.7 : this.zoom,
      zoomControl: isVisZoomCon == 0 ? false : true,
    });
    L.DomUtil.addClass(this.map._container, 'crosshair-cursor-enabled');
    const tiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(this.map);
  }
  //
  mapZoomCon(zInc: number) {
    let center = new L.LatLng(this.baseX, this.baseY);
    let z = this.map.getZoom() + zInc;
    if (z >= 9) {
      for (let index = 0; index < this.arrOP.length; index++) {
        this.display_label({
          lat: this.arrOP[index].lat,
          lng: this.arrOP[index].lng,
          eName: this.arrOP[index].secId,
        });
      }
      this.map.flyTo(center, z);
    } else {
      this.map.flyTo(center, z);
      console.log('Current Zoom @mapZoomCon', this.map.getZoom() + ' | ' + z);
      z >= 8
        ? this.remove_element_labels()
        : this.reprint_element_label(this.arrLabel);
      this.remove_op_labels();
    }
  }
  //
  reprint_element_label(arrElement: any) {
    for (let i = 0; i < arrElement.length; i++) {
      this.display_label({
        lat: arrElement[i].lat,
        lng: arrElement[i].lng,
        eName: arrElement[i].elementName,
      });
    }
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
          deploymentId: d[index].DeploymentId,
          lat: parseFloat(d[index].lat),
          lng: parseFloat(d[index].lng),
          latLabel: parseFloat(d[index].lat) - parseFloat('0.41'),
          elementType: parseInt(d[index].ElementType),
        };
        this.arrElm.push(data);
        if (data.elementId == loggedId) {
          this.baseX = parseFloat(d[index].lat);
          this.baseY = parseFloat(d[index].lng);
          this.setPatternLogged(data);
          this.fetch_op_data(loggedId); // Get OP Data;
        } else {
          if (
            parseInt(d[index].Origin) == 1 &&
            parseInt(d[index].isIndependent) == 1
          ) {
            this.arrAdunits.push(data);
            console.log('AD UNITS @PlotService', this.arrAdunits);
            this.arrLabel.push(data);
            this.setPatternNotLogged(data);
          } else {
            this.arrLabel.push(data);
            this.setPatternNotLogged(data);
          }
          this.setPatternNotLogged(data);
        }
      }
      // console.log('Depl Data @opr  : ', this.arrElm);
    }
  }
  //
  fetch_op_data(elementId: number) {
    let data = {
      elementId,
      queryId: '13',
    };
    this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
      if (resp.Response != '401') {
        for (let index = 0; index < resp.length; index++) {
          let data = {
            secId: resp[index].secId,
            lat: parseFloat(resp[index].opLat),
            lng: parseFloat(resp[index].opLng),
            arcId: resp[index].arcId,
            cl: 0,
          };
          this.arrOP.push(data);
        }
      } else {
        console.log('No OP Data found ...');
      }
    });
  }
  //
  setPatternLogged(data: any) {
    let d = {
      lat: data.lat,
      lng: data.lng,
      radius: 30000,
      elementType: data.elementType,
      fillColor: 'blue',
      eName: '',
    };
    this.printLayput(d);
    this.create_ppi_scale(data.lat, data.lng, 45000, 1);
  }
  //
  setPatternNotLogged(data: any) {
    let fColor = data.origin == 1 ? '#212F3C' : '#E74C3C';
    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        let dx1 = {
          lat: data.lat,
          lng: data.lng,
          radius: 4000,
          elementType: data.elementType,
          fillColor: fColor,
          eName: '',
        };
        this.printLayput(dx1);
      } else if (i == 1) {
        let dx2 = {
          lat: data.lat,
          lng: data.lng,
          radius: 15000,
          elementType: data.elementType,
          fillColor: fColor,
          eName: data.elementName,
        };
        this.printLayput(dx2);
        this.display_label({
          lat: data.lat,
          lng: data.lng,
          eName: data.elementName,
        });
        let eType = data.origin == 1 ? 2 : 3;
        this.create_ppi_scale(dx2.lat, dx2.lng, 22000, eType);
      }
    }
  }
  printLayput(data: any) {
    let circle = L.circle([data.lat, data.lng], {
      color: '#999', //data.elementType == 2 ? '#ff0' : '#667',
      fillColor: data.fillColor,
      fillOpacity: 0.15, //data.elementType == 2 ? 0.3 : 0.04,
      radius: data.radius,
      weight: 0.4, //data.elementType == 2 ? 0.4 : data.isLogged == 1 ? 0.5 : 0.2,
    }).addTo(this.map);
    this.arrCircle.push(circle);
  }
  //
  get_label_lng7(strLength: number, lng: number) {
    console.log('I am in get_label_lng7');
    return strLength == 1 || strLength == 2
      ? lng - 0.0
      : strLength == 5 || strLength == 6
      ? lng - 0.07
      : strLength == 7 || strLength == 8
      ? lng - 0.2
      : strLength >= 9
      ? lng - 0.3
      : lng - 0.0;
  }
  get_label_lng8(strLength: number, lng: number) {
    console.log('I am in get_label_lng8');
    return strLength == 1 || strLength == 2
      ? lng - 0.0
      : strLength == 5 || strLength == 6
      ? lng - 0.07
      : strLength == 7 || strLength == 8
      ? lng - 0.2
      : strLength >= 9
      ? lng + 2
      : lng - 0.0;
  }
  //
  display_label(data: any) {
    console.log('OP Data @display: ', data);
    let str = data.eName;
    let x =
      str.length == 1 || str.length == 2
        ? parseFloat(data.lat) + 0.003
        : parseFloat(data.lat) - 0.22;
    console.log('Length : ', str.length);
    let y =
      str.length == 1 || str.length == 2
        ? parseFloat(data.lng) + 0.001
        : str.length == 5 || str.length == 6
        ? parseFloat(data.lng) - 0.07
        : str.length == 7 || str.length == 8
        ? parseFloat(data.lng) - 0.2
        : str.length > 8
        ? parseFloat(data.lng) - 0.3
        : parseFloat(data.lng) - 0.001;
    let coords = L.latLng(x, y);
    let lblTxt =
      str.length > 2
        ? '<span style="color: #777; width: 150px; font-size: 10px; text-align:center">' +
          data.eName.replace(' ', '&nbsp;') +
          '</span>'
        : '<span style="color: #999;font-size: 9px;">' + data.eName + '</span>';
    L.marker(coords, { opacity: 0 }).addTo(this.map);
    let lbl = L.marker(coords, {
      icon: L.divIcon({
        html: lblTxt,
        className: 'text-below-marker',
      }),
    }).addTo(this.map);
    str.length <= 2
      ? this.arrOPLabel.push(lbl)
      : this.arrElementLabel.push(lbl);
    console.log('arrOPLabel : ', this.arrOPLabel);
  }
  //
  arrElementLabel: any[] = [];
  //
  create_ppi_scale(x: number, y: number, r: number, eType: number) {
    let inc = eType == 1 ? 5 : 15;
    for (let ang = 0; ang <= 360; ang = ang + inc) {
      if (ang % 45 == 0) {
        let pointA = new L.LatLng(x, y);
        let ptB = this.fltDataSvc.destinationPoint(x, y, ang, r);
        let pt2 = ptB.split('-');
        let pointB = new L.LatLng(parseFloat(pt2[0]), parseFloat(pt2[1]));
        this.draw_axis_at_ppi(pointA, pointB, eType);
      } else if (ang % 5 == 0 && ang % 45 != 0) {
        let rad = eType == 1 ? r - 5000 : r - 3000;
        let ptA = this.fltDataSvc.destinationPoint(x, y, ang, rad);
        let pt1 = ptA.split('-');
        let pointA = new L.LatLng(parseFloat(pt1[0]), parseFloat(pt1[1]));
        let ptB = this.fltDataSvc.destinationPoint(x, y, ang, r);
        let pt2 = ptB.split('-');
        let pointB = new L.LatLng(parseFloat(pt2[0]), parseFloat(pt2[1]));
        this.draw_axis_at_ppi(pointA, pointB, eType);
      }
    }
    // console.log('arrAXIS :', this.arrAxis);
  }
  //
  draw_axis_at_ppi(pointA: any, pointB: any, eType: number) {
    let pointList = [pointA, pointB];
    new L.Polyline(pointList, {
      color: eType == 1 ? '#777' : eType == 2 ? '#666' : 'orange',
      weight: eType == 1 ? 0.4 : 0.2,
      opacity: 1,
      smoothFactor: 1,
    }).addTo(this.map);
  }
  //
  simulateFlightProfile(data: any) {
    let imgId = data.origin == 1 ? 'own' : 'en';
    let acIcon = L.icon({
      iconUrl: this.imgPath + imgId + '.png',
      iconSize: [12, 12],
    });

    let marker: any = L.marker([data.lat, data.lng], {
      icon: acIcon,
      rotationAngle: data.heading,
    }).addTo(this.map);
    this.arrAcMarker.push(marker);
  }
  //
  remove_marker() {
    for (let i = 0; i < this.arrAcMarker.length; i++) {
      this.map.removeLayer(this.arrAcMarker[i]);
    }
  }
  //
  remove_op_labels() {
    for (let i = 0; i < this.arrOPLabel.length; i++) {
      this.map.removeLayer(this.arrOPLabel[i]);
    }
  }
  //
  remove_element_labels() {
    for (let i = 0; i < this.arrElementLabel.length; i++) {
      this.map.removeLayer(this.arrElementLabel[i]);
    }
  }
  //
  remove_circle() {
    for (let i = 0; i < this.arrCircle.length; i++) {
      this.map.removeLayer(this.arrCircle[i]);
    }
  }
  //

  process_unit_depl(e: any) {
    this.remove_circle();
    this.uLat = e.latlng.lat;
    this.uLng = e.latlng.lng;
    for (let i = 0; i < 2; i++) {
      let rad = i == 0 ? 4500 : 20000;
      let data = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        radius: rad,
        elementType: 1,
        fillColor: '',
        eName: '',
      };
      console.log('UNIT DATA : ', data);
      this.printLayput(data);
      this.create_ppi_scale(this.uLat, this.uLng, 60000, 2);
    }
  }
  //
  process_op_depl(e: any, opSec: string) {
    this.opLat = e.latlng.lat;
    this.opLng = e.latlng.lng;
    this.display_label({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      eName: opSec,
    });
  }
  //
  process_depl() {
    this.map.on('click', (e: any) => {
      this.isDeplOP == false
        ? this.process_unit_depl(e)
        : this.process_op_depl(e, this.opSec);
    });
  }
}
