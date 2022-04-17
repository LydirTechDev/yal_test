import { Test, TestingModule } from '@nestjs/testing';
import { CodeTarifService } from './code-tarif.service';

describe('CodeTarifService', () => {
  let service: CodeTarifService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeTarifService],
    }).compile();

    service = module.get<CodeTarifService>(CodeTarifService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
