import { Test, TestingModule } from '@nestjs/testing';
import { CodeTarifsZonesService } from './code-tarifs-zones.service';

describe('CodeTarifsZonesService', () => {
  let service: CodeTarifsZonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeTarifsZonesService],
    }).compile();

    service = module.get<CodeTarifsZonesService>(CodeTarifsZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
