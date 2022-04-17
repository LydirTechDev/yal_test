import { Test, TestingModule } from '@nestjs/testing';
import { AgencesService } from './agences.service';

describe('AgencesService', () => {
  let service: AgencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgencesService],
    }).compile();

    service = module.get<AgencesService>(AgencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
