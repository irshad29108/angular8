import { TestBed } from '@angular/core/testing';

import { CdrService } from './cdr.service';

describe('CdrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CdrService = TestBed.get(CdrService);
    expect(service).toBeTruthy();
  });
});
