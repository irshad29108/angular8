import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveBuyerHourComponent } from './active-buyer-hour.component';

describe('ActiveBuyerHourComponent', () => {
  let component: ActiveBuyerHourComponent;
  let fixture: ComponentFixture<ActiveBuyerHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveBuyerHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveBuyerHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
