import { TestBed } from '@angular/core/testing';

import { ManageBuyersService } from './manage-buyers.service';

describe('ManageBuyersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageBuyersService = TestBed.get(ManageBuyersService);
    expect(service).toBeTruthy();
  });
});
