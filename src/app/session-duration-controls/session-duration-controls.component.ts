import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Stopwatch } from 'src/models/stopwatch.model';
import { ChartControlService } from '../services/chart-controls.service';



@Component({
  selector: 'app-session-duration-controls',
  templateUrl: './session-duration-controls.component.html',
  styleUrls: ['./session-duration-controls.component.css'],
})
export class SessionDurationControlsComponent implements OnInit {

  @Input()runningStopwatch: Stopwatch
  @Input()finalStopwatch : Stopwatch;
  finalStopwacthValue = 0;
  sessionDurationFormCtrl: FormControl;

  constructor(
    private chartControlService: ChartControlService
  ) {}

  ngOnInit(): void {
    this.finalStopwacthValue = this.chartControlService.getFinalStopwatchDigitDefault();

    this.sessionDurationFormCtrl = new FormControl(
      this.finalStopwacthValue
    );
    this.chartControlService.setFinalStopwatchDisplayTimer(this.finalStopwacthValue);
    this.finalStopwatch = this.chartControlService.getFinalStopwatchDisplayTimer();
    this.setSessionDuration();

    // CONTROL FINAL STOPWATCH VALUE
    this.sessionDurationFormCtrl.valueChanges.subscribe((v) => {
      this.finalStopwacthValue = v;
    });
  }


  add() {
    if (this.finalStopwacthValue < 59) {
      this.finalStopwacthValue++;
    }
    this.setSessionDuration();
  }

  substract() {
  if (this.finalStopwacthValue > this.chartControlService.getFinalStopwatchDigitDefault()) {
      this.finalStopwacthValue --;
    }
    this.setSessionDuration();
  }

  private setSessionDuration(){
    this.sessionDurationFormCtrl.setValue(this.finalStopwacthValue);
    this.chartControlService.setFinalStopwatchDisplayTimer(this.finalStopwacthValue);
  }

}
