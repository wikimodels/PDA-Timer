import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InhaleControlsComponent } from './inhale-controls.component';

describe('InhaleControlsComponent', () => {
  let component: InhaleControlsComponent;
  let fixture: ComponentFixture<InhaleControlsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InhaleControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhaleControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
