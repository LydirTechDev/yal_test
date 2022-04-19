import { Test, TestingModule } from '@nestjs/testing';
import { ServiceClientController } from './service-client.controller';
import { ServiceClientService } from './service-client.service';

describe('ServiceClientController', () => {
  let controller: ServiceClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceClientController],
      providers: [ServiceClientService],
    }).compile();

    controller = module.get<ServiceClientController>(ServiceClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
