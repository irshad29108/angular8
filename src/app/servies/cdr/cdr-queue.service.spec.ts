import { TestBed } from '@angular/core/testing';

import { CdrQueueService } from './cdr-queue.service';

describe('CdrQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CdrQueueService = TestBed.get(CdrQueueService);
    expect(service).toBeTruthy();
  });
});
