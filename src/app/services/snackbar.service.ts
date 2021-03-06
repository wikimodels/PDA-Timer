import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MessageType } from 'src/models/message-types';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  //create an instance of MatSnackBar
  snackBarConfig: MatSnackBarConfig;
  snackBarRef: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  snackBarAutoHide = '3000';
  constructor(private snackBar: MatSnackBar) {}

  /* It takes three parameters
  1.the message string
  2.the action
  3.the duration, alignment, etc. */

  open(message: string, action: string, type: MessageType) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = this.horizontalPosition;
    this.snackBarConfig.verticalPosition = this.verticalPosition;
    this.snackBarConfig.duration = parseInt(this.snackBarAutoHide, 0);
    const sbClass =
      type === MessageType.INFO ? 'info-snackbar' : 'warning-snackbar';
    this.snackBarConfig.panelClass = sbClass;
    this.snackBar.open(message, action, this.snackBarConfig);
  }
}
