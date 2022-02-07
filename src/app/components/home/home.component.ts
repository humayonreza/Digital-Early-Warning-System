import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  lat = -35.23548;
  lng = 148.321864;
  constructor() {}

  ngOnInit(): void {}
}
