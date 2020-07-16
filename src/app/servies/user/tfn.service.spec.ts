import { TestBed } from '@angular/core/testing';

import { TfnService } from './tfn.service';

describe('TfnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TfnService = TestBed.get(TfnService);
    expect(service).toBeTruthy();
  });
});
