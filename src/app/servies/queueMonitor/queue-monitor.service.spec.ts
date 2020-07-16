import { TestBed } from '@angular/core/testing';

import { QueueMonitorService } from './queue-monitor.service';

describe('QueueMonitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueueMonitorService = TestBed.get(QueueMonitorService);
    expect(service).toBeTruthy();
  });
});
