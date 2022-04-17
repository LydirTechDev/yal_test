import { Test, TestingModule } from '@nestjs/testing';
import { PmtService } from './pmt.service';

describe('PmtService', () => {
  let service: PmtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PmtService],
    }).compile();

    service = module.get<PmtService>(PmtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
