import { Test, TestingModule } from '@nestjs/testing';
import { SacShipmentsController } from './sac-shipments.controller';
import { SacShipmentsService } from './sac-shipments.service';

describe('SacShipmentsController', () => {
  let controller: SacShipmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SacShipmentsController],
      providers: [SacShipmentsService],
    }).compile();

    controller = module.get<SacShipmentsController>(SacShipmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
