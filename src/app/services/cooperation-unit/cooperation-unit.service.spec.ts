import { TestBed } from '@angular/core/testing';

import { CooperationUnitService } from './cooperation-unit.service';

describe('CooperationUnitService', () => {
  let service: CooperationUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CooperationUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
