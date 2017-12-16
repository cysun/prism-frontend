import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { DepartmentsComponent } from './departments/departments.component';
import { CollegesComponent } from './colleges/colleges.component';

import { AccordionModule } from 'primeng/primeng';
import { MenubarModule, MenuItem} from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/components/button/button';

// import { PanelModule } from 'primeng/components/panel/panel';
// import { RadioButtonModule } from 'primeng/components/radioButton/radioButton';

@NgModule({
  declarations: [
    AppComponent,
    DepartmentsComponent,
    CollegesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolbarModule,
    AccordionModule,
    MenubarModule,
    ButtonModule,
    // PanelModule,
    // RadioButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
