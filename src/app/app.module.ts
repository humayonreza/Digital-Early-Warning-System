import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
//
import { EnconComponent } from './components/simulator/encon/encon.component';
import { AdcpComponent } from './components/airdef/adcp/adcp.component';
import { AdocComponent } from './components/airdef/adoc/adoc.component';
import { DepladcpComponent } from './components/airdef/depladcp/depladcp.component';
import { DeplenairbaseComponent } from './components/simulator/deplenairbase/deplenairbase.component';
import { CreateprofileComponent } from './components/simulator/createprofile/createprofile.component';
import { StartprofileComponent } from './components/simulator/startprofile/startprofile.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { Wl1Component } from './components/simulator/launchAttk/airWL/wl1/wl1.component';
import { Wl2Component } from './components/simulator/launchAttk/airWL/wl2/wl2.component';
import { Wl3Component } from './components/simulator/launchAttk/airWL/wl3/wl3.component';
import { Dl1Component } from './components/simulator/launchAttk/airDL/dl1/dl1.component';
import { Dl2Component } from './components/simulator/launchAttk/airDL/dl2/dl2.component';
import { Dl3Component } from './components/simulator/launchAttk/airDL/dl3/dl3.component';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Radarop1Component } from './components/airdef/radaropr/radarop1/radarop1.component';
import { SpeechSynthesisModule } from '@kamiazya/ngx-speech-synthesis';
import { ModalComponent } from './components/modal/modal.component';
import { Wl4Component } from './components/simulator/launchAttk/airWL/wl4/wl4.component';
import { Wl5Component } from './components/simulator/launchAttk/airWL/wl5/wl5.component';
import { Wl6Component } from './components/simulator/launchAttk/airWL/wl6/wl6.component';
import { Wl7Component } from './components/simulator/launchAttk/airWL/wl7/wl7.component';
import { Wl8Component } from './components/simulator/launchAttk/airWL/wl8/wl8.component';
import { OprradarComponent } from './components/airdef/radaropr/oprradar/oprradar.component';
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EnconComponent,
    AdcpComponent,
    AdocComponent,
    DepladcpComponent,
    DeplenairbaseComponent,
    CreateprofileComponent,
    StartprofileComponent,
    LoginComponent,
    Wl1Component,
    Wl2Component,
    Wl3Component,
    Dl1Component,
    Dl2Component,
    Dl3Component,
    NavbarComponent,
    Radarop1Component,
    ModalComponent,
    Wl4Component,
    Wl5Component,
    Wl6Component,
    Wl7Component,
    Wl8Component,
    OprradarComponent,
    WeatherComponent,
  ],
  entryComponents: [ModalComponent],
  imports: [
    MatDialogModule,
    SpeechSynthesisModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
    MatRadioModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAfg8zhSwZoTzVK_QVt37pANL-KSOqE9mA',
    }),
    SpeechSynthesisModule.forRoot({
      lang: 'en',
      volume: 1.0,
      pitch: 1.1,
      rate: 1.1,
    }),
    RouterModule.forRoot(
      [
        {
          path: '',
          component: LoginComponent,
        },
        {
          path: 'encon',
          component: EnconComponent,
        },
        {
          path: 'adcp',
          component: AdcpComponent,
        },
        {
          path: 'adoc',
          component: AdocComponent,
        },

        {
          path: 'depl-adcp',
          component: DepladcpComponent,
        },
        {
          path: 'depl-airbases',
          component: DeplenairbaseComponent,
        },
        {
          path: 'create-profile',
          component: CreateprofileComponent,
        },
        {
          path: 'opr-radar',
          component: OprradarComponent,
        },
      ],
      { onSameUrlNavigation: 'reload' }
    ),
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
