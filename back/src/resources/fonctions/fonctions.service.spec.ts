import { Test, TestingModule } from '@nestjs/testing';
import { FonctionsService } from './fonctions.service';

describe('FonctionsService', () => {
  let service: FonctionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FonctionsService],
    }).compile();

    service = module.get<FonctionsService>(FonctionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
