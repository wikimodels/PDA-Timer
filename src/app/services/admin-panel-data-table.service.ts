import { Injectable } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  AdminPanelUser,
  AdminPanelUsersApi,
} from 'src/models/admin-panel-user';
import * as defaults from '../../assets/utils/defaults.json';

@Injectable({
  providedIn: 'root',
})
export class AdminPanelDataTableService {
  previousDirection = 'desc';
  private _showDeleteUsersButtonSubj = new BehaviorSubject(false);

  showDeleteUsersButtonSubj$ = this._showDeleteUsersButtonSubj.asObservable();

  setShowDeleteButton(value: boolean) {
    this._showDeleteUsersButtonSubj.next(value);
  }
  private _allToBeDeletedSubj = new BehaviorSubject(false);

  allToBeDeletedSubj$ = this._allToBeDeletedSubj.asObservable();

  getAllToBeDeletedSubj() {
    return this._allToBeDeletedSubj.getValue();
  }

  setAllToBeDeletedSubj(value: boolean) {
    this._allToBeDeletedSubj.next(value);
  }

  tableData$(
    adminPanelUsersApi$,
    sortChange$,
    paginatorPage$
  ): Observable<AdminPanelUsersApi> {
    return combineLatest(
      adminPanelUsersApi$.pipe(startWith(defaults.adminPanleUsersApi)),
      sortChange$.pipe(startWith(defaults.sortChange)),
      paginatorPage$.pipe(startWith(defaults.sortedItem))
    ).pipe(
      map((value) => {
        let [adminPanelUsersApi, page, sort] = value;
        // adminPanelUsersApi['adminPanelUsers'].forEach(
        //   (user) => (user.toBeDeleted = false)
        // );
        // this.setAllToBeDeletedSubj(false);

        const prop =
          sort['active'] === 'lastVisitDisplayDate'
            ? 'lastVisitDate'
            : sort['active'];

        if (sort['direction'] === 'asc' && prop != 'lastVisitDate') {
          adminPanelUsersApi['adminPanelUsers'].sort(
            (a, b) => a[prop] - b[prop]
          );
        }
        if (sort['direction'] === 'desc' && prop != 'lastVistDate') {
          adminPanelUsersApi['adminPanelUsers'].sort(
            (a, b) => b[prop] - a[prop]
          );
        }

        // EMAIL PROP (A WAY TO COMPARE STRINGS)
        if (sort['direction'] === 'asc' && prop == 'email') {
          adminPanelUsersApi['adminPanelUsers'].sort((a, b) =>
            a.email.localeCompare(b.email)
          );
        }
        if (sort['direction'] === 'desc' && prop != 'lastVistDate') {
          adminPanelUsersApi['adminPanelUsers'].sort((a, b) =>
            b.email.localeCompare(a.email)
          );
        }

        if (sort['direction'] === 'asc' && prop === 'lastVisitDate') {
          adminPanelUsersApi['adminPanelUsers'].sort((a, b) => {
            return new Date(a[prop]).getTime() - new Date(b[prop]).getTime();
          });
        }

        if (sort['direction'] === 'desc' && prop === 'lastVisitDate') {
          adminPanelUsersApi['adminPanelUsers'].sort((a, b) => {
            return new Date(b[prop]).getTime() - new Date(a[prop]).getTime();
          });
        }
        if (sort['direction'] != this.previousDirection) {
          page['pageIndex'] = 0;
          this.previousDirection = sort['direction'];
        }

        const array = adminPanelUsersApi['adminPanelUsers'].slice(
          page['pageIndex'] * page['pageSize'],
          page['pageIndex'] * page['pageSize'] + page['pageSize']
        );

        const obj: AdminPanelUsersApi = {
          adminPanelUsers: array,
          adminPanelUsersCount: adminPanelUsersApi['adminPanelUsers'].length,
        };
        return obj;
      })
    );
  }
}
