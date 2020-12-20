import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartControlService } from '../services/chart-controls.service';
import * as defaults from '../../assets/utils/defaults.json'


@Component({
  selector: 'app-pda-controls',
  templateUrl: './pda-controls.component.html',
  styleUrls: ['./pda-controls.component.css'],
})
export class PdaControlsComponent implements OnInit {
  pdaDefault = defaults.pdaSimpleDefault;
  pdaFormCtrl = new FormControl(this.pdaDefault);
  value = this.pdaDefault;

  constructor(
    private chartControls: ChartControlService
  ) {}

  ngOnInit(): void {
    this.pdaFormCtrl.valueChanges.subscribe((v) => {
      this.value = v;
    });
  }

  add() {
    if (this.value <= 60) {
      this.value++;
      this.pdaFormCtrl.setValue(this.value);
      this.chartControls.setPdaValue(this.value);

    }
  }

  substract() {
    if (this.value > this.pdaDefault) {
      this.value--;
    }
    this.pdaFormCtrl.setValue(this.value);
    this.chartControls.setPdaValue(this.value);
  }

}
