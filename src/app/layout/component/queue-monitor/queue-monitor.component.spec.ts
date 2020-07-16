import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueMonitorComponent } from './queue-monitor.component';

describe('QueueMonitorComponent', () => {
  let component: QueueMonitorComponent;
  let fixture: ComponentFixture<QueueMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
