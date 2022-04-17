import { Test, TestingModule } from '@nestjs/testing';
import { PoidsController } from './poids.controller';
import { PoidsService } from './poids.service';

describe('PoidsController', () => {
  let controller: PoidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoidsController],
      providers: [PoidsService],
    }).compile();

    controller = module.get<PoidsController>(PoidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
