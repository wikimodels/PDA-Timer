import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StartPauseStopComponent } from './start-pause-stop.component';

describe('StartPauseStopComponent', () => {
  let component: StartPauseStopComponent;
  let fixture: ComponentFixture<StartPauseStopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPauseStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartPauseStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
