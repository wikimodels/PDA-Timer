import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of, from } from 'rxjs';
import { catchError, map, tap, finalize, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import {
  ALL_SESSIONS_FOR_USER,
  ADD_SESSION_FOR_USER,
  DELELTE_SESSION_BY_ID,
} from '../consts/urls.consts';
import { SnackBarService } from './snackbar.service';
import { ChartControlService } from './chart-controls.service';
import { DexieDbOpsService } from './dexie-idbs-ops.service';
import { Session } from 'src/models/session.model';
import { User } from 'src/models/user';
import { MessageType } from 'src/models/message-types';

const formatDisplayDate = 'DD-MM-YY';
const formatDisplayTime = 'HH:mm';

@Injectable({
  providedIn: 'root',
})
export class SessionsStore {
  constructor(
    private readonly http: HttpClient,
    private readonly chartControlsService: ChartControlService,
    private readonly dexieOpsService: DexieDbOpsService,
    private dexieIDBService: DexieDbOpsService,
    private snackbar: SnackBarService
  ) {}

  private _userSubj = new BehaviorSubject<User>({
    email: undefined,
    sessions: [],
    sessions_count: 0,
  });
  userSubj$: Observable<User> = this._userSubj.asObservable();

  getUser(): User {
    return this._userSubj.getValue();
  }

  setUser(user: User) {
    this._userSubj.next(user);
  }

  async getAllSessions(email: string) {
    this.sessionsFromCloud$(email)
      .pipe(
        catchError((error) => {
          console.log('sessionsFromCloud() error', error);
          return this.sessionsFromIndexedDB$(email);
        }),
        catchError((error) => {
          this.snackbar.open(
            'Cannot retrieve data',
            'Close',
            MessageType.WARNING
          );
          return of(error);
        }),
        map((user: User) => {
          console.log('user', user);
          const array = user['sessions'].map((session: Session) => {
            const obj: Session = {
              _id: session._id,
              sessionId: session.sessionId,
              date: session.date,
              displayDate: moment(session.date)
                .locale('ru')
                .format(formatDisplayDate),
              displayTime: moment(session.date)
                .locale('ru')
                .format(formatDisplayTime),
              sessionDuration: session.sessionDuration,
              inhaleTime: session.inhaleTime,
              pdaTime: session.pdaTime,
              abbsTime: session.abbsTime,
              waterVol: session.waterVol,
              email: user.email,
            };
            return obj;
          });
          return {
            email: user.email,
            sessions: array,
            sessions_count: user.sessions_count,
          };
        })
      )
      .subscribe((user) => {
        console.log('USER', user);
        this.setUser(user);
      });
  }

  sessionsFromCloud$(email) {
    return this.http.get<User>(ALL_SESSIONS_FOR_USER(email)).pipe(
      tap((user) => {
        this.dexieIDBService.clearPdaDb();
        this.dexieIDBService.addSessionsToPdaDb(user.sessions);
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  sessionsFromIndexedDB$(email) {
    return from(this.dexieIDBService.getAllSessionsFromPdaDb(email)).pipe(
      map((sessions: Session[]) => {
        console.log('Sessions from IndexedDB', sessions);
        const user: User = {
          email: email,
          sessions: sessions,
          sessions_count: sessions.length,
        };
        return user;
      }),
      catchError((error) => {
        console.log('IndexDb sessions error', error);
        const defaultUser = { email: email, sessions: [], total_count: 0 };
        return of(defaultUser);
      })
    );
  }

  async postSession() {
    const currentUser = await this.dexieOpsService.getCurrentUserFromUserDb();
    console.log('currentUser', currentUser);

    const session: Session = {
      email: currentUser.email,
      sessionId: uuidv4(),
      date: new Date(Date.now()).getTime(),
      waterVol: this.chartControlsService.getWaterVol(),
      inhaleTime: this.chartControlsService.getInhaleValue(),
      pdaTime: this.chartControlsService.getPdaValue(),
      abbsTime: this.chartControlsService.getAbbsValue(),
      sessionDuration: this.chartControlsService.getFinalStopwatchDigitDefault(),
    };

    this.sessionToIndexedDB$(session)
      .pipe(
        switchMap(() => this.sessionToCloud$(session)),
        tap(() => {
          this.snackbar.open('Session is saved', 'Close', MessageType.INFO);
        }),
        catchError((error) => {
          this.snackbar.open(
            'Something went wrong. Session not saved',
            'Close',
            MessageType.WARNING
          );
          return of(error);
        }),
        finalize(() => {
          this.getAllSessions(session.email);
        })
      )
      .subscribe((v) => {
        console.log('POST REsponse', v);
      });
  }

  sessionToCloud$(session: Session) {
    return this.http.post<Session>(ADD_SESSION_FOR_USER(), session).pipe(
      catchError((error) => {
        console.log('YOUR SHITTY ERROR', error);
        this.dexieIDBService.addSessionToPostSync(session);
        this.backgroundSync();
        return of(session);
      })
    );
  }

  sessionToIndexedDB$(session) {
    return from(this.dexieIDBService.addSessionToPdaDb(session)).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  async deleteSession(row: Session) {
    const sessionToDelete = this.getSessionToDelete(row);
    this.deleteFromIndexDB$(sessionToDelete.sessionId)
      .pipe(
        switchMap(() => this.deleteFromCloud$(sessionToDelete)),
        finalize(() => {
          console.log('ROW from delete session', row);
          this.getAllSessions(row.email);
        })
      )
      .subscribe();
  }

  deleteFromCloud$(sessionToDelete) {
    return this.http
      .delete(
        DELELTE_SESSION_BY_ID(sessionToDelete.sessionId, sessionToDelete.email),
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        catchError((error) => {
          console.log('YOUR SHITTY delete session ERROR', error);
          this.dexieIDBService.addSessionToDelSync(sessionToDelete);
          this.backgroundSync();
          return of(sessionToDelete);
        })
      );
  }

  deleteFromIndexDB$(sessionId) {
    return from(this.dexieIDBService.deleteSessionFromPdaDb(sessionId)).pipe(
      catchError((error) => throwError(error))
    );
  }

  private getSessionToDelete(row: Session) {
    let user = this.getUser();
    let sessions = user.sessions.filter((s) => s.sessionId === row.sessionId);
    console.log('ESSS', sessions);
    return sessions[0];
  }

  backgroundSync() {
    navigator.serviceWorker.ready
      .then((swRegistration) => swRegistration.sync.register('sync-data'))
      .catch(console.log);
  }
}
