import { TestBed } from '@angular/core/testing';

import { ManageQueueService } from './manage-queue.service';

describe('ManageQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageQueueService = TestBed.get(ManageQueueService);
    expect(service).toBeTruthy();
  });
});
