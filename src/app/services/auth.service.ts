import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resp } from './interfaces';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // basePath: string = 'http://localhost:8080/backendDEWS/scripts/';
  basePath: string = 'http://52.63.82.10/backendDEWS/scripts/';
  // basePath = 'assets/backendDEWS/scripts/';
  constructor(private http: HttpClient, private router: Router) {}

  authUser(cred: any): Observable<Resp[]> {
    console.log(cred);
    return this.http.post<Resp[]>(this.basePath + 'auth.php', cred, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  LoggedUserData(param: number) {
    let token = localStorage.getItem('token');
    if (!token) {
      return null;
    } else {
      let decodedString = atob(token);
      let str = JSON.parse(decodedString);
      // console.log("Your Full Name : ", str);
      let resp =
        param == 1
          ? str.userId
          : param == 2
          ? str.category
          : param == 3
          ? str.isIndependent
          : param == 4
          ? str.pid
          : param == 5
          ? str.unitId
          : param == 6
          ? str.ElementName
          : null;
      return resp;
      // isIndependent
    }
  }

  logout() {
    console.log('logout success...');
    // localStorage.removeItem('token');
    localStorage.removeItem('pageTitle');
    this.router.navigate(['/']);
  }
  setupMap() {
    let data = {
      lat: '23', //-35.23548;
      lng: '91', //148.321864;
      zoom: '6',
    };
    return data;
  }
}
