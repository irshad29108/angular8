import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMonitorComponent } from './manage-monitor.component';

describe('ManageMonitorComponent', () => {
  let component: ManageMonitorComponent;
  let fixture: ComponentFixture<ManageMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
