import { TestBed } from '@angular/core/testing';

import { DenitymapService } from './denitymap.service';

describe('DenitymapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DenitymapService = TestBed.get(DenitymapService);
    expect(service).toBeTruthy();
  });
});
