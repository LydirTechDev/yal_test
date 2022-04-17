import { Test, TestingModule } from '@nestjs/testing';
import { ClientsTarifsController } from './clients-tarifs.controller';
import { ClientsTarifsService } from './clients-tarifs.service';

describe('ClientsTarifsController', () => {
  let controller: ClientsTarifsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsTarifsController],
      providers: [ClientsTarifsService],
    }).compile();

    controller = module.get<ClientsTarifsController>(ClientsTarifsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
