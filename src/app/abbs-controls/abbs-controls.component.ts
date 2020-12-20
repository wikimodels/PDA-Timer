import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartControlService } from '../services/chart-controls.service';
import * as defaults from '../../assets/utils/defaults.json'


@Component({
  selector: 'app-abbs-controls',
  templateUrl: './abbs-controls.component.html',
  styleUrls: ['./abbs-controls.component.css'],
})
export class AbbsControlsComponent implements OnInit  {
  abbsDefault = defaults.abbsDefault;
  abbsFormCtrl = new FormControl(this.abbsDefault);
  value = this.abbsDefault;

  constructor(
    private chartControlsService: ChartControlService
  ) {}

  ngOnInit(): void {
    this.abbsFormCtrl.valueChanges.subscribe((v) => {
      this.value = v;
    });
  }

  add() {
    if (
      this.value < this.chartControlsService.getExhaleValue()) {
      this.value = this.value + 0.5;
      this.abbsFormCtrl.setValue(this.value);
      this.chartControlsService.setAbbsValue(this.value);
    }
  }

  substract() {
    if (this.value > 0) {
      this.value = this.value - 0.5;
      this.abbsFormCtrl.setValue(this.value);
      this.chartControlsService.setAbbsValue(this.value);
    }
  }
}
