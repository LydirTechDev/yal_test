import { Test, TestingModule } from '@nestjs/testing';
import { PmtController } from './pmt.controller';
import { PmtService } from './pmt.service';

describe('PmtController', () => {
  let controller: PmtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmtController],
      providers: [PmtService],
    }).compile();

    controller = module.get<PmtController>(PmtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
