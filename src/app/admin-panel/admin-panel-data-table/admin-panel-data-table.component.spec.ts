import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminPanelDataTableComponent } from './admin-panel-data-table.component';

describe('AdminPanelDataTableComponent', () => {
  let component: AdminPanelDataTableComponent;
  let fixture: ComponentFixture<AdminPanelDataTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
