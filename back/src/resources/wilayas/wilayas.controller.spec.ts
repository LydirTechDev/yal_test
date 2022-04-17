import { Test, TestingModule } from '@nestjs/testing';
import { WilayasController } from './wilayas.controller';
import { WilayasService } from './wilayas.service';

describe('WilayasController', () => {
  let controller: WilayasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WilayasController],
      providers: [WilayasService],
    }).compile();

    controller = module.get<WilayasController>(WilayasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
