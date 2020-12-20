import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, timer, Subject, Subscription } from 'rxjs';
import { finalize, map, takeUntil, tap } from 'rxjs/operators';
import { Stopwatch } from 'src/models/stopwatch.model';
import * as defaults from '../../assets/utils/defaults.json'
import { DialogComponent } from '../dialog/dialog.component';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class StopwatchService implements OnDestroy {
// Timer Subscription
  timerSub: Subscription

  // SESSION: TIME IS UP
  private _timeIsUpSubj = new BehaviorSubject(false);

  getTimeIsUp(){
    return this._timeIsUpSubj.getValue();
  }
  setTimeIsUp(value){
    this._timeIsUpSubj.next(value)
  }



 // SESSION: RUNNING STOPWATCH
 finalStopwatchDigitDefault =
                            defaults.finalStopwatchDigitValue;
 private _runningStopwatchDisplayTimerSubj =
                            new BehaviorSubject<Stopwatch>(defaults.stopwatch);

 private _runningStopwatchDigitValueSubj = new BehaviorSubject<number>(1);
 runningStopwatchSubj$ = this._runningStopwatchDisplayTimerSubj.asObservable();

 setRunningStopwatchDisplayTimer(value) {
   this._runningStopwatchDigitValueSubj.next(value);
   const displayTimer = this.getDisplayTimer(value);
   this._runningStopwatchDisplayTimerSubj.next(displayTimer);
 }

 getRunningStopwatchDisplayTimer() {
   return this._runningStopwatchDisplayTimerSubj.getValue();
 }

 getRunningStopwatchDigitValue() {
   return this._runningStopwatchDigitValueSubj.getValue();
 }

 // SESSION: FINAL STOPWATCH
 private _finaleStopwatchDisplayTimerSubj =
                        new BehaviorSubject<Stopwatch>(defaults.stopwatch);

 private _finaleStopwatchDigitValueSubj = new BehaviorSubject<number>(0);

 finaleStopwatchSubj$ = this._finaleStopwatchDisplayTimerSubj.asObservable();

 setFinalStopwatchDisplayTimer(value) {
   this._finaleStopwatchDigitValueSubj.next(value);
   const displayTimer = this.getDisplayTimer(value * 60);
   this._finaleStopwatchDisplayTimerSubj.next(displayTimer);
 }

 getFinalStopwatchDisplayTimer() {
   return this._finaleStopwatchDisplayTimerSubj.getValue();
 }

 getFinalStopwatchDigitValue() {
   return this._finaleStopwatchDigitValueSubj.getValue();
 }

 // TIMER
  timer = 0;
  timer$(): Observable<any> {
    return timer(0, 1000).pipe(
      tap(() => {
        if (
            this.timer >=
            this.getFinalStopwatchDigitValue() * 60
        ) {
            this.setTimeIsUp(true);
            this.stopStopwatch();

          }
      }),
      map(() => {
        this.timer++;
        return this.setRunningStopwatchDisplayTimer(this.timer);
      }),
      takeUntil(this.killStopwatchSubj$)
    );
  }

  // STOPWATCH CONTROLS
  startStopwatch() {
    if(!this.timerSub) {
      this.timerSub = this.timer$().subscribe();
    }
  }

  pauseStopwatch() {
    this._killStopwatchSubj.next();
    if(this.timerSub){
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
   }

  stopStopwatch() {
    this.timer = 0;
    if(this.timerSub){
      this.timerSub.unsubscribe();
      this.timerSub = null;
    }
    this.killStopwatch();
    this.setRunningStopwatchDisplayTimer(0);
   }

  // KILL STOPWATCH
  private _killStopwatchSubj = new Subject();
  private killStopwatchSubj$ = this._killStopwatchSubj.asObservable();

  private killStopwatch() {
      this._killStopwatchSubj.next(true);
  }

  private getDisplayTimer(time: number) {
    const hours = '0' + Math.floor(time / 3600);
    const minutes = '0' + Math.floor((time % 3600) / 60);
    const seconds = '0' + Math.floor((time % 3600) % 60);

    let stopwatch = {
      hours: {
        digit1: hours.slice(-2, -1),
        digit2: hours.slice(-1),
      },
      minutes: {
        digit1: minutes.slice(-2, -1),
        digit2: minutes.slice(-1),
      },
      seconds: {
        digit1: seconds.slice(-2, -1),
        digit2: seconds.slice(-1),
      },
    };
    return stopwatch;
  }

  ngOnDestroy() {
    this.timerSub.unsubscribe();
  }
}
