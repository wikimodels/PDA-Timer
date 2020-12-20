import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UserActions } from 'src/models/users-actions';
import { ChartControls } from 'src/models/chart-controls';
import { ChartControlService } from '../services/chart-controls.service';



@Component({
  selector: 'app-start-pause-stop',
  templateUrl: './start-pause-stop.component.html',
  styleUrls: ['./start-pause-stop.component.css'],
})
export class StartPauseStopComponent implements OnInit {
  constructor(
    private chartControlService: ChartControlService,
  ) {}
  @ViewChild("isComplexChart") sliderToggle: MatSlideToggle;
  @Input()chartControls: ChartControls;
  @Output() userAction = new EventEmitter<UserActions>();
  pdaComplexDefault = 11//this.chartControlsService.pdaComplexDefault;
  isDisabled : boolean;
  shitIsRunning = false;
  ngOnInit(): void {
  this.isDisabled = true;
  }

  ngOnChanges(changes: any){
  const currentPdaValue = changes.chartControls.currentValue.pdaValue;
  const userActionValue = changes.chartControls.currentValue.userActionValue;
  const appIsRunning = changes.chartControls.currentValue.appIsRunning;

  // CONTROL IS_COMPLEX SWITCHER WHILE USER DECREASE PDA-VALUE
  if(changes.chartControls.previousValue)
      {
          const {
            isComplexChart: isCurrentComplexChart
          } = changes.chartControls.currentValue;

          const {
            isComplexChart: isPreviousComplexChart  } = changes.chartControls.previousValue;
    if(
      isCurrentComplexChart != isPreviousComplexChart){
      this.userAction.emit(UserActions.STOP);
     }
  }


  // CONTROL MAT-SLIDER
    if(currentPdaValue < this.pdaComplexDefault && this.sliderToggle){
      this.sliderToggle.checked = false;
      this.chartControlService.setIsComplexChartValue(false);
      this.isDisabled = true;

    } else {
      this.isDisabled = false;
    }

    // CONTROL APP
    if(!appIsRunning && userActionValue === 'START'){
      this.start();
      this.chartControlService.setAppIsRunningSubj(true);

    }
    if(appIsRunning && userActionValue === 'PAUSE'){
      this.pause();
      this.chartControlService.setAppIsRunningSubj(false);

    }
    if(appIsRunning && userActionValue === 'STOP'){
      this.stop()
      this.chartControlService.setAppIsRunningSubj(false);
    }
   }

  start() {
    console.log("S-P-S: APP GOT STARTED")
    this.userAction.emit(UserActions.START);
    this.chartControlService.setAppIsRunningSubj(true);
  }

  pause() {
    console.log("S-P-S: APP GOT PAUSED")
    console.log("S-P-S SHitIsRunning", this.shitIsRunning)
    this.userAction.emit(UserActions.PAUSE);
    this.chartControlService.setAppIsRunningSubj(false);
  }

  stop() {
    console.log("S-P-S: APP GOT STOPPED")
    this.userAction.emit(UserActions.STOP);
    //this.chartControlService.setAppIsRunningSubj(false);
  }

  onSliderChange(value: MatSlideToggleChange) {
     this.chartControlService.setIsComplexChartValue(value.checked);
     this.userAction.emit(UserActions.STOP);
    //this.chartControlService.setAppIsRunningSubj(false);
  }
}
