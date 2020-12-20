import { Injectable } from '@angular/core';
import { combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { UserActions } from 'src/models/users-actions.js';
import { Rect } from 'src/models/rect.js';
import { StopwatchService } from './stopwatch.service.js';
import * as defaults from '../../assets/utils/defaults.json'
import { MatDialog } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root',
})
export class ChartControlService {
  constructor(
    private stopwatchService: StopwatchService,
    public dialog: MatDialog,
     ){}

  // EXHALE VALUE
  complexExhaleValue = defaults.exhaleComplexDefault;

  // PDA VALUE
  pdaSimpleDefault = defaults.pdaSimpleDefault;
  exhaleComplexDefault = defaults.exhaleComplexDefault;
  pdaComplexDefault = defaults.pdaComplexDefault;

  private _pdaValueSubj = new BehaviorSubject(defaults.pdaSimpleDefault);
  pdaValueSubj$ = this._pdaValueSubj.asObservable();

  getPdaValue() {
    return this._pdaValueSubj.getValue();
  }

  setPdaValue(value) {
    this._pdaValueSubj.next(value);
  }

  // INHALE VALUE
  inhaleDefault = defaults.inhaleDefault;
  private _inhaleValueSubj = new BehaviorSubject(this.inhaleDefault);
  inhaleValueSubj$ = this._inhaleValueSubj.asObservable();

  getInhaleValue() {
    return this._inhaleValueSubj.getValue();
  }

  setInhaleValue(value) {
    this._inhaleValueSubj.next(value);
  }

  // ABBS VALUE
  abbsDefault = defaults.abbsDefault;
  private _abbsValueSubj = new BehaviorSubject(this.abbsDefault);
  abbsValueSubj$ = this._abbsValueSubj.asObservable();

  getAbbsValue() {
    return this._abbsValueSubj.getValue();
  }

  setAbbsValue(value) {
    this._abbsValueSubj.next(value);
  }

  // EXHALE VALUE
  getExhaleValue(){
    return this.getPdaValue() - this.getInhaleValue() - this.getAbbsValue();
  }

  // SET DEFAUL VALUES
  setDefaultValues(){
    this.setPdaValue(defaults.pdaSimpleDefault);
    this.setInhaleValue(defaults.inhaleDefault);
    this.setAbbsValue(defaults.abbsDefault);
    this.setIsComplexChartValue(false);
  }

  // CHART SWITCHER
  private _chartSwitcherSubj = new BehaviorSubject(false);
  chartSwitcherSubj$ = this._chartSwitcherSubj.asObservable();

  getIsComplexChartValue() {
    return this._chartSwitcherSubj.getValue();
  }

  setIsComplexChartValue(value) {
    this._chartSwitcherSubj.next(value);
  }

  // APP IS RUNNING
  private _appIsRunningSubj = new BehaviorSubject(false);
  appIsRunningSubj$ = this._appIsRunningSubj.asObservable();

  setAppIsRunningSubj(value){
    this._appIsRunningSubj.next(value);
  }

  getAppIsRunningSubj(){
    this._appIsRunningSubj.getValue();
  }

  // FINAL STOPWATCH DEFAULT VALUE
  getFinalStopwatchDigitDefault(){
    return this.stopwatchService.finalStopwatchDigitDefault;
  }

  // SESSION: RUNNING STOPWATCH SETUP
  setRunningStopwatchDisplayTimer(value) {
    this.stopwatchService.setRunningStopwatchDisplayTimer(value);
  }

  getRunningStopwatchDisplayTimer() {
    return this.stopwatchService.getRunningStopwatchDisplayTimer();
  }

  getRunningStopwatchDigitValue() {
    return this.stopwatchService.getRunningStopwatchDigitValue();
  }

  // SESSION: FINAL STOPWATCH SETUP
  setFinalStopwatchDisplayTimer(value) {
    this.stopwatchService.setFinalStopwatchDisplayTimer(value)
  }

  getFinalStopwatchDisplayTimer() {
    return this.stopwatchService.getFinalStopwatchDisplayTimer();
  }

  getFinalStopwatchDigitValue() {
    return this.stopwatchService.getFinalStopwatchDigitValue();
  }

  // STOPWATCH CONTROLS
  startStopwatch(){
    this.stopwatchService.startStopwatch();
  }

  pauseStopwatch(){
    this.stopwatchService.pauseStopwatch();
  }

  stopStopwatch(){
    this.stopwatchService.stopStopwatch();
  }

  // USER ACTIONS: START, PAUSE, STOP
  private _userActionSubj = new BehaviorSubject<UserActions>(UserActions.STOP);
  userActionSubj$ = this._userActionSubj.asObservable();

  setUserAction(userAction : UserActions){
    this._userActionSubj.next(userAction)
  }

  // KILL ANIMATE RECTS SUBJ
  private _killAnimateRectsSubj  = new Subject();
  killAnimateRectsSubj$ = this._killAnimateRectsSubj.asObservable()
  killRectAnimation(){
    this._killAnimateRectsSubj.next(true);
  }

  // RECT Subj
  private _rectSubj = new BehaviorSubject<Rect[]>([]);
  rectSubj$ = this._rectSubj.asObservable();

  setRects(rects: Rect[]) {
    this._rectSubj.next(rects);
  }

  // CHART CONTROLS
  chartControls$ = combineLatest(
    this.pdaValueSubj$,
    this.inhaleValueSubj$,
    this.abbsValueSubj$,
    this.userActionSubj$,
    this.chartSwitcherSubj$,
    this.appIsRunningSubj$,
    this.stopwatchService.runningStopwatchSubj$,
    this.stopwatchService.finaleStopwatchSubj$,
    (pdaValue, inhaleValue, abbsValue, userActionValue, isComplexChart, appIsRunning, runningStopwatch, finalStopwatch) => {

      const exhaleValue = isComplexChart === true  && pdaValue >= this.pdaComplexDefault ? this.complexExhaleValue :
    pdaValue - inhaleValue - abbsValue;

    return {
      pdaValue,
      exhaleValue,
      inhaleValue,
      abbsValue,
      userActionValue,
      isComplexChart,
      appIsRunning,
      runningStopwatch,
      finalStopwatch
    }
  });

  // WATER VOLUME
  waterVolSubj = new BehaviorSubject(0);

  getWaterVol() {
    return this.waterVolSubj.getValue();
  }

  setWaterVol(value) {
    this.waterVolSubj.next(value);
}

}
