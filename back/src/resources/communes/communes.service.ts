import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, ILike, Repository, UpdateResult } from 'typeorm';
import { WilayasService } from '../wilayas/wilayas.service';
import { CreateCommuneDto } from './dto/create-commune.dto';
import { UpdateCommuneDto } from './dto/update-commune.dto';
import { Commune } from './entities/commune.entity';

@Injectable()
export class CommunesService {
  logger = new Logger(CommunesService.name);

  /**
   * CommunesService dependencies
   * communeRepository for Commune Entity
   * wilayaService to use wilaya functions
   * @param communeRepository
   * @param wilayaService
   */
  constructor(
    @InjectRepository(Commune)
    private communeRepository: Repository<Commune>,
    @Inject(forwardRef(() => WilayasService))
    private wilayaService: WilayasService,
  ) {}

  /**
   * create new commune instance
   * get wilaya of this commance
   * save new commune instance
   * @param createCommuneDto
   * @returns
   */
  async create(createCommuneDto: CreateCommuneDto) {
    const wilaya = await this.wilayaService.findOne(createCommuneDto.wilayaId);
    const { wilayaId, ...commune } = createCommuneDto;
    const createCommune = this.communeRepository.create(commune);
    createCommune.wilaya = wilaya;
    return await this.communeRepository.save(createCommune);
  }
  async createCommuneByFile(createCommunesDto: CreateCommuneDto[]) {
    for await (const createCommuneDto of createCommunesDto) {
      const commune = await this.communeRepository.findOne({
        where: {
          codePostal: createCommuneDto.codePostal.toString(),
        },
      });
      if (!commune) {
        const wilaya = await this.wilayaService.findOneByCodeWilaya(
          createCommuneDto.wilayaId.toString(),
        );
        if (wilaya) {
          const { wilayaId, ...commune } = createCommuneDto;
          const createCommune = this.communeRepository.create(commune);
          createCommune.wilaya = wilaya;
          await this.communeRepository.save(createCommune);
        }
      }
    }
    return true;
  }
  /**
   * find all communes
   * @returns
   */
  async findAllCommune(): Promise<Commune[]> {
    const communes = await this.communeRepository.find({
      relations: ['wilaya'],
    });

    if (communes.length <= 0) {
      throw new EntityNotFoundError(Commune, 'No Communes');
    }
    return communes;
  }

