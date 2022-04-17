import { Test, TestingModule } from '@nestjs/testing';
import { RecoltesController } from './recoltes.controller';
import { RecoltesService } from './recoltes.service';

describe('RecoltesController', () => {
  let controller: RecoltesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoltesController],
      providers: [RecoltesService],
    }).compile();

    controller = module.get<RecoltesController>(RecoltesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
