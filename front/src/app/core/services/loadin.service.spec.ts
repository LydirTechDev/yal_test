import { TestBed } from '@angular/core/testing';

import { LoadinService } from './loadin.service';

describe('LoadinService', () => {
  let service: LoadinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
