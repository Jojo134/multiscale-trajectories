import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MdButtonModule, MdCheckboxModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgProgressModule } from 'ngx-progressbar';
import { WebWorkerService } from 'angular2-web-worker';

import { AppComponent } from './app.component';
import { TrajviewComponent } from './shared/trajview/trajview.component';
import { Trajview1Component } from './shared/trajview.1/trajview.component';

import { HomeComponent } from './home/home.component';
import { routing, appRoutingProviders } from './app.routes';
import { MultiselectComponent } from './shared/multiselect/multiselect.component';
import { NouisliderModule } from 'ng2-nouislider/src/nouislider';
import { DetailCompareComponent } from './detail-compare/detail-compare.component';
import { HistogramSliderComponent } from './shared/histogram-slider/histogram-slider.component';
import { SimMatrixComponent } from './shared/sim-matrix/sim-matrix.component';
import { DataService } from './shared';

@NgModule({
  declarations: [
    AppComponent,
    TrajviewComponent,
    Trajview1Component,
    HomeComponent,
    MultiselectComponent,
    DetailCompareComponent,
    HistogramSliderComponent,
    SimMatrixComponent
  ],
  imports: [
    BrowserModule, NouisliderModule, MdCheckboxModule, BrowserAnimationsModule,
    FormsModule, HttpModule, routing, NgProgressModule
  ],
  providers: [appRoutingProviders, DataService, WebWorkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
