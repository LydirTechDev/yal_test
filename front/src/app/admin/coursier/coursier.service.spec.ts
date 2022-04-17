import { TestBed } from '@angular/core/testing';

import { CoursierService } from './coursier.service';

describe('CoursierService', () => {
  let service: CoursierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
