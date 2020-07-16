import { TestBed } from '@angular/core/testing';

import { ActiveHourService } from './active-hour.service';

describe('ActiveHourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveHourService = TestBed.get(ActiveHourService);
    expect(service).toBeTruthy();
  });
});
