import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReversePipe } from './../pipe_manipulation';

import { CollegesComponent } from './colleges/colleges.component';
import { CommitteeComponent } from './committee/committee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MinutesComponent } from './minutes/minutes.component';
import { ResourcesComponent } from './resources/resources.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from './login/login.component';
import { PublicComponent } from './layout/public/public.component';
import { PrivateComponent } from './layout/private/private.component';
import { DocumentComponent } from './document/document.component';

import { AuthInterceptor } from './login/auth.interceptor';
import { AuthGuard } from './login/auth.guard';
import { AuthService } from './login/auth.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DocumentService } from './document/document.service';
import { GroupManagerService } from './group-manager/group-manager.service';
import { SettingsService } from './settings/settings.service';
import { Globals } from './shared/app.global';


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CollegesComponent,
    CommitteeComponent,
    DashboardComponent,
    DocumentComponent,
    GroupManagerComponent,
    LoginComponent,
    MinutesComponent,
    PageNotFoundComponent,
    PrivateComponent,
    PublicComponent,
    ResourcesComponent,
    SettingsComponent,
    ReversePipe,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    HttpClientModule,
    DashboardService,
    DocumentService,
    Globals,
    GroupManagerService,
    SettingsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
