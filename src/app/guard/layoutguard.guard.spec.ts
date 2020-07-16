import { TestBed, async, inject } from '@angular/core/testing';

import { LayoutguardGuard } from './layoutguard.guard';

describe('LayoutguardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutguardGuard]
    });
  });

  it('should ...', inject([LayoutguardGuard], (guard: LayoutguardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
