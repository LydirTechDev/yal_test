import { Test, TestingModule } from '@nestjs/testing';
import { RecolteFactureService } from './recolte-facture.service';

describe('RecolteFactureService', () => {
  let service: RecolteFactureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecolteFactureService],
    }).compile();

    service = module.get<RecolteFactureService>(RecolteFactureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
