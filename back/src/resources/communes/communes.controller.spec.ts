import { Test, TestingModule } from '@nestjs/testing';
import { CommunesController } from './communes.controller';
import { CommunesService } from './communes.service';

describe('CommunesController', () => {
  let controller: CommunesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunesController],
      providers: [CommunesService],
    }).compile();

    controller = module.get<CommunesController>(CommunesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
