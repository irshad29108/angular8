import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeBuyerComponent } from './realtime-buyer.component';

describe('RealtimeBuyerComponent', () => {
  let component: RealtimeBuyerComponent;
  let fixture: ComponentFixture<RealtimeBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
