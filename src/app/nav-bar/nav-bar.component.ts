import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { take, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import {
  BASE,
  HOME,
  LOGIN,
  SESSIONS,
  ABOUT,
  ADMIN_PANEL,
} from '../consts/routes.consts';
import { ChartControlService } from '../services/chart-controls.service';
import { SnackBarService } from '../services/snackbar.service';
import { MessageType } from 'src/models/message-types';
import { ConnectionService } from 'ng-connection-service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  displayName = '';
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private snackbar: SnackBarService,
    private connectionService: ConnectionService
  ) {}

  isOnline = true;
  ngOnInit() {
    this.connectionService.monitor().subscribe((isOnline) => {
      this.isOnline = isOnline;
    });
  }
  goToSessions() {
    this.auth.setRedirectUrl(SESSIONS);
    this.router.navigate([SESSIONS]);
  }

  goToHome() {
    this.router.navigate([HOME]);
  }

  goToAbout() {
    this.router.navigate([ABOUT]);
  }

  changeUser() {
    this.router.navigate([LOGIN]);
  }

  goToAdminPanel() {
    console.log(window);
    if (this.isOnline) {
      this.router.navigate([ADMIN_PANEL]);
    } else {
      this.snackbar.open(
        'You must online to proceed',
        'Close',
        MessageType.WARNING
      );
    }
  }
}
