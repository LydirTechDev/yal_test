import { Test, TestingModule } from '@nestjs/testing';
import { ExpiditeurPublicController } from './expiditeur-public.controller';
import { ExpiditeurPublicService } from './expiditeur-public.service';

describe('ExpiditeurPublicController', () => {
  let controller: ExpiditeurPublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpiditeurPublicController],
      providers: [ExpiditeurPublicService],
    }).compile();

    controller = module.get<ExpiditeurPublicController>(ExpiditeurPublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
