import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { link } from 'fs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AgencesTypesEnum } from 'src/enums/agencesTypesEnum';
import { EntityNotFoundError, ILike, Repository, UpdateResult } from 'typeorm';
import { CommunesService } from '../communes/communes.service';
import { EmployesService } from '../employes/employes.service';
import { CreateAgenceDto } from './dto/create-agence.dto';
import { UpdateAgenceDto } from './dto/update-agence.dto';
import { Agence } from './entities/agence.entity';

@Injectable()
export class AgencesService {
  logger = new Logger(AgencesService.name);

  /**
   * AgenceService dependencies
   * agenceRepository for Agence Entity
   * CommuneService to use commune function
   * @param agenceRepository
   * @param communeService
   */
  constructor(
    @InjectRepository(Agence)
    private agenceRepository: Repository<Agence>,
    @Inject(forwardRef(() => CommunesService))
    private communeService: CommunesService,
    @Inject(forwardRef(() => EmployesService))
    private employeService: EmployesService,
  ) {}

  /**
   * create new agence instance
   * get commune of this agence
   * get last id in agence tabel
   * generate code agence with last id and codePostal commune
   * save new agence instance
   * @param createAgenceDto
   * @returns
   */
  async create(createAgenceDto: CreateAgenceDto): Promise<Agence> {
    const commune = await this.communeService.findOne(
      createAgenceDto.communeId,
    );
    const lasteAgence = await this.agenceRepository.count();
    const agence = this.agenceRepository.create(createAgenceDto);
    agence.code = lasteAgence + '-' + commune.codePostal;
    agence.commune = commune;
    return this.agenceRepository.save(agence);
  }


