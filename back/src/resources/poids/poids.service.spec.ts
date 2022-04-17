import { Test, TestingModule } from '@nestjs/testing';
import { PoidsService } from './poids.service';

describe('PoidsService', () => {
  let service: PoidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoidsService],
    }).compile();

    service = module.get<PoidsService>(PoidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
