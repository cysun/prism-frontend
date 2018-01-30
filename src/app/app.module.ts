<<<<<<< HEAD
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/components/button/button';
import { DataTableModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
=======
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/components/button/button';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce
import { FieldsetModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { MenubarModule, MenuModule, MenuItem } from 'primeng/primeng';
import { MessagesModule, MessageModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';

import { CollegesComponent } from './colleges/colleges.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MinutesComponent } from './minutes/minutes.component';
import { ResourcesComponent } from './resources/resources.component';
import { CommitteeComponent } from './committee/committee.component';
<<<<<<< HEAD
import {GroupManagerComponent} from './group-manager/group-manager.component';
=======
import { GroupManagerComponent } from './group-manager/group-manager.component';
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce
import { LoginComponent } from './login/login.component';

import { PublicComponent } from './layout/public/public.component';
import { PrivateComponent } from './layout/private/private.component';

import {GroupManagerService} from './group-manager/group-manager.service';
import {CollegesService} from './colleges/colleges.service';
<<<<<<< HEAD
import {DepartmentService} from './colleges/departments/department.service';
=======
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce

import { AuthInterceptor } from './login/auth.interceptor';
import { AuthGuard } from './login/auth.guard';
import { AuthService } from './login/auth.service';
<<<<<<< HEAD
import { DepartmentsComponent } from './colleges/departments/departments.component';
=======
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce

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
<<<<<<< HEAD
    HttpModule,
=======
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    ButtonModule,
    DataTableModule,
<<<<<<< HEAD
=======
    DialogModule,
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce
    FieldsetModule,
    InputTextModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    DialogModule,
    DropdownModule,
    DataGridModule,
    PanelModule,
    SplitButtonModule,
    TabViewModule,
    ToolbarModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    HttpClientModule,
<<<<<<< HEAD
    GroupManagerService,
    CollegesService,
    DepartmentService,
=======
    CollegesService,
    GroupManagerService,
>>>>>>> 9e6eea623d4c47ec131a5c5a4fe5147ca8dc39ce
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
