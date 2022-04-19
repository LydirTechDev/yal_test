import { Test, TestingModule } from '@nestjs/testing';
import { ServiceClientService } from './service-client.service';

describe('ServiceClientService', () => {
  let service: ServiceClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceClientService],
    }).compile();

    service = module.get<ServiceClientService>(ServiceClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
