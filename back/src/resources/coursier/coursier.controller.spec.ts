import { Test, TestingModule } from '@nestjs/testing';
import { CoursierController } from './coursier.controller';
import { CoursierService } from './coursier.service';

describe('CoursierController', () => {
  let controller: CoursierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursierController],
      providers: [CoursierService],
    }).compile();

    controller = module.get<CoursierController>(CoursierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
