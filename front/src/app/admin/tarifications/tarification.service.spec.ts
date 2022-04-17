import { TestBed } from '@angular/core/testing';

import { TarificationService } from './tarification.service';

describe('TarificationService', () => {
  let service: TarificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
