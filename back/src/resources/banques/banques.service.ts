import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { CreateBanqueDto } from './dto/create-banque.dto';
import { UpdateBanqueDto } from './dto/update-banque.dto';
import { Banque } from './entities/banque.entity';

@Injectable()
export class BanquesService {
  constructor(
    @InjectRepository(Banque)
    private banqueRepository: Repository<Banque>,
  ) {}

  async create(createBanqueDto: CreateBanqueDto): Promise<Banque> {
    const banque = this.banqueRepository.create(createBanqueDto);

    return await this.banqueRepository.save(banque);
  }

  findAll(): Promise<Banque[]> {
    return this.banqueRepository.find();
  }

  async findOne(id: number): Promise<Banque> {
    const banque = await this.banqueRepository.findOne(id);
    if (!banque) {
      throw new EntityNotFoundError(Banque, `banque with id ${id} not found.`);
    }
    return banque;
  }

  async update(
    id: number,
    updateBanqueDto: UpdateBanqueDto,
  ): Promise<UpdateResult> {
    if (!(await this.banqueRepository.findOne(id))) {
      throw new EntityNotFoundError(Banque, `banque with id ${id} not found.`);
    }
    return await this.banqueRepository.update(id, updateBanqueDto);
  }

  remove(id: number) {
    return `This action removes a #${id} banque`;
  }
}
