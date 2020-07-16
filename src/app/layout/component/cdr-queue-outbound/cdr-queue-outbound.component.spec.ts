import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdrQueueOutboundComponent } from './cdr-queue-outbound.component';

describe('CdrQueueOutboundComponent', () => {
  let component: CdrQueueOutboundComponent;
  let fixture: ComponentFixture<CdrQueueOutboundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdrQueueOutboundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdrQueueOutboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
