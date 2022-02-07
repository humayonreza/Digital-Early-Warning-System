import { Component, OnInit } from '@angular/core';
// import { FlightdataService } from 'src/app/services/flightdata.service';
import { FlightdataService } from './../../../../services/flightdata.service';
// import {} from 'googlemaps';
@Component({
  selector: 'app-radarop1',
  templateUrl: './radarop1.component.html',
  styleUrls: ['./radarop1.component.css'],
})
export class Radarop1Component implements OnInit {
  constructor(private fltDataSvc: FlightdataService) {}
  google: any;
  arrMapSetup: any[] = [];
  lat: number = 0;
  lng: number = 0;
  zoom: number = 0;
  public onMapReady(instance: google.maps.Map): void {
    instance.addListener('mousemove', ($e: any) => {
      let x = $e.coords.lat;

      console.log(x);
    });
  }
  ngOnInit(): void {
    this.arrMapSetup = this.fltDataSvc.returnMapSetupData();
    this.lat = this.arrMapSetup[0].lat;
    this.lng = this.arrMapSetup[0].lng;
    this.zoom = this.arrMapSetup[0].zoom;
  }
}
