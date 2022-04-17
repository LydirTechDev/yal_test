import { Test, TestingModule } from '@nestjs/testing';
import { CodeTarifsZonesController } from './code-tarifs-zones.controller';
import { CodeTarifsZonesService } from './code-tarifs-zones.service';

describe('CodeTarifsZonesController', () => {
  let controller: CodeTarifsZonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CodeTarifsZonesController],
      providers: [CodeTarifsZonesService],
    }).compile();

    controller = module.get<CodeTarifsZonesController>(CodeTarifsZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
