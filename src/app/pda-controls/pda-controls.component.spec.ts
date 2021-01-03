import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdaControlsComponent } from './pda-controls.component';

describe('PdaControlsComponent', () => {
  let component: PdaControlsComponent;
  let fixture: ComponentFixture<PdaControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdaControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdaControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
