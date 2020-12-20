import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as defaults from '../../assets/utils/defaults.json'

import { ChartControlService } from '../services/chart-controls.service';
import { DexieDbOpsService } from '../services/dexie-idbs-ops.service';
import { SessionsStore } from '../services/sessions-store.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  constructor(
    private sessionsStore: SessionsStore,
    private dialogRef: MatDialogRef<DialogComponent>,
    private chartControlsService: ChartControlService,
  ) { }
  value = defaults.waterVolume;
  waterVolFormCtrl = new FormControl(defaults.waterVolume);

  ngOnInit(): void {
    this.waterVolFormCtrl.valueChanges.subscribe((v) => {
      this.value = v;
      console.log(this.value);
    });
  }

  add() {
    if (this.value < 10) {
      this.value = this.value + 0.5;
      this.waterVolFormCtrl.setValue(this.value);
    }
  }

  substract() {
    if (this.value > 0.5) {
      this.value = this.value - 0.5;
      this.waterVolFormCtrl.setValue(this.value);
    }
  }

  submitData() {
    this.chartControlsService.setWaterVol(this.value);
    console.log('DiALOG Water Vol', this.chartControlsService.getWaterVol())
    this.sessionsStore.postSession();
    this.dialogRef.close();
  }
}
