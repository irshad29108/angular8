import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTfnComponent } from './pending-tfn.component';

describe('PendingTfnComponent', () => {
  let component: PendingTfnComponent;
  let fixture: ComponentFixture<PendingTfnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingTfnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingTfnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
