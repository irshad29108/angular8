import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RingpoolComponent } from './ringpool.component';

describe('RingpoolComponent', () => {
  let component: RingpoolComponent;
  let fixture: ComponentFixture<RingpoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RingpoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RingpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
