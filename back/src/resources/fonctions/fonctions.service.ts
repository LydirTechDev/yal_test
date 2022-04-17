import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { DepartementsService } from '../departements/departements.service';
import { CreateFonctionDto } from './dto/create-fonction.dto';
import { UpdateFonctionDto } from './dto/update-fonction.dto';
import { Fonction } from './entities/fonction.entity';

@Injectable()
export class FonctionsService {
  constructor(
    @InjectRepository(Fonction)
    private fonctionRepository: Repository<Fonction>,
    private departementsService: DepartementsService,
  ) {}

  async create(createFonctionDto: CreateFonctionDto): Promise<Fonction> {
    const departement = await this.departementsService.findOne(
      createFonctionDto.departementId,
    );
    const fonction = this.fonctionRepository.create(createFonctionDto);
    fonction.departement = departement;
    return await this.fonctionRepository.save(fonction);
  }

  async createFonctionByFile(fonctions) {
    console.log("🚀 ~ file: fonctions.service.ts ~ line 27 ~ FonctionsService ~ createFonctionByFile ~ fonctions", fonctions)
    for await (const fonction of fonctions) {
      const fonctionFind = await this.fonctionRepository.findOne({
        where: {
          nom: fonction.nom,
        },
      });

      if (fonctionFind == undefined) {
        console.log('hakim');
        const departement = await this.departementsService.findOne(
          fonction.departement,
        );
        console.log("🚀 ~ file: fonctions.service.ts ~ line 41 ~ FonctionsService ~ forawait ~ departement", departement)
        const func = {
          nom: fonction.nom,
          departement: departement,
        };
        // func.departement = departement;
        await this.fonctionRepository.save(func);
      }
    }
    return true;
  }

  async findAll(): Promise<Fonction[]> {
    return await this.fonctionRepository.find();
  }

  async findOne(id: number): Promise<Fonction> {
    const fonction = await this.fonctionRepository.findOne(id, {
      relations: ['departement'],
    });
    if (!fonction) {
      throw new EntityNotFoundError(
        Fonction,
        `fonction with id ${id} not found.`,
      );
    }
    return fonction;
  }

  async update(id: number, updateFonctionDto: UpdateFonctionDto) {
    await this.findOne(id);
    if (updateFonctionDto.departementId) {
      const departement = await this.departementsService.findOne(
        updateFonctionDto.departementId,
      );
      const fonction = this.fonctionRepository.create(updateFonctionDto);
      fonction.departement = departement;
      return this.fonctionRepository.update(id, fonction);
    }
    return this.fonctionRepository.update(id, updateFonctionDto);
  }
  async findFonctionByDepartementId(id: number): Promise<Fonction[]> {
    const departement = await this.departementsService.findOne(id);
    return await this.fonctionRepository.find({
      where: { departement: departement },
      relations: ['departement'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} fonction`;
  }
}
