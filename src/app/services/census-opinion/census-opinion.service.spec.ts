import { TestBed } from '@angular/core/testing';

import { CensusOpinionService } from './census-opinion.service';

describe('CensusOpinionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CensusOpinionService = TestBed.get(CensusOpinionService);
    expect(service).toBeTruthy();
  });
});
