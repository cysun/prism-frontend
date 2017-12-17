import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { CollegesComponent } from './colleges/colleges.component';

import { AccordionModule } from 'primeng/primeng';
import { MenubarModule, MenuModule, MenuItem } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/components/button/button';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsComponent } from './settings/settings.component';

// import { PanelModule } from 'primeng/components/panel/panel';
// import { RadioButtonModule } from 'primeng/components/radioButton/radioButton';

@NgModule({
  declarations: [
    AppComponent,
    CollegesComponent,
    DashboardComponent,
    PageNotFoundComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolbarModule,
    AccordionModule,
    MenuModule,
    MenubarModule,
    ButtonModule,
    // PanelModule,
    // RadioButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