  async findAllCommuneByWilayaId(wilayaId: number): Promise<Commune[]> {
    const communes = await this.communeRepository.find({
      relations: ['wilaya'],
      where: {
        wilaya: {
          id: wilayaId,
        },
      },
    });

    if (communes.length <= 0) {
      throw new EntityNotFoundError(Commune, 'No Communes');
    }
    return communes;
  }
  /**
   * find all and paginate commune
   * search commune
   *
   * @param options
   * @param searchCommuneTerm
   * @returns
   */
  async findPaginateCommune(
    options: IPaginationOptions,
    searchCommuneTerm?: string,
  ): Promise<Pagination<Commune>> {
    this.logger.debug(this.findPaginateCommune.name);
    let communes;
    if (searchCommuneTerm && Number(searchCommuneTerm) != NaN) {
      communes = paginate<Commune>(
        this.communeRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/communes/paginateCommune',
        },
        {
          where: [
            { codePostal: ILike(`%${searchCommuneTerm}%`) },
            { nomLatin: ILike(`%${searchCommuneTerm}%`) },
            { nomArabe: ILike(`%${searchCommuneTerm}%`) },
            {
              wilaya: {
                nomLatin: ILike(`%${searchCommuneTerm}%`),
              },
            },
            {
              wilaya: {
                nomArabe: ILike(`%${searchCommuneTerm}%`),
              },
            },
            {
              wilaya: {
                codeWilaya: ILike(`%${searchCommuneTerm}%`),
              },
            },
          ],
          relations: ['wilaya'],
        },
      );
    } else {
      communes = paginate<Commune>(
        this.communeRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/communes/paginateCommune',
        },
        {
          relations: ['wilaya'],
          order: { createdAt: 'DESC' },
        },
      );
    }
    if ((await communes).items.length <= 0) {
      throw new EntityNotFoundError(Commune, 'No Communes');
    }
    return communes;
  }

  /**
   * #####################################################################
   */
  async findAllV2(): Promise<Commune[]> {
    const communes = await this.communeRepository.find({
      relations: ['wilaya'],
    });
    if (communes.length < 0) {
      throw new EntityNotFoundError(Commune, 'commune is empty');
    }
    return communes;
  }

  async findAllByWilayaIdAndTypeLivraison(
    wilayaId: number,
    livraisonStopDesck: boolean,
  ) {
    // const wilaya = await this.wilayaService.findOne(wilayaId);

    if (livraisonStopDesck) {
      return await this.communeRepository.find({
        relations: ['wilaya'],
        // where: {
        //   wilaya: {
        //     id: wilayaId
        //   },
        //   livraisonStopDesck: true,
        // },
        where: [{ wilaya: { id: wilayaId }, livraisonStopDesck: true }],
      });
    } else {
      return await this.communeRepository.find({
        relations: ['wilaya'],
        // where: {
        //   wilaya: wilaya,
        //   livraisonDomicile: true,
        // },
        where: [{ wilaya: { id: wilayaId }, livraisonDomicile: true }],
      });
    }
  }

  async findOne(id: number) {
    const response = await this.communeRepository.findOne({
      where: {
        id: id,
      },
      relations: ['wilaya'],
    });
    if (response) {
      return response;
    } else {
      throw new EntityNotFoundError(
        Commune,
        `la commune d'id ${id} n'existe pas`,
      );
    }
  }

  async findOneByWilayaId(id: number): Promise<Commune[]> {
    const wilaya = await this.wilayaService.findOne(id);
    console.log(
      '🚀 ~ file: communes.service.ts ~ line 39 ~ CommunesService ~ findOneByWilayaId ~ id',
      id,
    );
    return await this.communeRepository.find({
      relations: ['wilaya'],
      where: { wilaya: wilaya },
    });
  }
  /**
   *     const wilayaDepart = await this.communeRepository.findOne({
      relations: ['wilaya'],
      where: {
        id: packageSlip.packageSlip_communeId,
      },
    });
   */
  async getWilayaOfCommune(communeId: number) {
    const wilaya = this.communeRepository.findOne({
      relations: ['wilaya'],
      where: {
        id: communeId,
      },
    });
    if (wilaya) {
      return wilaya;
    } else {
      throw new EntityNotFoundError(Commune, communeId);
    }
  }

  async update(
    id: number,
    updateCommuneDto: UpdateCommuneDto,
  ): Promise<boolean> {
    let isUpdated: boolean = false;
    await this.communeRepository
      .update(+id, updateCommuneDto)
      .then((status) => {
        if (status.affected > 0) {
          isUpdated = true;
        } else {
          throw new EntityNotFoundError(
            Commune,
            `commune with id ${id} not found.`,
          );
        }
      });
    return isUpdated;
  }

  async remove(id: number): Promise<boolean> {
    let isDeleted: boolean = false;
    await this.communeRepository.delete(id).then((status) => {
      if (status.affected > 0) {
        isDeleted = true;
      } else {
        throw new EntityNotFoundError(
          Commune,
          `commune with id ${id} not found.`,
        );
      }
    });
    return isDeleted;
  }
  async updateCommune(
    id: number,
    updateCommuneDto: UpdateCommuneDto,
  ): Promise<UpdateResult> {
    await this.findOne(id);
    if (updateCommuneDto.wilayaId) {
      const commune = this.communeRepository.create(updateCommuneDto);
      const wilaya = await this.wilayaService.findOne(
        updateCommuneDto.wilayaId,
      );
      commune.wilaya = wilaya;
      return await this.communeRepository.update(id, commune);
    }
    return await this.communeRepository.update(id, updateCommuneDto);
  }
}
