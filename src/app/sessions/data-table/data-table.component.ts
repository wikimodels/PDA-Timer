import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf, timer } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DataTableService } from 'src/app/services/data-table.service';
import { SessionsStore } from 'src/app/services/sessions-store.service';
import { Session, SessionApi } from 'src/models/session.model';

export interface SortedItem {
  active: string;
  direction: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ), //Not sure if this init state is necessary here, please leave a comment and I edit this answer.
      transition(':enter', [
        style({ opacity: '0' }),
        animate('0.2s 100ms ease-in', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('0.2s ease-out', style({ opacity: '0' })),
      ]),
    ]),
  ],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['displayDate', 'pdaTime', 'sessionDuration'];
  sessions: Session[] = [];
  sortedItem: SortedItem = { active: 'date', direction: 'desc' };
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataTableService: DataTableService,
    private sessionsStore: SessionsStore
  ) {}

  ngOnInit() {}
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });
    this.dataTableService
      .tableData$(
        this.sessionsStore.userSubj$,
        this.paginator.page,
        this.sort.sortChange
      )
      .subscribe((value) => {
        console.log('Combined VAlue', value);
        setTimeout(() => {
          this.sessions = value.sessions;
          this.resultsLength = value.total_count;
        }, 0);
      });
  }

  addPDAColumn() {
    if (!this.displayedColumns.includes('pdaTime')) {
      this.displayedColumns.splice(1, 0, 'pdaTime');
    }
  }

  addInhaleColumn() {
    if (!this.displayedColumns.includes('inhaleTime')) {
      let pdaIndex = this.displayedColumns.indexOf('pdaTime');
      let inhaleIndex = pdaIndex > 0 ? pdaIndex + 1 : 1;
      this.displayedColumns.splice(inhaleIndex, 0, 'inhaleTime');
    }
    console.log(this.displayedColumns);
  }

  addAbbsColumn() {
    if (!this.displayedColumns.includes('abbsTime')) {
      let inhaleIndex = this.displayedColumns.indexOf('inhaleTime');
      let abbsIndex = inhaleIndex > 0 ? inhaleIndex + 1 : 1;
      this.displayedColumns.splice(abbsIndex, 0, 'abbsTime');
    }
  }

  addWaterVolColumn() {
    if (!this.displayedColumns.includes('waterVol')) {
      let sessionDurIndex = this.displayedColumns.indexOf('sessionDuration');
      this.displayedColumns.splice(sessionDurIndex + 1, 0, 'waterVol');
    }
  }

  addTimeColumn() {
    if (!this.displayedColumns.includes('displayTime')) {
      let sessionDurIndex = this.displayedColumns.indexOf('sessionDuration');
      let waterVolIndex = this.displayedColumns.indexOf('waterVol');
      let timeIndex =
        waterVolIndex > 0 ? waterVolIndex + 1 : sessionDurIndex + 1;
      this.displayedColumns.splice(timeIndex, 0, 'displayTime');
    }
  }

  addDeleteColumn() {
    if (!this.displayedColumns.includes('sessionId')) {
      this.displayedColumns.push('sessionId');
    }
  }

  removePDAColumn() {
    if (this.displayedColumns.includes('pdaTime')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'pdaTime'
      );
    }
  }

  removeInhaleColumn() {
    if (this.displayedColumns.includes('inhaleTime')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'inhaleTime'
      );
    }
  }

  removeAbbsColumn() {
    if (this.displayedColumns.includes('abbsTime')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'abbsTime'
      );
    }
  }

  removeTimeColumn() {
    if (this.displayedColumns.includes('displayTime')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'displayTime'
      );
    }
  }

  removeDeleteColumn() {
    if (this.displayedColumns.includes('sessionId')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'sessionId'
      );
    }
  }

  removeWaterVolColumn() {
    if (this.displayedColumns.includes('waterVol')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'waterVol'
      );
    }
  }

  deleteSession(row) {
    this.sessionsStore.deleteSession(row);
  }
}
