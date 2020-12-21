import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { of } from 'rxjs';
import { from } from 'rxjs';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';

import { AdminPanelDataTableService } from 'src/app/services/admin-panel-data-table.service';
import { AdminPanelService } from 'src/app/services/admin-panel.service';
import { SortedItem } from 'src/app/sessions/data-table/data-table.component';
import {
  AdminPanelUser,
  AdminPanelUsersApi,
} from 'src/models/admin-panel-user';

@Component({
  selector: 'app-admin-panel-data-table',
  templateUrl: './admin-panel-data-table.component.html',
  styleUrls: ['./admin-panel-data-table.component.css'],
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
export class AdminPanelDataTableComponent implements OnInit, AfterViewChecked {
  displayedColumns: string[] = ['email', 'lastVisitDisplayDate'];
  adminPanelUsers: AdminPanelUser[] = [];
  showButton = false;
  sortedItem: SortedItem = { active: 'date', direction: 'desc' };
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchForm = new FormControl('');
  allToBeDeleted = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dataTableService: AdminPanelDataTableService,
    private adminPanelService: AdminPanelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(400),
        switchMap((value) => {
          console.log('*****SEARCH VALUE', value);
          const users = this.adminPanelService.getAdminPanelUsersApi()
            .adminPanelUsers;
          let searchSelection = users.filter((user) =>
            user.email.includes(value)
          );
          searchSelection.forEach((item) => (item.toBeDeleted = false));
          this.dataTableService.setAllToBeDeletedSubj(false);

          const obj: AdminPanelUsersApi = {
            adminPanelUsersCount: searchSelection.length,
            adminPanelUsers: searchSelection,
          };
          return of(obj);
        }),
        switchMap((value) =>
          this.dataTableService.tableData$(
            of(value),
            this.paginator.page,
            this.sort.sortChange
          )
        )
      )
      .subscribe((value: AdminPanelUsersApi) => {
        //console.log('****SUBSCR VALUE', val);
        this.adminPanelUsers = value.adminPanelUsers;
        this.resultsLength = value.adminPanelUsersCount;
        //this.updateAllToBeDeleted();
      });
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe((value) => {
      this.paginator.pageIndex = 0;
    });

    this.dataTableService
      .tableData$(
        this.adminPanelService.adminPanelUsersApiSubj$,
        this.paginator.page,
        this.sort.sortChange
      )
      .subscribe((value) => {
        this.adminPanelUsers = value.adminPanelUsers;
        this.resultsLength = value.adminPanelUsersCount;
        this.adminPanelUsers.forEach((item) => (item.toBeDeleted = false));
        this.dataTableService.setAllToBeDeletedSubj(false);
      });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  addLastVisitDisplayDateColumn() {
    if (!this.displayedColumns.includes('lastVisitDisplayDate')) {
      this.displayedColumns.splice(1, 0, 'lastVisitDisplayDate');
    }
  }

  addLastVisitDisplayTimeColumn() {
    if (!this.displayedColumns.includes('lastVisitDisplayTime')) {
      let previousColumn = this.displayedColumns.indexOf(
        'lastVisitDisplayDate'
      );
      let currentColumn = previousColumn > 0 ? previousColumn + 1 : 1;
      this.displayedColumns.splice(currentColumn, 0, 'lastVisitDisplayTime');
    }
  }

  addNumberOfSessionsColumn() {
    if (!this.displayedColumns.includes('numberOfSessions')) {
      let previousColumn = this.displayedColumns.indexOf(
        'lastVisitDisplayDate'
      );
      let currentColumn = previousColumn > 0 ? previousColumn + 1 : 1;
      this.displayedColumns.splice(currentColumn, 0, 'numberOfSessions');
    }
  }

  addDeleteSessionsColumn() {
    if (!this.displayedColumns.includes('delete')) {
      this.displayedColumns.push('delete');
    }
  }

  removeLastVisitDisplayDateColumn() {
    if (this.displayedColumns.includes('lastVisitDisplayDate')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'lastVisitDisplayDate'
      );
    }
  }

  removeLastVisitDisplayTimeColumn() {
    if (this.displayedColumns.includes('lastVisitDisplayTime')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'lastVisitDisplayTime'
      );
    }
  }

  removeNumberOfSessionsColumn() {
    if (this.displayedColumns.includes('numberOfSessions')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'numberOfSessions'
      );
    }
  }

  removeDeleteSessionsColumn() {
    if (this.displayedColumns.includes('delete')) {
      this.displayedColumns = this.displayedColumns.filter(
        (el) => el != 'delete'
      );
    }
    this.setAllToBeDeleted(false);
  }

  deleteUsers() {
    console.log(this.adminPanelUsers);
    this.adminPanelService.deleteUsersByEmails(this.adminPanelUsers);
  }

  updateAllToBeDeleted() {
    const allToBeDeleted =
      this.adminPanelUsers.length != 0 &&
      this.adminPanelUsers.every((u) => u.toBeDeleted);
    this.dataTableService.setAllToBeDeletedSubj(allToBeDeleted);
  }

  setAllToBeDeleted(toBeDeleted: boolean) {
    if (this.adminPanelUsers.length == 0) {
      return;
    }
    this.adminPanelUsers.forEach((user) => (user.toBeDeleted = toBeDeleted));
    this.showDeleteUsersButton();
    this.dataTableService.setAllToBeDeletedSubj(toBeDeleted);
  }

  someToBeDeleted(): boolean {
    if (this.adminPanelUsers.length == 0) {
      return false;
    }
    const toBeDeleted =
      this.adminPanelUsers.filter((u) => u.toBeDeleted).length > 0 &&
      !this.dataTableService.getAllToBeDeletedSubj();

    this.showDeleteUsersButton();
    return toBeDeleted;
  }

  private showDeleteUsersButton() {
    this.showButton = this.adminPanelUsers.some(
      (value) => value.toBeDeleted === true
    );
  }
}
