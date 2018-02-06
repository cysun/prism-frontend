import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

import { AutoCompleteModule } from 'primeng/primeng';

import { CollegesComponent } from './colleges/colleges.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MinutesComponent } from './minutes/minutes.component';
import { ResourcesComponent } from './resources/resources.component';
import { CommitteeComponent } from './committee/committee.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { LoginComponent } from './login/login.component';

import { PublicComponent } from './layout/public/public.component';
import { PrivateComponent } from './layout/private/private.component';

import {GroupManagerService} from './group-manager/group-manager.service';
import {CollegesService} from './colleges/colleges.service';
import {DepartmentService} from './colleges/departments/department.service';

import { AuthInterceptor } from './login/auth.interceptor';
import { AuthGuard } from './login/auth.guard';
import { AuthService } from './login/auth.service';
import { DepartmentsComponent } from './colleges/departments/departments.component';

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
    GroupManagerComponent,
    LoginComponent,
    PublicComponent,
    PrivateComponent,
    DepartmentsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AutoCompleteModule,
    NgbModule.forRoot(),
    NgbDropdownModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    HttpClientModule,
    GroupManagerService,
    CollegesService,
    DepartmentService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
