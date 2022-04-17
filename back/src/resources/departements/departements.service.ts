import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository, UpdateResult } from 'typeorm';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { Departement } from './entities/departement.entity';

@Injectable()
export class DepartementsService {
  
  constructor(
    @InjectRepository(Departement)
    private departementRepository: Repository<Departement>
  ){}
  
  async create(createDepartementDto: CreateDepartementDto): Promise<Departement> {
    const departement = this.departementRepository.create(createDepartementDto);
    return await this.departementRepository.save(departement);
  }

  async findAll(): Promise<Departement[]> {
    return await this.departementRepository.find();
  }

  async findOne(id: number): Promise<Departement> {
    const departement = await this.departementRepository.findOne(id,{
      relations: ['fonctions']
    });
    if (!departement) {
      throw new EntityNotFoundError(Departement,`departement with id ${id} not found.`);
    }
    return departement;
  }

  async update(id: number, updateDepartementDto: UpdateDepartementDto): Promise<UpdateResult> {
    await this.findOne(id);
    return await this.departementRepository.update(id, updateDepartementDto);
  }

  remove(id: number) {
    return `This action removes a #${id} departement`;
  }
}
