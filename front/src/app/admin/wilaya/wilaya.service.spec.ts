import { TestBed } from '@angular/core/testing';
import { CommuneService } from '../commune/commune.service';

import { WilayaService } from './wilaya.service';

describe('WilayaService', () => {
    let service: WilayaService;CommuneService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WilayaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
