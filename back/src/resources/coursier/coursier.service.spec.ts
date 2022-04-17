import { Test, TestingModule } from '@nestjs/testing';
import { CoursierService } from './coursier.service';

describe('CoursierService', () => {
  let service: CoursierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursierService],
    }).compile();

    service = module.get<CoursierService>(CoursierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
