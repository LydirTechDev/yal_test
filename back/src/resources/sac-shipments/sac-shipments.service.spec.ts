import { Test, TestingModule } from '@nestjs/testing';
import { SacShipmentsService } from './sac-shipments.service';

describe('SacShipmentsService', () => {
  let service: SacShipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SacShipmentsService],
    }).compile();

    service = module.get<SacShipmentsService>(SacShipmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
