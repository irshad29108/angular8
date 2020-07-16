import { TestBed } from '@angular/core/testing';

import { ManagePublisherService } from './manage-publisher.service';

describe('ManagePublisherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManagePublisherService = TestBed.get(ManagePublisherService);
    expect(service).toBeTruthy();
  });
});
