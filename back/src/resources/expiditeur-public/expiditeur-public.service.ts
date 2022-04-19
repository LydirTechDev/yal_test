import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpiditeurPublicDto } from './dto/create-expiditeur-public.dto';
import { UpdateExpiditeurPublicDto } from './dto/update-expiditeur-public.dto';
import { ExpiditeurPublic } from './entities/expiditeur-public.entity';

@Injectable()
export class ExpiditeurPublicService {
  constructor(
    @InjectRepository(ExpiditeurPublic)
    private readonly expidituerPuclicRepository: Repository<ExpiditeurPublic>,
  ) {}

  async findOrCreate(createExpiditeurPublicDto: CreateExpiditeurPublicDto) {
    let expiditeur = await this.findOne(createExpiditeurPublicDto.numIdentite);
    
    if (expiditeur == null) {
      const newExp = this.expidituerPuclicRepository.create(
        createExpiditeurPublicDto,
      );
      const exp = await this.expidituerPuclicRepository.save(newExp);
      expiditeur = exp;
    }
    return expiditeur;
  }

  findAll() {
    return `This action returns all expiditeurPublic`;
  }

  async findOne(numIdentite: string) {
    let exp = await this.expidituerPuclicRepository.findOne({
      where: [{ numIdentite: numIdentite.toLowerCase() }],
    });
    if (exp) {
      return exp;
    } else {
      return null;
    }
  }

  async findOneById(id: number) {
    return await this.expidituerPuclicRepository.findOne(id);
  }

  update(id: number, updateExpiditeurPublicDto: UpdateExpiditeurPublicDto) {
    return `This action updates a #${id} expiditeurPublic`;
  }

  remove(id: number) {
    return `This action removes a #${id} expiditeurPublic`;
  }
}
