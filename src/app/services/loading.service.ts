import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, of } from 'rxjs';
import { concatMap, tap, finalize, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => {
        console.log('Loading is On');
        this.loadingOn();
      }),
      concatMap(() => obs$),
      finalize(() => {
        console.log('Loading is Off');
        this.loadingOff();
      })
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
    console.log('LOADING_Service ON');
  }

  loadingOff() {
    this.loadingSubject.next(false);
    console.log('LOADING_Service OFF');
  }
}
