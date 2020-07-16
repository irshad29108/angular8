import { TestBed, async, inject } from '@angular/core/testing';

import { MonitorGuard } from './monitor.guard';

describe('MonitorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonitorGuard]
    });
  });

  it('should ...', inject([MonitorGuard], (guard: MonitorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
