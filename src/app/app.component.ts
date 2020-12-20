import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { Howl, Howler } from 'howler';
import { DexieDbOpsService } from './services/dexie-idbs-ops.service';
import { SessionsStore } from './services/sessions-store.service';
import { DataTableComponent } from './sessions/data-table/data-table.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'pda-timer';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private swUpdate: SwUpdate,
    private sessionsStore: SessionsStore,
    private dexieOps: DexieDbOpsService
  ) {
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/googleLogin.svg'
      )
    );
  }

  ngOnInit() {
    this.dexieOps.getCurrentUserFromUserDb().then((user) => {
      console.log('CU', user);
      if (user) {
        this.sessionsStore.getAllSessions(user.email);
        //this.sessionsStore.setUser(user);
      }
    });
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New Version is available. Reload the app?')) {
          window.location.reload();
        }
      });
    }
  }
}
