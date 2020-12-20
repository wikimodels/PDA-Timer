import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbbsControlsComponent } from './abbs-controls.component';

describe('AbbsControlsComponent', () => {
  let component: AbbsControlsComponent;
  let fixture: ComponentFixture<AbbsControlsComponent>;

  beforeEach(async(() => {
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
