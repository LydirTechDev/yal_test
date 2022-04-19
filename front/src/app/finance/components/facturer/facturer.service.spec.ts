import { TestBed } from '@angular/core/testing';

import { FacturerService } from './facturer.service';

describe('FacturerService', () => {
  let service: FacturerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
