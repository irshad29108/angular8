import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeTfnComponent } from './realtime-tfn.component';

describe('RealtimeTfnComponent', () => {
  let component: RealtimeTfnComponent;
  let fixture: ComponentFixture<RealtimeTfnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeTfnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeTfnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
