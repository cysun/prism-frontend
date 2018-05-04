import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CollegesComponent } from './colleges/colleges.component';
import { CommitteeComponent } from './committee/committee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentComponent } from './document/document.component';
import { ExternalUploadComponent } from './external-upload/external-upload.component';
import { GroupManagerComponent } from './group-manager/group-manager.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResourcesComponent } from './resources/resources.component';
import { ReviewComponent } from './review/review.component';
import { SettingsComponent } from './settings/settings.component';
import { TemplateManagerComponent } from './template-manager/template-manager.component';

import { PrivateComponent } from './layout/private/private.component';
import { PublicComponent } from './layout/public/public.component';

import { AuthGuard } from './login/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '',
    component: PublicComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'external-upload/:token', component: ExternalUploadComponent },
    ]
  },
  { path: '',
    component: PrivateComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'university-hierarchy', component: CollegesComponent },
      { path: 'groups', component: CommitteeComponent },
      { path: 'document/:id', component: DocumentComponent },
      { path: 'resources', component: ResourcesComponent },
      { path: 'review/:id', component: ReviewComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'templates', component: TemplateManagerComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