  /**
   * get wilaya frome agence by agenceId
   * @param agenceId
   * @returns
   */
  async getWilayaFromeAgence(agenceId: number) {
    const wilayaAgenceSelected = await this.agenceRepository
      .createQueryBuilder('agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(`agence.id = ${agenceId}`)
      .select('wilaya')
      .getRawOne();

    console.log(
      '🚀 ~ file: agences.service.ts ~ line 59 ~ AgencesService ~ getWilayaFromeAgence ~ wilayaAgenceSelected',
      wilayaAgenceSelected,
    );

    if (wilayaAgenceSelected) {
      return wilayaAgenceSelected;
    } else {
      throw new EntityNotFoundError(Agence, 'Not Fond');
    }
  }

  /**
   * find all agences
   * @returns
   */
  async findAllAgence(): Promise<Agence[]> {
    const agences = await this.agenceRepository.find({
      relations: ['commune.wilaya', 'commune'],
    });
    if (agences.length < 0) {
      throw new EntityNotFoundError(Agence, 'agence is empty');
    }
    return agences;
  }

  /**
   * find all agence
   * filter by type agence
   * @param typeAgence
   * @returns
   */
  async findFiltredAgence(typeAgence?: string): Promise<Agence[]> {
    console.log(
      '🚀 ~ file: agences.service.ts ~ line 100 ~ AgencesService ~ findFiltredAgence ~ typeAgence',
      typeAgence,
    );
    let agences;
    if (typeAgence.length > 0) {
      agences = await this.agenceRepository.find({
        where: {
          type: AgencesTypesEnum[typeAgence],
        },
      });
    }
    if (agences <= 0) {
      throw new EntityNotFoundError(Agence, 'No Agences');
    }
    return agences;
  }
  /**
   * find all paginate agences
   * find agence by serch
   * find agence by defind limit nb items to select or n° page
   * @param optoins
   * @param searchAgenceTerm
   * @returns
   */
  async findPaginatesAgence(
    optoins: IPaginationOptions,
    searchAgenceTerm?: string,
  ): Promise<Pagination<Agence>> {
    this.logger.debug(this.findAllAgence.name);
    let agences;
    if (searchAgenceTerm && Number(searchAgenceTerm) != NaN) {
      agences = paginate<Agence>(
        this.agenceRepository,
        {
          page: optoins.page,
          limit: optoins.limit,
          route: 'http://localhost:3000/agences/paginateAgence',
        },
        {
          relations: ['commune', 'commune.wilaya'],
          where: [
            { nom: ILike(`%${searchAgenceTerm}%`) },
            { code: ILike(`%${searchAgenceTerm}%`) },
            { adresse: ILike(`%${searchAgenceTerm}%`) },
            {
              commune: {
                codePostal: ILike(`%${searchAgenceTerm}%`),
              },
            },
            {
              commune: {
                nomArabe: ILike(`%${searchAgenceTerm}%`),
              },
            },
            {
              commune: {
                nomLatin: ILike(`%${searchAgenceTerm}%`),
              },
            },
            {
              commune: {
                wilaya: {
                  nomLatin: ILike(`%${searchAgenceTerm}%`),
                },
              },
            },
            {
              commune: {
                wilaya: {
                  nomArabe: ILike(`%${searchAgenceTerm}%`),
                },
              },
            },
            {
              commune: {
                wilaya: {
                  codeWilaya: ILike(`%${searchAgenceTerm}%`),
                },
              },
            },
          ],
        },
      );
    } else {
      agences = paginate<Agence>(
        this.agenceRepository,
        {
          page: optoins.page,
          limit: optoins.limit,
          route: 'http://localhost:3000/agences/paginateAgence',
        },
        {
          relations: ['commune', 'commune.wilaya'],
        },
      );
    }
    if ((await agences).items.length <= 0) {
      throw new EntityNotFoundError(Agence, 'No Agences');
    }
    return agences;
  }

  async findOneAgenceById(id: number): Promise<Agence> {
    const agence = await this.agenceRepository.findOne(id, {
      relations: ['commune', 'commune.wilaya'],
    });
    console.log(
      '🚀 ~ file: agences.service.ts ~ line 211 ~ AgencesService ~ findOneAgenceById ~ agence',
      agence,
    );
    if (agence) {
      return agence;
    } else {
      throw new EntityNotFoundError(
        Agence,
        `l'agence d'id ${id} n'existe  pas`,
      );
    }
  }

  async findOneV2(id: number): Promise<Agence> {
    const agence = await this.agenceRepository.findOne(id, {
      relations: ['commune', 'commune.wilaya'],
    });
    if (!agence) {
      throw new EntityNotFoundError(Agence, `agence with id ${id} not found`);
    }
    return agence;
  }

  async update(
    id: number,
    updateAgenceDto: UpdateAgenceDto,
  ): Promise<UpdateResult> {
    await this.findOneAgenceById(id);
    if (updateAgenceDto.communeId) {
      const agence = this.agenceRepository.create(updateAgenceDto);
      const commune = await this.communeService.findOne(
        updateAgenceDto.communeId,
      );
      agence.commune = commune;
      return await this.agenceRepository.update(id, agence);
    }
    return await this.agenceRepository.update(id, updateAgenceDto);
  }

  async findAgenceByCommune(communeId: number): Promise<Agence[]> {
    const agences = await this.agenceRepository.find({
      relations: ['commune'],
      where: {
        commune: {
          id: communeId,
          livraisonStopDesck: true,
        },
      },
    });
    return agences;
  }
  async getListAgencesInMyWilaya(user) {
    const listAgences = [];
    const informationUser = await this.employeService.getwilayaByUserId(
      user.id,
    );
    const agences = await this.agenceRepository.find({
      relations: ['commune', 'commune.wilaya'],
      where: {
        commune: {
          wilaya: {
            id: informationUser.wilaya_id,
          },
        },
        type: AgencesTypesEnum.bureau,
      },
    });
    for await (const agence of agences) {
      console.log(agence.id, informationUser.wilaya_id);
      if (agence.id !== informationUser.agence_id) {
        listAgences.push(agence);
      }
    }
    if (listAgences.length > 0) {
      return listAgences;
    }
    return [];
  }

  async getStationByLastStatus(statusShipment: any) {
    const stationLastStatus = await this.agenceRepository
      .createQueryBuilder('agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `agence.id = ${statusShipment[statusShipment.length - 1].createdOn.id}`,
      )
      .getRawOne();

    return stationLastStatus;
  }

  async findAgenceByWilayaId(wilayaId: number): Promise<Agence[]> {
    const agences = await this.agenceRepository.find({
      relations: ['commune', 'commune.wilaya'],
      where: {
        commune: {
          wilaya: {
            id: wilayaId,
          },
        },
      },
    })
    return agences;
  }
}
