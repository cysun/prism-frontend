import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterPipe } from './shared/filter.pipe';
import { Globals } from './shared/app.global';
import { ReversePipe } from './shared/pipe_manipulation';
import { SortPipe } from './shared/pipe_manipulation';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';

import { CollegesComponent } from './components/colleges/colleges.component';
import { CommitteeComponent } from './components/committee/committee.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepartmentComponent} from './components/departments/department.component';
import { DocumentComponent } from './components/document/document.component';
import { ExternalUploadComponent } from './components/external-upload/external-upload.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ReviewComponent } from './components/review/review.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { GroupManagerComponent } from './components/group-manager/group-manager.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { TemplateManagerComponent } from './components/template-manager/template-manager.component';
import {UsersComponent} from './components/users/users.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectizeModule } from 'ng-selectize';

import { LoginComponent } from './components/login/login.component';
import { PublicComponent } from './layout/public/public.component';
import { PrivateComponent } from './layout/private/private.component';

import { AuthInterceptor } from './services/auth.interceptor';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

import { CalendarService } from './services/calendar.service';
import { CollegesService } from './services/colleges.service';
import { DashboardService } from './services/dashboard.service';
import { DepartmentService } from './services/department.service';
import { DocumentService } from './services/document.service';
import { ExternalUploadService } from './services/external-upload.service';
import { GroupManagerService } from './services/group-manager.service';
import { ProgramService } from './services/program.service';
import { ResourceService } from './services/resource.service';
import { ReviewService } from './services/review.service';
import { SettingsService } from './services/settings.service';
import { SharedService } from './shared/shared.service';
import { TemplateManagerService } from './services/template-manager.service';
import { UserService } from './services/user.service';
import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user-form/user-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CollegesComponent,
    CommitteeComponent,
    DashboardComponent,
    DepartmentComponent,
    DocumentComponent,
    ExternalUploadComponent,
    GroupManagerComponent,
    LoginComponent,
    PageNotFoundComponent,
    ProgramsComponent,
    ResourcesComponent,
    ReviewComponent,
    ReviewListComponent,
    SettingsComponent,
    TemplateManagerComponent,
    UsersComponent,
    UserComponent,
    UserFormComponent,
    UserSelectorComponent,
    PrivateComponent,
    PublicComponent,
    FilterPipe,
    ReversePipe,
    SortPipe,
  ],
  imports: [
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    NgSelectizeModule,
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
    CalendarService,
    CollegesService,
    DashboardService,
    DocumentService,
    DepartmentService,
    ExternalUploadService,
    Globals,
    GroupManagerService,
    ProgramService,
    ResourceService,
    ReviewService,
    SettingsService,
    SharedService,
    TemplateManagerService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: function(router: Router) {
        return new AuthInterceptor(router);
      },
      multi: true,
      deps: [Router]
    },
    { provide: 'Window', useValue: window },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
