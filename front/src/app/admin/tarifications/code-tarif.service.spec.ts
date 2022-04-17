import { TestBed } from '@angular/core/testing';

import { CodeTarifService } from './code-tarif.service';

describe('CodeTarifService', () => {
  let service: CodeTarifService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeTarifService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
