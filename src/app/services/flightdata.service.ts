import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resp, RespFID } from './interfaces';

export interface setupData {
  Ser: number;
  Country: string;
  lat: number;
  lng: number;
  zoom: number;
}
@Injectable({
  providedIn: 'root',
})
export class FlightdataService {
  // basePath: string = 'http://localhost:8080/backendDEWS/scripts/';
  basePath: string = 'http://52.63.82.10/backendDEWS/scripts/';
  // basePath = 'assets/backendDEWS/scripts/';
  attkProfileDetails: any[] = [];
  data: any;
  labelXY: any;
  list: any[] = [];
  arrFlightData: any[] = [];
  arrGenFltData: any[] = [];
  constructor(private http: HttpClient) {}

  _setupData: setupData[] = [
    {
      Ser: 1,
      Country: 'Bangladesh',
      lat: 23.4,
      lng: 91,
      zoom: 6.8,
    },
  ];

  returnMapSetupData() {
    return this._setupData;
  }

  SubmitQuery(param: any): Observable<Resp[]> {
    // console.log(param);
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

  getDaywiseMaxFlighId(param: any) {
    // console.log(param);
    return this.http.post<RespFID>(
      this.basePath + 'backend_service.php',
      param,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  processFlightData(data: any) {
    let index = this.arrGenFltData.findIndex((p) => p.acId == data.acId);
    if (index == -1) {
      this.arrGenFltData.push(data);
    } else {
      this.arrGenFltData[index].speed = data.speed;
      this.arrGenFltData[index].height = data.height;
      this.arrGenFltData[index].heading = data.heading;
      this.arrGenFltData[index].lat = data.lat;
      this.arrGenFltData[index].lng = data.lng;
      this.arrGenFltData[index].isVisible = data.isVisible;
    }
    console.log('Flight Data From Base : ', this.arrGenFltData);
  }

  getArrGenFltData() {
    return this.arrGenFltData;
  }

  // =================================================

  toRad(n: number) {
    return (n * Math.PI) / 180;
  }
  toDeg(n: number) {
    return (n * 180) / Math.PI;
  }

  destinationPoint(lat1: number, lon1: number, brng: number, dist: number) {
    var a = 6378137,
      b = 6356752.3142,
      f = 1 / 298.257223563, // WGS-84 ellipsiod
      s = dist,
      alpha1 = this.toRad(brng),
      sinAlpha1 = Math.sin(alpha1),
      cosAlpha1 = Math.cos(alpha1),
      tanU1 = (1 - f) * Math.tan(this.toRad(lat1)),
      cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1),
      sinU1 = tanU1 * cosU1,
      sigma1 = Math.atan2(tanU1, cosAlpha1),
      sinAlpha = cosU1 * sinAlpha1,
      cosSqAlpha = 1 - sinAlpha * sinAlpha,
      uSq = (cosSqAlpha * (a * a - b * b)) / (b * b),
      A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
      B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
      sigma = s / (b * A),
      sigmaP = 2 * Math.PI;
    while (Math.abs(sigma - sigmaP) > 1e-12) {
      var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
        sinSigma = Math.sin(sigma),
        cosSigma = Math.cos(sigma),
        deltaSigma =
          B *
          sinSigma *
          (cos2SigmaM +
            (B / 4) *
              (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
                (B / 6) *
                  cos2SigmaM *
                  (-3 + 4 * sinSigma * sinSigma) *
                  (-3 + 4 * cos2SigmaM * cos2SigmaM)));
      sigmaP = sigma;
      sigma = s / (b * A) + deltaSigma;
    }
    sinSigma = Math.sin(sigma);
    cosSigma = Math.cos(sigma);
    cos2SigmaM = Math.cos(2 * sigma1 + sigma);
    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
      lat2 = Math.atan2(
        sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
        (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
      ),
      lambda = Math.atan2(
        sinSigma * sinAlpha1,
        cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
      ),
      C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
      L =
        lambda -
        (1 - C) *
          f *
          sinAlpha *
          (sigma +
            C *
              sinSigma *
              (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
      revAz = Math.atan2(sinAlpha, -tmp); // final bearing
    let x = this.toDeg(lat2);
    let y = lon1 + this.toDeg(L);

    let z = x + '-' + y;
    return z;
  }

  // ==================================================

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    // return x + y;
    let radlat1 = (Math.PI * lat1) / 180;
    let radlat2 = (Math.PI * lat2) / 180;
    let theta = lng1 - lng2;
    let dist;

    let radtheta = (Math.PI * theta) / 180;
    dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = (dist * 60 * 1.1515 * 1.609344 * 1000).toFixed(2);

    return parseFloat(dist);
  }

  calculateAngle(lat1: number, lng1: number, lat2: number, lng2: number) {
    let y =
      Math.sin((lng2 - lng1) * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180));
    let x =
      Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
      Math.sin(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.cos((lng2 - lng1) * (Math.PI / 180));
    let brng = Math.atan2(y, x);
    brng = brng * (180 / Math.PI);
    brng = Math.floor(brng);
    if (brng < 0) {
      brng = 360 + brng;
    }

    return brng;
  }
  // .post(this.url_attkProfileIndex, JSON.stringify(data))
  getAttkProfileIndexList(data: any) {
    // this.attkProfileDetails = [];
    // // let data = { id: id };
    // return this.http
    //   .post(this.baseUrl + 'backend_service.php', JSON.stringify(data))
    //   .map((response) => {
    //     this.list = response.json();
    //     return this.list;
    //   });
  }

  getAttkProfileDetails(data: any) {
    this.attkProfileDetails = [];
    // let data = { id: id };
    // console.log(data);
    // return this.http
    //   .post(this.baseUrl + 'backend_service.php', JSON.stringify(data))
    //   .map((response) => {
    //     this.attkProfileDetails = response.json();
    //     return this.attkProfileDetails;
    //   });
  }

  removeAttkDATA(data: any) {
    // return this.http
    //   .post(this.baseUrl + 'backend_service.php', JSON.stringify(data))
    //   .map((response) => {
    //     return response.json();
    //   });
  }

  submitFlightData(data: any) {
    // console.log('Flight Data : ', data);
    // return this.http
    //   .post(this.baseUrl + 'backend_service.php', JSON.stringify(data))
    //   .map((response) => {
    //     return response.json();
    //   });
  }

  getFlightData() {
    // this.arrFlightData = [];
    // return this.http.get(this.baseUrl + 'getFlightData.php').map((response) => {
    //   // console.log("My Flight Data Received: ", response.json());
    //   if (response.json() && response.json() != '401') {
    //     this.arrFlightData = response.json();
    //     return this.arrFlightData;
    //   } else return false;
    // });
  }

  resetFlightData(data: any) {
    // return this.http
    //   .post(this.baseUrl + 'backend_service.php', JSON.stringify(data))
    //   .map((response) => {
    //     return response.json();
    //   });
  }
  //

  projFlightPosn(heading: number, lat: number, lng: number) {
    if (heading >= 0 && heading < 5) {
      this.data = {
        lat: lat + 0.08,
        lng: lng - 0.075,
        // lat: lat + 0.08,
        // lng: lng - 0.075,
      };
    } else if (heading >= 5 && heading < 10) {
      this.data = {
        lat: lat + 0.085,
        lng: lng - 0.065,
      };
    } else if (heading >= 10 && heading < 15) {
      this.data = {
        lat: lat + 0.088,
        lng: lng - 0.045,
      };
    } else if (heading >= 15 && heading < 20) {
      this.data = {
        lat: lat + 0.085,
        lng: lng - 0.045,
      };
    } else if (heading >= 20 && heading < 25) {
      this.data = {
        lat: lat + 0.089,
        lng: lng - 0.048,
      };
    } else if (heading >= 25 && heading < 30) {
      this.data = {
        lat: lat + 0.095,
        lng: lng - 0.035,
      };
    } else if (heading >= 30 && heading < 35) {
      this.data = {
        lat: lat + 0.101,
        lng: lng - 0.027,
      };
    } else if (heading >= 35 && heading < 40) {
      this.data = {
        lat: lat + 0.101,
        lng: lng - 0.018,
      };
    } else if (heading >= 40 && heading < 45) {
      this.data = {
        lat: lat + 0.1,
        lng: lng - 0.01,
      };
    } else if (heading >= 45 && heading < 50) {
      this.data = {
        lat: lat + 0.1,
        lng: lng + 0.02,
      };
    } else if (heading >= 50 && heading < 55) {
      this.data = {
        lat: lat + 0.1,
        lng: lng + 0.02,
      };
    } else if (heading >= 55 && heading < 60) {
      this.data = {
        lat: lat + 0.09,
        lng: lng + 0.025,
      };
    } else if (heading >= 60 && heading < 65) {
      this.data = {
        lat: lat + 0.09,
        lng: lng + 0.04,
      };
    } else if (heading >= 65 && heading < 70) {
      this.data = {
        lat: lat + 0.09,
        lng: lng + 0.033,
      };
    } else if (heading >= 70 && heading < 75) {
      this.data = {
        lat: lat + 0.08,
        lng: lng + 0.045,
      };
    } else if (heading >= 75 && heading < 80) {
      this.data = {
        lat: lat + 0.082,
        lng: lng + 0.055,
      };
    } else if (heading >= 80 && heading < 85) {
      this.data = {
        lat: lat + 0.08,
        lng: lng + 0.064,
      };
    } else if (heading >= 85 && heading < 90) {
      this.data = {
        lat: lat + 0.078,
        lng: lng + 0.071,
      };
    } else if (heading >= 90 && heading < 95) {
      this.data = {
        lat: lat + 0.065,
        lng: lng + 0.08,
      };
    } else if (heading >= 95 && heading < 100) {
      this.data = {
        lat: lat + 0.067,
        lng: lng + 0.082,
      };
    } else if (heading >= 100 && heading < 105) {
      this.data = {
        lat: lat + 0.055,
        lng: lng + 0.091,
      };
    } else if (heading >= 105 && heading < 110) {
      this.data = {
        lat: lat + 0.045,
        lng: lng + 0.098,
      };
    } else if (heading >= 110 && heading < 115) {
      this.data = {
        lat: lat + 0.041,
        lng: lng + 0.102,
      };
    } else if (heading >= 115 && heading < 120) {
      this.data = {
        lat: lat + 0.035,
        lng: lng + 0.102,
      };
    } else if (heading >= 120 && heading < 125) {
      this.data = {
        lat: lat + 0.025,
        lng: lng + 0.108,
      };
    } else if (heading >= 125 && heading < 130) {
      this.data = {
        lat: lat + 0.006,
        lng: lng + 0.104,
      };
    } else if (heading >= 130 && heading < 135) {
      this.data = {
        lat: lat + 0.006,
        lng: lng + 0.103,
      };
    } else if (heading >= 135 && heading < 140) {
      this.data = {
        lat: lat + 0.007,
        lng: lng + 0.103,
      };
    } else if (heading >= 140 && heading < 145) {
      this.data = {
        lat: lat - 0.003,
        lng: lng + 0.105,
      };
    } else if (heading >= 145 && heading < 150) {
      this.data = {
        lat: lat - 0.015,
        lng: lng + 0.103,
      };
    } else if (heading >= 150 && heading < 155) {
      this.data = {
        lat: lat - 0.019,
        lng: lng + 0.102,
      };
    } else if (heading >= 155 && heading < 160) {
      this.data = {
        lat: lat - 0.026,
        lng: lng + 0.098,
      };
    } else if (heading >= 160 && heading < 165) {
      this.data = {
        lat: lat - 0.035,
        lng: lng + 0.097,
      };
    } else if (heading >= 165 && heading < 170) {
      this.data = {
        lat: lat - 0.043,
        lng: lng + 0.097,
      };
    } else if (heading >= 170 && heading < 175) {
      this.data = {
        lat: lat - 0.053,
        lng: lng + 0.09,
      };
    } else if (heading >= 175 && heading < 180) {
      this.data = {
        lat: lat - 0.058,
        lng: lng + 0.071,
      };
    } else if (heading >= 180 && heading < 185) {
      this.data = {
        lat: lat - 0.065,
        lng: lng + 0.07,
      };
    } else if (heading >= 185 && heading < 190) {
      this.data = {
        lat: lat - 0.075,
        lng: lng + 0.07,
      };
    } else if (heading >= 190 && heading < 195) {
      this.data = {
        lat: lat - 0.075,
        lng: lng + 0.065,
      };
    } else if (heading >= 195 && heading < 200) {
      this.data = {
        lat: lat - 0.085,
        lng: lng + 0.063,
      };
    } else if (heading >= 200 && heading < 205) {
      this.data = {
        lat: lat - 0.091,
        lng: lng + 0.051,
      };
    } else if (heading >= 205 && heading < 210) {
      this.data = {
        lat: lat - 0.101,
        lng: lng + 0.041,
      };
    } else if (heading >= 210 && heading < 215) {
      this.data = {
        lat: lat - 0.101,
        lng: lng + 0.031,
      };
    } else if (heading >= 215 && heading < 220) {
      this.data = {
        lat: lat - 0.103,
        lng: lng + 0.023,
      };
    } else if (heading >= 220 && heading < 225) {
      this.data = {
        lat: lat - 0.103,
        lng: lng + 0.02,
      };
    } else if (heading >= 225 && heading < 230) {
      this.data = {
        lat: lat - 0.102,
        lng: lng + 0.01,
      };
    } else if (heading >= 230 && heading < 235) {
      this.data = {
        lat: lat - 0.1,
        lng: lng - 0.01,
      };
    } else if (heading >= 235 && heading < 240) {
      this.data = {
        lat: lat - 0.1,
        lng: lng - 0.02,
      };
    } else if (heading >= 240 && heading < 245) {
      this.data = {
        lat: lat - 0.1,
        lng: lng - 0.03,
      };
    } else if (heading >= 245 && heading < 250) {
      this.data = {
        lat: lat - 0.1,
        lng: lng - 0.04,
      };
    } else if (heading >= 250 && heading < 255) {
      this.data = {
        lat: lat - 0.09,
        lng: lng - 0.04,
      };
    } else if (heading >= 255 && heading < 260) {
      this.data = {
        lat: lat - 0.09,
        lng: lng - 0.06,
      };
    } else if (heading >= 260 && heading < 265) {
      this.data = {
        lat: lat - 0.082,
        lng: lng - 0.065,
      };
    } else if (heading >= 265 && heading < 270) {
      this.data = {
        lat: lat - 0.082,
        lng: lng - 0.07,
      };
    } else if (heading >= 270 && heading < 275) {
      this.data = {
        lat: lat - 0.07,
        lng: lng - 0.07,
      };
    } else if (heading >= 275 && heading < 280) {
      this.data = {
        lat: lat - 0.063,
        lng: lng - 0.08,
      };
    } else if (heading >= 280 && heading < 285) {
      this.data = {
        lat: lat - 0.06,
        lng: lng - 0.085,
      };
    } else if (heading >= 285 && heading < 290) {
      this.data = {
        lat: lat - 0.045,
        lng: lng - 0.09,
      };
    } else if (heading >= 290 && heading < 295) {
      this.data = {
        lat: lat - 0.04,
        lng: lng - 0.09,
      };
    } else if (heading >= 295 && heading < 300) {
      this.data = {
        lat: lat - 0.031,
        lng: lng - 0.101,
      };
    } else if (heading >= 300 && heading < 305) {
      this.data = {
        lat: lat - 0.025,
        lng: lng - 0.101,
      };
    } else if (heading >= 305 && heading < 310) {
      this.data = {
        lat: lat - 0.015,
        lng: lng - 0.101,
      };
    } else if (heading >= 310 && heading < 315) {
      this.data = {
        lat: lat - 0.011,
        lng: lng - 0.101,
      };
    } else if (heading >= 315 && heading < 320) {
      this.data = {
        lat: lat,
        lng: lng - 0.101,
      };
    } else if (heading >= 320 && heading < 325) {
      this.data = {
        lat: lat + 0.008,
        lng: lng - 0.101,
      };
    } else if (heading >= 325 && heading < 330) {
      this.data = {
        lat: lat + 0.018,
        lng: lng - 0.104,
      };
    } else if (heading >= 330 && heading < 335) {
      this.data = {
        lat: lat + 0.021,
        lng: lng - 0.104,
      };
    } else if (heading >= 335 && heading < 340) {
      this.data = {
        lat: lat + 0.03,
        lng: lng - 0.1,
      };
    } else if (heading >= 340 && heading < 345) {
      this.data = {
        lat: lat + 0.04,
        lng: lng - 0.09,
      };
    } else if (heading >= 345 && heading < 350) {
      this.data = {
        lat: lat + 0.055,
        lng: lng - 0.09,
      };
    } else if (heading >= 350 && heading < 355) {
      this.data = {
        lat: lat + 0.065,
        lng: lng - 0.085,
      };
    } else if (heading >= 355 && heading < 360) {
      this.data = {
        lat: lat + 0.068,
        lng: lng - 0.082,
      };
    }
    return this.data;
  }
}
