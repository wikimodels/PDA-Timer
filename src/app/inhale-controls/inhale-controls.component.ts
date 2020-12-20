import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartControlService } from '../services/chart-controls.service';
import * as defaults from '../../assets/utils/defaults.json'

@Component({
  selector: 'app-inhale-controls',
  templateUrl: './inhale-controls.component.html',
  styleUrls: ['./inhale-controls.component.css'],
})
export class InhaleControlsComponent implements OnInit {

  pdaDefault  = defaults.pdaSimpleDefault;
  inhaleDefault = defaults.inhaleDefault;
  inhaleFormCtrl = new FormControl(this.inhaleDefault);
  value = this.inhaleDefault;

  constructor(
    private chartControlsService: ChartControlService
  ) {}

  ngOnInit(): void {
    this.inhaleFormCtrl.valueChanges.subscribe((v) => {
      this.value = v;
    });
  }

  add() {
    if (
      this.value < this.chartControlsService.getExhaleValue())
      { this.value = this.value + 0.5;
    }
    this.inhaleFormCtrl.setValue(this.value);
    this.chartControlsService.setInhaleValue(this.value);
  }

  substract() {
    if (this.value > 0.5) {
      this.value = this.value - 0.5;
      this.inhaleFormCtrl.setValue(this.value);
      this.chartControlsService.setInhaleValue(this.value);
    }
  }
}
