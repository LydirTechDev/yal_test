import { Test, TestingModule } from '@nestjs/testing';
import { DepartementsController } from './departements.controller';
import { DepartementsService } from './departements.service';

describe('DepartementsController', () => {
  let controller: DepartementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartementsController],
      providers: [DepartementsService],
    }).compile();

    controller = module.get<DepartementsController>(DepartementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
