import { Test, TestingModule } from '@nestjs/testing';
import { ClientsTarifsService } from './clients-tarifs.service';

describe('ClientsTarifsService', () => {
  let service: ClientsTarifsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsTarifsService],
    }).compile();

    service = module.get<ClientsTarifsService>(ClientsTarifsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
