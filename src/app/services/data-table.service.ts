import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SessionApi } from 'src/models/session.model';
import * as defaults from '../../assets/utils/defaults.json';

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  previousDirection = 'desc';

  tableData$(sessionApi$, sortChange$, paginatorPage$): Observable<SessionApi> {
    return combineLatest(
      sessionApi$.pipe(startWith(defaults.sessionsApi)),
      sortChange$.pipe(startWith(defaults.sortChange)),
      paginatorPage$.pipe(startWith(defaults.sortedItem))
    ).pipe(
      map((value) => {
        console.log('sessionApi', value);
        let [sessionApi, page, sort] = value;

        const prop = sort['active'] === 'displayDate' ? 'date' : sort['active'];

        if (sort['direction'] === 'asc' && prop != 'date') {
          sessionApi['sessions'].sort((a, b) => a[prop] - b[prop]);
        }
        if (sort['direction'] === 'desc' && prop != 'date') {
          sessionApi['sessions'].sort((a, b) => b[prop] - a[prop]);
        }
        if (sort['direction'] === 'asc' && prop === 'date') {
          sessionApi['sessions'].sort((a, b) => {
            return new Date(a[prop]).getTime() - new Date(b[prop]).getTime();
          });
        }
        if (sort['direction'] === 'desc' && prop === 'date') {
          sessionApi['sessions'].sort((a, b) => {
            return new Date(b[prop]).getTime() - new Date(a[prop]).getTime();
          });
        }
        if (sort['direction'] != this.previousDirection) {
          page['pageIndex'] = 0;
          this.previousDirection = sort['direction'];
        }

        const array = sessionApi['sessions'].slice(
          page['pageIndex'] * page['pageSize'],
          page['pageIndex'] * page['pageSize'] + page['pageSize']
        );

        return { sessions: array, total_count: sessionApi['sessions'].length };
      })
    );
  }
}
