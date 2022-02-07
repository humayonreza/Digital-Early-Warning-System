import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightdataService } from './../../services/flightdata.service';
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  returnStr: number = 0;
  viewId: number = 0;
  param1: number = 0;
  param2: string = '';
  arrInfo: any[] = [];
  isMainAttkList: boolean = true;
  arrAirAttkSum: any[] = [];
  arrAirAttkGpbyDay: any[] = [];
  arrAttkListBydate: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public paramString: string,
    private fltDataSvc: FlightdataService
  ) {}

  setinfo() {
    this.arrInfo = this.paramString.split('-');
    this.viewId = this.arrInfo[0];
    this.param1 = this.arrInfo[1];
    this.param2 = this.arrInfo[2];
    console.log('Param2 @ modal ', this.param2);
    this.daywise_air_attacks(this.param1);
    this.air_attacks_summary(this.param1);
  }
  //

  air_attacks_summary(unitId: number): void {
    let data = {
      unitId,
      queryId: '21',
    };
    this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
      if (resp.Response != '401') {
        console.log('Air Attack Records @MODAL :', resp);
        this.arrAirAttkSum = resp;
      } else {
        console.log('No Data found ...');
      }
    });
  }
  //
  daywise_air_attacks(unitId: number): void {
    let data = {
      unitId,
      queryId: '22',
    };
    this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
      if (resp.Response != '401') {
        console.log('Day wise Air Attk @MODAL :', resp);
        this.arrAirAttkGpbyDay = resp;
      } else {
        console.log('No Data found (q:22) ...');
      }
    });
  }
  //

  get_attk_list_by_given_date(dte: string) {
    this.arrAttkListBydate = [];
    this.arrAttkListBydate = this.arrAirAttkSum.filter((m) => m.dateCO == dte);
    this.isMainAttkList = false;
  }
  //
  return_attk_list_gp_by_day(): void {
    this.isMainAttkList = true;
  }
  //
  sendConOrderSer2Plot(conOrderSer: number) {
    this.returnStr = conOrderSer;
  }
  //
  ngOnInit(): void {
    this.setinfo();
  }
}
