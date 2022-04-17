import { Test, TestingModule } from '@nestjs/testing';
import { CodeTarifController } from './code-tarif.controller';
import { CodeTarifService } from './code-tarif.service';

describe('CodeTarifController', () => {
  let controller: CodeTarifController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTarifController],
      providers: [CodeTarifService],
    }).compile();

    controller = module.get<CodeTarifController>(CodeTarifController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
