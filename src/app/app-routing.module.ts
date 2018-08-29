import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarComponent } from './components/calendar/calendar.component';
import { CollegesComponent } from './components/colleges/colleges.component';
import { CommitteeComponent } from './components/committee/committee.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocumentComponent } from './components/document/document.component';
import { ExternalUploadComponent } from './components/external-upload/external-upload.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ReviewComponent } from './components/review/review.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TemplateManagerComponent } from './components/template-manager/template-manager.component';

import { PrivateComponent } from './layout/private/private.component';
import { PublicComponent } from './layout/public/public.component';

import { AuthGuard } from './services/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'external-upload/:token', component: ExternalUploadComponent }
    ]
  },
  {
    path: '',
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
      { path: 'users', component: UsersComponent },
      { path: 'users/:id', component: UserComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
