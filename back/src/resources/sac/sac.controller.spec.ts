import { Test, TestingModule } from '@nestjs/testing';
import { SacController } from './sac.controller';
import { SacService } from './sac.service';

describe('SacController', () => {
  let controller: SacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SacController],
      providers: [SacService],
    }).compile();

    controller = module.get<SacController>(SacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
