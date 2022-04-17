import { Test, TestingModule } from '@nestjs/testing';
import { FonctionsController } from './fonctions.controller';
import { FonctionsService } from './fonctions.service';

describe('FonctionsController', () => {
  let controller: FonctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FonctionsController],
      providers: [FonctionsService],
    }).compile();

    controller = module.get<FonctionsController>(FonctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
