import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './material.module';
import { ControlsComponent } from './controls/controls.component';
import { SliderComponent } from './slider/slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dbConfig } from './../assets/utils/dbConfig';
import { NgxIndexedDBModule } from 'ngx-indexed-db';

import { ChartComponent } from './chart/chart.component';

import { DialogComponent } from './dialog/dialog.component';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppFirebaseModule } from './app-firebase/app-firebase.module';
import { HomeComponent } from './home/home.component';
import { SnackBarService } from './services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { SessionsComponent } from './sessions/sessions.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DataTableComponent } from './sessions/data-table/data-table.component';
import { InhaleControlsComponent } from './inhale-controls/inhale-controls.component';
import { PdaControlsComponent } from './pda-controls/pda-controls.component';
import { AbbsControlsComponent } from './abbs-controls/abbs-controls.component';
import { SessionDurationControlsComponent } from './session-duration-controls/session-duration-controls.component';
import { StartPauseStopComponent } from './start-pause-stop/start-pause-stop.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { YoutubePipe } from 'src/shared/pipes/youtube.pipe';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminPanelDataTableComponent } from './admin-panel/admin-panel-data-table/admin-panel-data-table.component';

@NgModule({
  declarations: [
    YoutubePipe,
    AppComponent,
    HomeComponent,
    LoginComponent,
    AboutComponent,
    ChartComponent,
    DialogComponent,
    SliderComponent,
    NavBarComponent,
    ControlsComponent,
    SessionsComponent,
    DataTableComponent,
    PdaControlsComponent,
    AbbsControlsComponent,
    InhaleControlsComponent,
    StartPauseStopComponent,
    SessionDurationControlsComponent,
    AdminPanelComponent,
    AdminPanelDataTableComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatSortModule,
    MatTableModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    AppRoutingModule,
    AppMaterialModule,
    AppFirebaseModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('sw-master.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    SnackBarService,
    DialogComponent,
    DataTableComponent,
    DynamicScriptLoaderService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent],
})
export class AppModule {}
