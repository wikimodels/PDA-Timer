import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of, from } from 'rxjs';
import { catchError, map, tap, finalize, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import * as defaults from '../../assets/utils/defaults.json';
import { v4 as uuidv4 } from 'uuid';
import {
  ALL_SESSIONS_FOR_USER,
  ADD_SESSION_FOR_USER,
  DELELTE_SESSION_BY_ID,
  ALL_USERS,
  DELELTE_USERS_BY_EMAILS,
} from '../consts/urls.consts';
import { SnackBarService } from './snackbar.service';
import { ChartControlService } from './chart-controls.service';
import { DexieDbOpsService } from './dexie-idbs-ops.service';
import { Session } from 'src/models/session.model';
import { User } from 'src/models/user';
import { MessageType } from 'src/models/message-types';
import {
  AdminPanelUser,
  AdminPanelUsersApi,
} from 'src/models/admin-panel-user';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';

const formatDisplayDate = 'DD-MM-YY';
const formatDisplayTime = 'HH:mm';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelService {
  constructor(
    private readonly http: HttpClient,
    private snackbar: SnackBarService
  ) {}

  private _adminPanelUsersSubjApi = new BehaviorSubject<AdminPanelUsersApi>(
    defaults.adminPanleUsersApi
  );

  adminPanelUsersApiSubj$ = this._adminPanelUsersSubjApi.asObservable();

  getAdminPanelUsersApi(): AdminPanelUsersApi {
    return this._adminPanelUsersSubjApi.getValue();
  }

  setAdminPanelUsersApi(usersApi: AdminPanelUsersApi) {
    this._adminPanelUsersSubjApi.next(usersApi);
  }

  getAllAdminPanelUsers() {
    console.log('GetAllUsers is running...');
    this.http
      .get<AdminPanelUser[]>(ALL_USERS())
      .pipe(
        map((users: AdminPanelUser[]) => {
          console.log('AdminUsers from Clound', users);
          const adminPanelUsers = users.map((user) => {
            const obj: AdminPanelUser = {
              _id: user._id,
              email: user.email,
              lastVisitDate: user.lastVisitDate,
              lastVisitDisplayDate: moment(user.lastVisitDate)
                .locale('ru')
                .format(formatDisplayDate),
              lastVisitDisplayTime: moment(user.lastVisitDate)
                .locale('ru')
                .format(formatDisplayTime),
              numberOfSessions: user.numberOfSessions,
              toBeDeleted: false,
            };
            return obj;
          });

          return adminPanelUsers;
        }),
        catchError((error) => {
          console.log(error);
          return of([]);
        })
      )
      .subscribe((users) => {
        const obj: AdminPanelUsersApi = {
          adminPanelUsers: users,
          adminPanelUsersCount: users.length,
        };
        console.log('ADMIN PANEL USers Api', obj);
        this.setAdminPanelUsersApi(obj);
      });
  }

  deleteUsersByEmails(users: AdminPanelUser[]) {
    const usersEmails = users.reduce((array, cur) => {
      if (cur.toBeDeleted) {
        array.push(cur.email);
      }
      return array;
    }, []);

    this.http
      .post<AdminPanelUser[]>(DELELTE_USERS_BY_EMAILS(), usersEmails)
      .pipe(
        catchError((error) => {
          console.log('USer Delete Error', error);
          return throwError(error);
        }),
        finalize(() => {
          this.getAllAdminPanelUsers();
        })
      )
      .subscribe((response) => {
        this.snackbar.open(
          `${response['deletedCount']} item(s) deleted`,
          'Close',
          MessageType.INFO
        );
      });
  }
}
