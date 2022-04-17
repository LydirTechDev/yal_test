import { TestBed } from '@angular/core/testing';

import { LocalStoreManagerService } from './local-store-manager.service';

describe('LocalStoreManagerService', () => {
  let service: LocalStoreManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStoreManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
