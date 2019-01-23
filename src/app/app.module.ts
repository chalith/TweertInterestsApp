import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'primeng/accordion'
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule, InputTextModule } from 'primeng/primeng';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { RatingModule } from 'primeng/rating';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { GMapModule } from 'primeng/gmap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ItemComponent } from './item/item.component';
import { MapComponent } from './map/map.component';
import { ChartComponent } from './chart/chart.component';
import { RatingComponent } from './rating/rating.component';

import { ApiService } from './services/api/api.service';
import { CensusOpinionService } from './services/census-opinion/census-opinion.service';
import { ImageService } from './services/image/image.service';
import { MessageService } from 'primeng/primeng';
import { ViewTweetComponent } from './view-tweet/view-tweet.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ItemComponent,
    MapComponent,
    ChartComponent,
    RatingComponent,
    ViewTweetComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AccordionModule,
    DataViewModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    CardModule,
    PanelModule,
    CalendarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCH1t63UHJVo8ILQgFrZUUnGQNef9YzgP0'
    }),
    ChartModule,
    ToastModule,
    SliderModule,
    TabViewModule,
    TreeTableModule,
    RatingModule,
    RadioButtonModule,
    DialogModule,
    GMapModule
  ],
  providers: [
    ApiService,
    CensusOpinionService,
    ImageService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
