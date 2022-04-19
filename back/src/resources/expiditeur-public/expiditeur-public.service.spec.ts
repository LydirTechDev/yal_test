import { Test, TestingModule } from '@nestjs/testing';
import { ExpiditeurPublicService } from './expiditeur-public.service';

describe('ExpiditeurPublicService', () => {
  let service: ExpiditeurPublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpiditeurPublicService],
    }).compile();

    service = module.get<ExpiditeurPublicService>(ExpiditeurPublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
