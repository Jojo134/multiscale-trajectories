import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TrajviewComponent } from './shared/trajview/trajview.component';
import { Trajview1Component } from './shared/trajview.1/trajview.component';

import { HomeComponent } from './home/home.component';
import { routing, appRoutingProviders } from './app.routes';
import { MultiselectComponent } from './shared/multiselect/multiselect.component';
import { NouisliderModule } from 'ng2-nouislider/src/nouislider';
@NgModule({
  declarations: [
    AppComponent,
    TrajviewComponent,
    Trajview1Component,
    HomeComponent,
    MultiselectComponent
  ],
  imports: [
    BrowserModule, NouisliderModule,
    FormsModule, HttpModule, routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
