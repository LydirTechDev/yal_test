import { TestBed } from '@angular/core/testing';

import { PaiementsClientService } from './paiements-client.service';

describe('PaiementsClientService', () => {
  let service: PaiementsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaiementsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
