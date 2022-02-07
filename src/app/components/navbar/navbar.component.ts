import { Component, OnInit, Input } from '@angular/core';
import { FlightdataService } from './../../services/flightdata.service';
import { BackendService } from './../../services/backend.service';
import { AuthService } from './../../services/auth.service';
export interface linkList {
  Ser: number;
  Path: string;
  RName: string;
  RIcon: string;
  GpId: string;
  ActiveCl: number;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() NavId: string = '';
  isReset: boolean = false;
  en_base_logo: string = '';
  logo: string = '';
  arrNavLink: any[] = [];
  constructor(
    private authService: AuthService,
    private fltDataSvc: FlightdataService,
    private backendService: BackendService
  ) {}
  arrLinks: linkList[] = [
    {
      Ser: 1,
      Path: '/encon',
      RName: 'ENCON',
      RIcon: 'gamepad',
      GpId: 'encon',
      ActiveCl: 0,
    },
    {
      Ser: 2,
      Path: '/depl-airbases',
      RName: 'DEPLOY',
      RIcon: 'pin_drop',
      GpId: 'encon',
      ActiveCl: 0,
    },
    {
      Ser: 3,
      Path: '/create-profile',
      RName: 'CREATE',
      RIcon: 'add_to_queue',
      GpId: 'encon',
      ActiveCl: 0,
    },
    {
      Ser: 4,
      Path: '/adoc',
      RName: 'ADOC',
      RIcon: 'compass_calibration',
      GpId: 'adoc',
      ActiveCl: 0,
    },
    {
      Ser: 5,
      Path: '/adoc',
      RName: 'SET RADAR',
      RIcon: 'network_wifi',
      GpId: 'adoc',
      ActiveCl: 0,
    },

    {
      Ser: 6,
      Path: '/adcp',
      RName: 'ADCP',
      RIcon: 'compass_calibration',
      GpId: 'adcp',
      ActiveCl: 0,
    },
    {
      Ser: 7,
      Path: '/depl-adcp',
      RName: 'DEPLOY',
      RIcon: 'pin_drop',
      GpId: 'adcp',
      ActiveCl: 0,
    },
  ];

  resetFlightData() {
    let data = {
      resetId: 5232,
      queryId: 10,
    };
    this.fltDataSvc.SubmitQuery(data).subscribe((result) => {
      // console.log("Reset Me : ", result);
      // this.flightData = [];
    });
  }
  //
  signout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.en_base_logo = this.backendService.getImagePath();
    this.arrNavLink = this.arrLinks.filter((m) => m.GpId == this.NavId);
    this.isReset = this.NavId == 'encon' ? true : false;
    this.logo =
      this.NavId == 'encon'
        ? this.en_base_logo + 'logo/encon.png'
        : this.en_base_logo + 'logo/adcp.png';
    console.log('Arr Nav : ', this.arrNavLink);
  }
}
