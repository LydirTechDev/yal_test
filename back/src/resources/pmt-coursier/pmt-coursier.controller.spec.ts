import { Test, TestingModule } from '@nestjs/testing';
import { PmtCoursierController } from './pmt-coursier.controller';
import { PmtCoursierService } from './pmt-coursier.service';

describe('PmtCoursierController', () => {
  let controller: PmtCoursierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PmtCoursierController],
      providers: [PmtCoursierService],
    }).compile();

    controller = module.get<PmtCoursierController>(PmtCoursierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
