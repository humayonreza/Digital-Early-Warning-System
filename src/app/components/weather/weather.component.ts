import { Component, OnInit, Input } from '@angular/core';
import { start } from 'repl';
import { BackendService } from './../../services/backend.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent implements OnInit {
  constructor(private backendService: BackendService) {}
  t: any;
  delay: number = 5000;
  arrWeatherInfo: any[] = [];
  txtWeather: string = '';
  srcIcon: string = '';
  humidity: number = 0;
  wind_degree: number = 0;
  temp_c: number = 0;
  wind_kph: number = 0;
  vis_km: number = 0;
  @Input() CenKPI: string = '';
  start(CenKPI: string) {
    // let data = this.backendService.fetch_weather_info();
    this.backendService.fetch_weather_info(CenKPI).subscribe((resp: any) => {
      this.txtWeather = resp.current.condition.text;
      this.srcIcon = resp.current.condition.icon;
      this.humidity = resp.current.humidity;
      this.wind_degree = resp.current.wind_degree;
      this.temp_c = resp.current.temp_c;
      this.wind_kph = resp.current.wind_kph;
      this.vis_km = resp.current.vis_km;
      console.log('Weather Arr @Weather : ', resp);
    });
    // this.t = setTimeout(() => {
    //   // let data = {
    //   //   queryId: '14',
    //   // };
    //   // this.arrFetchedFltData = [];
    //   // this.fltDataSvc.SubmitQuery(data).subscribe((resp: any) => {
    //   //   if (resp.Response != '401') {
    //   //     this.arrFetchedFltData = resp;
    //   //     this.setFlightData(this.arrFetchedFltData);
    //   //   } else {
    //   //     console.log('No Flight Data ...');
    //   //   }
    //   // });
    //   this.start();
    // }, this.delay);
  }
  ngOnInit(): void {
    if (this.CenKPI) this.start(this.CenKPI);
    console.log('Cen KPI @Weather : ', this.CenKPI);
  }
}
