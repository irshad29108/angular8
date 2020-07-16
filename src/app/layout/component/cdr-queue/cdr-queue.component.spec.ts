import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrQueueComponent } from './cdr-queue.component';

describe('CdrQueueComponent', () => {
  let component: CdrQueueComponent;
  let fixture: ComponentFixture<CdrQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdrQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdrQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
