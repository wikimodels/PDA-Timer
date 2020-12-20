import { Injectable } from '@angular/core';
import { Howl, Howler } from 'howler';
import { of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private _inhale = new Howl({ src: ['assets/sounds/inh.mp3'] });
  private _exhale = new Howl({ src: ['assets/sounds/exh.mp3'], loop: true });
  private _abbs = new Howl({ src: ['assets/sounds/abbs.mp3'] });
  private _ticktack = new Howl({ src: ['assets/sounds/ticktack.mp3'] });

  startPlayingSound(elementId){
    if(elementId.includes('inhale')){
      this._inhale.play();
    }
    if(elementId.includes('exhale')){
      this._exhale.play();
    }
    if(elementId.includes('abbs')){
      this._abbs.play();
    }
    if(elementId.includes('ticktack')){
      this._ticktack.play();
    }
  }

  stopPlayingSound(elementId){
    if(elementId.includes('inhale')){
      this._inhale.stop();
    }
    if(elementId.includes('exhale')){
      this._exhale.stop();
    }
    if(elementId.includes('abbs')){
      this._abbs.stop();
    }
    if(elementId.includes('ticktack')){
      this._ticktack.stop();
    }
  }

  stopAllSounds(){
    this._inhale.stop();
    this._exhale.stop();
    this._abbs.stop();
    this._ticktack.stop();
  }

  pauseAllSounds(){
    this._inhale.pause();
    this._exhale.pause();
    this._abbs.pause();
    this._ticktack.pause();
  }
}
