import { Test, TestingModule } from '@nestjs/testing';
import { WilayasService } from './wilayas.service';

describe('WilayasService', () => {
  let service: WilayasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WilayasService],
    }).compile();

    service = module.get<WilayasService>(WilayasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
