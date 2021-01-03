import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbbsControlsComponent } from './abbs-controls.component';

describe('AbbsControlsComponent', () => {
  let component: AbbsControlsComponent;
  let fixture: ComponentFixture<AbbsControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AbbsControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbbsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
