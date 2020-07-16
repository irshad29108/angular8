import { TestBed } from '@angular/core/testing';

import { ExtensionService } from './extension.service';

describe('ExtensionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtensionService = TestBed.get(ExtensionService);
    expect(service).toBeTruthy();
  });
});
