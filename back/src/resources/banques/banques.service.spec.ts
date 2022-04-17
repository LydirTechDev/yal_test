import { Test, TestingModule } from '@nestjs/testing';
import { BanquesService } from './banques.service';

describe('BanquesService', () => {
  let service: BanquesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanquesService],
    }).compile();

    service = module.get<BanquesService>(BanquesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
