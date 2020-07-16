import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveHoursComponent } from './active-hours.component';

describe('ActiveHoursComponent', () => {
  let component: ActiveHoursComponent;
  let fixture: ComponentFixture<ActiveHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
