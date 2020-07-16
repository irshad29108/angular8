import { TestBed } from '@angular/core/testing';

import { PublisherModalService } from './publisher-modal.service';

describe('PublisherModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PublisherModalService = TestBed.get(PublisherModalService);
    expect(service).toBeTruthy();
  });
});
