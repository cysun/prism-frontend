import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CollegesComponent } from './colleges/colleges.component';
import { CommitteeComponent } from './committee/committee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentComponent } from './document/document.component';
import { LoginComponent } from './login/login.component';
import { MinutesComponent } from './minutes/minutes.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ResourcesComponent } from './resources/resources.component';
import { SettingsComponent } from './settings/settings.component';

import { PublicComponent } from './layout/public/public.component';
import { PrivateComponent } from './layout/private/private.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '',
    component: PublicComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },
  { path: '',
    component: PrivateComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'colleges', component: CollegesComponent },
      { path: 'committee', component: CommitteeComponent },
      { path: 'document', component: DocumentComponent},
      { path: 'minutes', component: MinutesComponent},
      { path: 'resources', component: ResourcesComponent},
      { path: 'settings', component: SettingsComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
