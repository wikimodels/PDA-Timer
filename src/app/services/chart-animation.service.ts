import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subject, concat } from 'rxjs';
import { StopwatchService } from './stopwatch.service.js';
import { tap, takeUntil, repeat } from 'rxjs/operators';
import { Figure } from 'src/models/figure.js';
import { SoundService } from './sound.service.js';
import { of } from 'rxjs/internal/observable/of';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component.js';


@Injectable({
  providedIn: 'root',
})
export class ChartAnimationService {
  constructor(
    private stopwatchService: StopwatchService,
    private soundService : SoundService,
    public dialog: MatDialog,
     ){}



  // SESSION: FINISH SESSION
  private _finishSessionSubj = new Subject();
  finnishSessionSubj$ = this._finishSessionSubj.asObservable();

  finnishSession(){
    this._finishSessionSubj.next(true);
  }

  // TIME IS UP
  getTimeIsUp() {
    return this.stopwatchService.getTimeIsUp();
  }
  setTimeIsUp(value) {
    this.stopwatchService.setTimeIsUp(value);
  }



  // DISTANCE BTW LINES
  private _distanceBtwLinesSubj = new BehaviorSubject(0);
  distanceBtwLinesSubj$ = this._distanceBtwLinesSubj.asObservable();

  getDistanceBtwLines() {
    return this._distanceBtwLinesSubj.getValue();
  }

  setDistanceBtwLines(distance){
    this._distanceBtwLinesSubj.next(distance)
}

  // KILL ANIMATE RECTS SUBJ
  private _killAnimateRectsSubj  = new Subject();
  killAnimateRectsSubj$ = this._killAnimateRectsSubj.asObservable()
  killRectAnimation(){
    this._killAnimateRectsSubj.next(true);
  }

  // RECT Subj
     elementIndex = 0;
     heightIncreament = 0;


 // GET FIGURES
  private _figuresSubj = new BehaviorSubject<Figure[]>([]);

  figuresSubj$ = this._figuresSubj.asObservable();

  setFigures(figures: Figure[]){
    this._figuresSubj.next(figures)
  }

  getFigures(){
    return this._figuresSubj.getValue()
  }

  animateRects$ = concat(
    of('start').pipe(tap(()=>{
      this.playSound(this.elementIndex)
    })),
    timer(0, 25).pipe(
    tap(() => {
      const figures = this.getFigures();
      const distance = this.getDistanceBtwLines();
      const perTime = distance / 40;

      let figure = figures[this.elementIndex];
      if(figure){
        const el = document.getElementById(figure.rect.id);
          this.heightIncreament = this.heightIncreament + perTime;
          el.style.height =  this.heightIncreament + 'px';
          if (this.heightIncreament > figure.outlines.topOutline.y1) {
              this.elementIndex++;
              this.heightIncreament = 0;
              this.playSound(this.elementIndex);
            }
            // Check that previous rects (before running one) are filled
            if(this.elementIndex > 0){
              for(let i = 0; i < this.elementIndex; i++){
                const el = document.getElementById(figures[i].rect.id);
                el.style.height = figures[i].outlines.topOutline.y1 + 'px';
              }
            }
        } else {
          this.elementIndex++;
        }

        if(this.elementIndex === 0 && this.stopwatchService.getTimeIsUp()){
          this.finnishSession();
          this.dialog.open(DialogComponent, {
            width: '300px',
          });
          this.setTimeIsUp(false);
        }

        if (this.elementIndex === figures.length) {
         this.setupRectAnimation();
        }
      }
    ),
    takeUntil(this.killAnimateRectsSubj$),
    repeat(-1)
  ));

  setupRectAnimation(){
    this.elementIndex = 0;
    this.playSound(this.elementIndex);
    const figures = this.getFigures();
    figures.forEach(figure =>{
      const el = document.getElementById(figure.rect.id);
      el.style.height = '0px';
    })
  }

  playSound(elementIndex) {
    let previousElementId;
    let currentElementId;
    const figures = this.getFigures();
    if(figures[elementIndex - 1]){
      previousElementId =  figures[elementIndex - 1].rect.id;
    }
    if(figures[elementIndex]){
      currentElementId =  figures[elementIndex].rect.id;
    }
    console.log(`previousElementId ${previousElementId}`)
    console.log(`currentElementId ${currentElementId}`)
    if(previousElementId){
      this.soundService.stopPlayingSound(previousElementId)
    }
    if(currentElementId){
      this.soundService.startPlayingSound(currentElementId)
    }
  }

  pauseRectAnimation() {
    this.soundService.pauseAllSounds();
  }

  stopRectAnimation(){
    this._killAnimateRectsSubj.next('KILL');
    this.elementIndex = 0;
    this.heightIncreament = 0;
    this.soundService.stopAllSounds();
  }

}
