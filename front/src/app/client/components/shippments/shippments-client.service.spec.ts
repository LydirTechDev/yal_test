import { TestBed } from '@angular/core/testing';

import { ShippmentsClientService } from './shippments-client.service';

describe('ShippmentsClientService', () => {
  let service: ShippmentsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippmentsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
