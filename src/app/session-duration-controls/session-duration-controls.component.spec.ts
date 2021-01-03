import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionDurationControlsComponent } from './session-duration-controls.component';

describe('SessionDurationControlsComponent', () => {
  let component: SessionDurationControlsComponent;
  let fixture: ComponentFixture<SessionDurationControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionDurationControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionDurationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
