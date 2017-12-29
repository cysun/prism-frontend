import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CollegesComponent} from './colleges/colleges.component';

import {AccordionModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/components/button/button';
import {MenubarModule, MenuModule, MenuItem} from 'primeng/primeng';
import {MessagesModule, MessageModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';

import {DashboardComponent} from './dashboard/dashboard.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SettingsComponent} from './settings/settings.component';
import {CalendarComponent} from './calendar/calendar.component';
import {MinutesComponent} from './minutes/minutes.component';
import {ResourcesComponent} from './resources/resources.component';
import {CommitteeComponent} from './committee/committee.component';
import { LoginComponent } from './login/login.component';

// import { PanelModule } from 'primeng/components/panel/panel';
// import { RadioButtonModule } from 'primeng/components/radioButton/radioButton';

@NgModule({
  declarations: [
    AppComponent,
    CollegesComponent,
    DashboardComponent,
    PageNotFoundComponent,
    SettingsComponent,
    CalendarComponent,
    MinutesComponent,
    ResourcesComponent,
    CommitteeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AccordionModule,
    ButtonModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    TabViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
