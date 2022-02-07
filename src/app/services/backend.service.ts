import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Resp } from './interfaces';
import { Resp } from './interfaces';

export interface paramList {
  Ser: number;
  Category: number;
  OptVal: number;
  Txt: string;
  cl: number;
}
@Injectable({
  providedIn: 'root',
})
export class BackendService {
  // basePath: string = 'http://localhost:8080/backendDEWS/scripts/';
  // imgPath: string = 'http://localhost:8080/backendDEWS/images/';
  basePath: string = 'http://52.63.82.10/backendDEWS/scripts/';
  imgPath: string = 'http://52.63.82.10/backendDEWS/images/';
  // basePath = 'assets/backendDEWS/scripts/';
  weather_api: string =
    'https://api.weatherapi.com/v1/current.json?key=2ef853bb23d244d7ae0130845210707&q=';
  constructor(private http: HttpClient) {}

  fetchDeplData(param: any): Observable<Resp[]> {
    console.log(param);
    return this.http.post<Resp[]>(
      this.basePath + 'backend_service.php',
      param,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
  //
  fetch_weather_info(CenKPI: string) {
    let api = this.weather_api + CenKPI;
    return this.http.get<Resp[]>(api);
  }
  //
  SubmitQuery(param: any): Observable<Resp[]> {
    console.log(param);
    return this.http.post<Resp[]>(
      this.basePath + 'backend_service.php',
      param,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
  //

  getImagePath() {
    return this.imgPath;
  }

  arrParam: paramList[] = [
    {
      Ser: 1,
      Category: 1,
      OptVal: 1,
      Txt: 'A',
      cl: 0,
    },
    {
      Ser: 2,
      Category: 1,
      OptVal: 2,
      Txt: 'H',
      cl: 0,
    },
    {
      Ser: 3,
      Category: 1,
      OptVal: 3,
      Txt: 'M',
      cl: 0,
    },
    {
      Ser: 4,
      Category: 2,
      OptVal: 1.0,
      Txt: '1.0 Mach',
      cl: 0,
    },
    {
      Ser: 5,
      Category: 2,
      OptVal: 1.5,
      Txt: '1.5 Mach',
      cl: 0,
    },
    {
      Ser: 6,
      Category: 2,
      OptVal: 2.0,
      Txt: '2.0 Mach',
      cl: 0,
    },
    {
      Ser: 7,
      Category: 2,
      OptVal: 2.5,
      Txt: '2.5 Mach',
      cl: 0,
    },
    {
      Ser: 8,
      Category: 2,
      OptVal: 3.0,
      Txt: '3.0 Mach',
      cl: 0,
    },
    {
      Ser: 9,
      Category: 3,
      OptVal: 1.0,
      Txt: '1000 M',
      cl: 0,
    },
    {
      Ser: 10,
      Category: 3,
      OptVal: 1.5,
      Txt: '1500 M',
      cl: 0,
    },
    {
      Ser: 10,
      Category: 3,
      OptVal: 2.0,
      Txt: '2000 M',
      cl: 0,
    },
    {
      Ser: 11,
      Category: 3,
      OptVal: 2.5,
      Txt: '2500 M',
      cl: 0,
    },
    {
      Ser: 12,
      Category: 3,
      OptVal: 3.0,
      Txt: '3000 M',
      cl: 0,
    },
    {
      Ser: 13,
      Category: 3,
      OptVal: 3.5,
      Txt: '3500 M',
      cl: 0,
    },
    {
      Ser: 14,
      Category: 3,
      OptVal: 4.0,
      Txt: '4000 M',
      cl: 0,
    },
    {
      Ser: 15,
      Category: 3,
      OptVal: 4.5,
      Txt: '4500 M',
      cl: 0,
    },
    {
      Ser: 16,
      Category: 3,
      OptVal: 5.0,
      Txt: '5000 M',
      cl: 0,
    },
    {
      Ser: 17,
      Category: 3,
      OptVal: 6.0,
      Txt: '6000 M',
      cl: 0,
    },
  ];

  get_arr_param() {
    return this.arrParam;
  }
}
