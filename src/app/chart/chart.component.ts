import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartControls } from 'src/models/chart-controls.js';
import { UserActions } from 'src/models/users-actions.js';
import { ChartAnimationService } from '../services/chart-animation.service.js';
import { ChartControlService } from '../services/chart-controls.service.js';
import { ChartDesignService } from '../services/chart-design.service.js';
import { SessionsStore } from '../services/sessions-store.service.js';
import { StopwatchService } from '../services/stopwatch.service.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [ChartDesignService]

})
export class ChartComponent implements OnInit, OnChanges, OnDestroy {
  constructor(
    //private sessionsStore: SessionsStore,
    public chartDesignService: ChartDesignService,
    private chartControlService: ChartControlService,
    private chartAnimationService: ChartAnimationService,
    private stopwatchService: StopwatchService
  ) { }

  @Input() chartControls: ChartControls;
  @Output() userAction = new EventEmitter<UserActions>();
  svg = this.chartDesignService.svg;
  canvas = this.chartDesignService.canvas;
  animateRectsSub: Subscription;
  ngOnInit(): void {

    console.log("CHART COMPONENT INITIALIZED");
    // this.sessionsStore.getAllSessions();
    this.setDefaultValues();
    this.drawChart();
    this.chartDesignService.drawFigures();
    this.chartAnimationService.finnishSessionSubj$.subscribe(v => {
      this.userAction.emit(UserActions.STOP)
    })
  }

  ngOnChanges(changes: any) {
    if (changes.chartControls.previousValue) {
      const {
        pdaValue: currentPdaValue,
        inhaleValue: currentInhaleValue,
        abbsValue: currentAbbsValue,
        isComplexChart: isCurrentComplexChart,
        userActionValue: currentUserActionValue,
        appIsRunning: currentAppIsRunning } = changes.chartControls.currentValue;

      const {
        pdaValue: previousPdaValue,
        inhaleValue: previousInhaleValue,
        abbsValue: previousAbbsValue,
        isComplexChart: isPreviousComplexChart,
        userActionValue: previousUserActionValue } = changes.chartControls.previousValue;

      if (
        currentPdaValue != previousPdaValue ||
        currentInhaleValue != previousInhaleValue ||
        currentAbbsValue != previousAbbsValue ||
        isCurrentComplexChart != isPreviousComplexChart) {
        this.chartDesignService.setCurrentContorlsValues(
          currentPdaValue,
          currentInhaleValue,
          currentAbbsValue,
          isCurrentComplexChart);

        this.drawChart();
      }

      if (previousUserActionValue != currentUserActionValue) {
        switch (currentUserActionValue) {
          case 'START':
            this.start();
            break;
          case 'PAUSE':
            this.pause();
            break;
          case 'STOP':
            this.stop();
            break;
        }
      }
    }
  }

  drawChart() {
    this.chartDesignService.createChart();
    this.chartDesignService.drawFigures();

    const figures = this.chartDesignService.getFigures();
    const distance = this.chartDesignService.getDistanceBtwLines()

    this.chartAnimationService.setFigures(figures)
    this.chartAnimationService.setDistanceBtwLines(distance);
  }

  start() {
    if (!this.animateRectsSub) {
      this.animateRectsSub = this.chartAnimationService.animateRects$.subscribe();
    }
    this.stopwatchService.startStopwatch();
  }

  pause() {
    if (this.animateRectsSub) {
      this.animateRectsSub.unsubscribe();
      this.animateRectsSub = null;
    }
    this.stopwatchService.pauseStopwatch();
    this.chartAnimationService.pauseRectAnimation();
    console.log('-- APP PAUSED --')
  }

  stop() {
    this.chartAnimationService.stopRectAnimation();
    if (this.animateRectsSub) {
      this.animateRectsSub.unsubscribe();
      this.animateRectsSub = null;
    }
    this.stopwatchService.stopStopwatch();
    this.drawChart();
    this.chartAnimationService.stopRectAnimation();
    console.log('-- APP STOPPED --')
  }

  setDefaultValues() {
    this.chartControlService.setDefaultValues();
  }

  ngOnDestroy() {
    // this.chartControlService.setDefaultValues();
    if (this.animateRectsSub) {
      this.animateRectsSub.unsubscribe();
    }
  }
}
