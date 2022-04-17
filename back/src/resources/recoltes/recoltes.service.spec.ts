import { Test, TestingModule } from '@nestjs/testing';
import { RecoltesService } from './recoltes.service';

describe('RecoltesService', () => {
  let service: RecoltesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecoltesService],
    }).compile();

    service = module.get<RecoltesService>(RecoltesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
