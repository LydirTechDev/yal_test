import { Test, TestingModule } from '@nestjs/testing';
import { PmtCoursierService } from './pmt-coursier.service';

describe('PmtCoursierService', () => {
  let service: PmtCoursierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmtCoursierService],
    }).compile();

    service = module.get<PmtCoursierService>(PmtCoursierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
