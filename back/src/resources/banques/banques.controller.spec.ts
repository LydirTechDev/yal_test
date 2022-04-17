import { Test, TestingModule } from '@nestjs/testing';
import { BanquesController } from './banques.controller';
import { BanquesService } from './banques.service';

describe('BanquesController', () => {
  let controller: BanquesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanquesController],
      providers: [BanquesService],
    }).compile();

    controller = module.get<BanquesController>(BanquesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
