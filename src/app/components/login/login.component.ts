import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { BackendService } from './../../services/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  UserId: string = '';
  Password: string = '';
  invalidLogin: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private backendService: BackendService
  ) {}
  login(cred: any) {
    console.log(cred);
    this.authService.authUser(cred).subscribe((data: any) => {
      let mySplitResult: any = data.split('.');
      let loginData = mySplitResult[1];
      localStorage.setItem('token', loginData);
      console.log('Response :', loginData);
      let category = this.authService.LoggedUserData(2);
      if (data) {
        let param = {
          queryId: category == 6 ? '29' : '15',
        };
        this.backendService.fetchDeplData(param).subscribe((data: any) => {
          localStorage.setItem('arrDeplElm', JSON.stringify(data));
          this.invalidLogin = false;
          category == 1
            ? this.router.navigate(['/'])
            : category == 2 || category == 4
            ? this.router.navigate(['/adcp'])
            : category == 3
            ? this.router.navigate(['/encon'])
            : category == 5
            ? this.router.navigate(['/adoc'])
            : category == 6
            ? this.router.navigate(['/opr-radar'])
            : null;
        });
      } else this.invalidLogin = true;
    });
  }
  login_logo: string = '';
  ngOnInit(): void {
    this.login_logo = this.backendService.getImagePath();
  }
}
