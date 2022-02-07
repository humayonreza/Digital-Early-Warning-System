import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FlightdataService } from './../../../services/flightdata.service';
import { BackendService } from './../../../services/backend.service';
import { element } from 'protractor';
import { PlotService } from './../../../services/plot.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './../../modal/modal.component';
@Component({
  selector: 'app-adoc',
  templateUrl: './adoc.component.html',
  styleUrls: ['./adoc.component.css'],
})
export class AdocComponent implements OnInit {
  NavId: string = 'adoc';
  CenKPI: string = '';
  t: any;
  delay: number = 4000;
  acAOR: any[] = [];
  arrFetchedFltData: any[] = [];
  flightData: any[] = [];
  arrConOrder: any[] = [];
  arrAirStrikes: any[] = [];
  color: ThemePalette = 'primary';
  constructor(
    private plotService: PlotService,
    private fltDataSvc: FlightdataService,
    private backendService: BackendService,
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
    this.plotService.arrAcMarker = [];
    if (fltData) {
      for (let i = 0; i < fltData.length; i++) {
        let f_data = {
          Ser: fltData[i].Ser,
          acId: fltData[i].acId,
          lat: parseFloat(fltData[i].lat),
          lng: parseFloat(fltData[i].lng),
          heading: parseFloat(fltData[i].heading),
          height: parseFloat(fltData[i].height) * 1000,
          speed: fltData[i].speed,
          tac: fltData[i].numberAc,
          origin: parseInt(fltData[i].origin),
          isSelected: fltData[i].isSelected,
          isVisible: fltData[i].isVisible,
          senderId: parseInt(fltData[i].senderId),
        };
        this.generateConOrder(
          f_data.acId,
          f_data.origin,
          f_data.lat,
          f_data.lng
        );
        this.plotService.simulateFlightProfile(f_data);
      }
    } else {
      console.log('No Flight Data..@ Opr ');
    }
  }
  //
  generateConOrder(acId: number, orig: number, aclat: number, aclng: number) {
    for (let i = 0; i < this.plotService.arrAdunits.length; i++) {
      let dist = Math.floor(
        this.fltDataSvc.calculateDistance(
          aclat,
          aclng,
          this.plotService.arrAdunits[i].lat,
          this.plotService.arrAdunits[i].lng
        ) / 1000
      );
      this.processConOrder(
        acId,
        orig,
        dist,
        this.plotService.arrAdunits[i].elementId
      );
    }
  }
  //
  processConOrder(acId: number, orig: number, dist: number, uId: number) {
    if (dist <= 30) {
      let index = this.arrConOrder.findIndex((p) => p.uId == uId);
      let i = this.acAOR.findIndex((p) => p.acId == acId);
      if (i == -1) {
        // No attact inside ACAOR
        let info = {
          acId,
          orig,
        };
        this.acAOR.push(info);
        if (orig == 1) {
          this.arrConOrder[index].coId = 3;
          let data = {
            unitId: uId,
            conOrder: 3,
            acId: acId,
            queryId: '20',
          };
          this.insertControlOrder(data);
        } else {
          this.arrConOrder[index].coId = 2;
          let data = {
            unitId: uId,
            conOrder: 2,
            acId: acId,
            queryId: '20',
          };
          this.insertControlOrder(data);
        }
      } else {
        if (orig == 1) {
          this.arrConOrder[index].coId = 3;
        } else {
          if (this.arrConOrder[index].coId == 3) {
            this.arrConOrder[index].coId = 3;
          } else {
            this.arrConOrder[index].coId = 2;
          }
        }
      }
      // if (dist > 30 && dist < 40)
    } else {
      let index = this.arrConOrder.findIndex((p) => p.uId == uId);
      let x = this.acAOR.findIndex((p) => p.acId == acId);
      if (x == -1) {
        this.arrConOrder[index].coId = 1;
      } else {
        let k = this.acAOR.findIndex((p) => p.acId == acId);
        if (k != -1) {
          if (orig == 1) {
            if (this.arrConOrder[index].coId == 3) {
              this.arrConOrder[index].coId = 4;
            } else if (this.arrConOrder[index].coId == 4) {
              this.arrConOrder[index].coId = 1;
              this.acAOR.splice(k, 1);
            }
          } else {
            if (this.arrConOrder[index].coId == 2) {
              this.arrConOrder[index].coId = 2;
              this.acAOR.splice(k, 1);
            }
          }
        }
      }
    }
  }
  //
  insertControlOrder(data: any) {
    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      if (result && result.Response == '201') {
        console.log('Deploy Id', result);
        let index = this.arrConOrder.findIndex((p) => p.uId == data.unitId);
        this.arrConOrder[index].totalAirStrikes =
          parseInt(this.arrConOrder[index].totalAirStrikes) + 1;
      } else {
        console.log('No data...');
      }
    });
  }
  //
  get_air_strikes_by_unitId() {
    let data = {
      queryId: '23',
    };
    this.backendService.SubmitQuery(data).subscribe((result: any) => {
      if (result) {
        console.log('Air Strikes by Unit Id @ADOC', result);
        this.arrAirStrikes = result;
        this.initConOrder();
      } else {
        console.log('No data...');
      }
    });
  }
  //
  initConOrder() {
    this.plotService.arrAdunits.sort((a, b) =>
      a.elementId > b.elementId ? 1 : -1
    );
    let c = 1;
    for (let i = 0; i < this.plotService.arrAdunits.length; i++) {
      let data = {
        Ser: c,
        uId: this.plotService.arrAdunits[i].elementId,
        uName: this.plotService.arrAdunits[i].elementName,
        coId: 1,
        totalAirStrikes: this.set_air_strikes_by_unitId(
          this.plotService.arrAdunits[i].elementId
        ),
      };
      c = c + 1;
      this.arrConOrder.push(data);
      this.arrConOrder.sort((a, b) => (a.uId > b.uId ? 1 : -1));
    }
  }
  //
  set_air_strikes_by_unitId(uId: number) {
    console.log('Check : ', uId);
    let index = this.arrAirStrikes.findIndex((p) => p.elementId == uId);
    if (index == -1) {
      return 0;
    } else {
      return this.arrAirStrikes[index].totalAirStrikes;
    }
  }
  //
  openModal(uid: number, uname: string): void {
    let viewId = 1;
    let param1 = uid;
    let param2 = uname;

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '450px',
      height: '500px',
      data: viewId + '-' + param1 + '-' + param2,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }
  //
  ngOnInit(): void {
    this.plotService.initMap(1);
    this.plotService.setElmLoc(0);
    this.get_air_strikes_by_unitId();
    this.start();
  }
}
