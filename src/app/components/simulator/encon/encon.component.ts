import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FlightdataService } from './../../../services/flightdata.service';
import { TtsService } from './../../../services/tts.service';
import { element } from 'protractor';
import { PlotService } from './../../../services/plot.service';
import { BackendService } from './../../../services/backend.service';

@Component({
  selector: 'app-encon',
  templateUrl: './encon.component.html',
  styleUrls: ['./encon.component.css'],
})
export class EnconComponent implements OnInit {
  map: any;
  NavId: string = 'encon';
  baseX: number = 0;
  baseY: number = 0;
  // rng: number = 0;
  en_base_logo: string = '';
  CenKPI: string = '';
  t: any;
  delay: number = 4000;
  // acId: number = 0;
  // arrAxis: any[] = [];
  acAOR: any[] = [];
  // spkrIconHeader: string = '';
  // arrElm: any[] = [];
  // line: any[] = [];
  // lbl: any[] = [];
  // arrParam: any[] = [];
  // arrFetchedFltData: any[] = [];
  flightData: any[] = [];
  // arrAdunits: any[] = [];
  arrConOrder: any[] = [];
  arrLabel: any[] = [];
  arrAirStrikes: any[] = [];
  color: ThemePalette = 'primary';
  arrFlightData: any[] = [];
  constructor(
    private fltDataSvc: FlightdataService,
    public ttsService: TtsService,
    private plotService: PlotService,
    private backendService: BackendService
  ) {}

  start() {
    this.t = setTimeout(() => {
      this.arrFlightData = this.fltDataSvc.getArrGenFltData();
      this.insertFLightData(this.arrFlightData);
      this.setFlightData(this.arrFlightData);
      this.start();
    }, this.delay);
  }
  //
  insertFLightData(fltData: any[]) {
    for (let i = 0; i < fltData.length; i++) {
      let data = fltData[i];
      this.fltDataSvc
        .SubmitQuery(data)
        .subscribe((result) => console.log('Ser inserted :', result));
    }
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
          dist:
            parseFloat(fltData[i].lat) == 0
              ? 0
              : Math.floor(
                  this.fltDataSvc.calculateDistance(
                    this.baseX,
                    this.baseY,
                    parseFloat(fltData[i].lat),
                    parseFloat(fltData[i].lng)
                  ) / 1000
                ),
          brg:
            parseFloat(fltData[i].lat) == 0
              ? 0
              : Math.floor(
                  this.fltDataSvc.calculateAngle(
                    this.baseX,
                    this.baseY,
                    parseFloat(fltData[i].lat),
                    parseFloat(fltData[i].lng)
                  )
                ),
          heading: parseFloat(fltData[i].heading),
          height: parseFloat(fltData[i].height) * 1000,
          speed: fltData[i].speed,
          tac: fltData[i].numberAc,
          origin: parseInt(fltData[i].origin),
          isVisible: fltData[i].isVisible,
          senderId: parseInt(fltData[i].senderId),
        };

        this.plotService.simulateFlightProfile(f_data);
      }
    } else {
      console.log('No Flight Data..@ Opr ');
    }
  }
  //
  ngOnInit(): void {
    this.plotService.initMap(1);
    this.en_base_logo = this.backendService.getImagePath();
    this.plotService.setElmLoc(0);
    this.start();
  }
}
