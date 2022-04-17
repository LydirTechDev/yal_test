import { Test, TestingModule } from '@nestjs/testing';
import { EmployesService } from './employes.service';

describe('EmployesService', () => {
  let service: EmployesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployesService],
    }).compile();

    service = module.get<EmployesService>(EmployesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
