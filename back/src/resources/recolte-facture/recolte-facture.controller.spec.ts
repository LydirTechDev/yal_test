import { Test, TestingModule } from '@nestjs/testing';
import { RecolteFactureController } from './recolte-facture.controller';
import { RecolteFactureService } from './recolte-facture.service';

describe('RecolteFactureController', () => {
  let controller: RecolteFactureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecolteFactureController],
      providers: [RecolteFactureService],
    }).compile();

    controller = module.get<RecolteFactureController>(RecolteFactureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
