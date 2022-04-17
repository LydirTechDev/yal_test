import { Test, TestingModule } from '@nestjs/testing';
import { CommunesService } from './communes.service';

describe('CommunesService', () => {
  let service: CommunesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunesService],
    }).compile();

    service = module.get<CommunesService>(CommunesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
