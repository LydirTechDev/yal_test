import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { NotFoundError } from 'rxjs';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { AgencesTypesEnum } from 'src/enums/agencesTypesEnum';
import { EntityNotFoundError, ILike, Repository, UpdateResult } from 'typeorm';
import { AgencesService } from '../agences/agences.service';
import { EmployesService } from '../employes/employes.service';
import { CreateWilayaDto } from './dto/create-wilaya.dto';
import { UpdateWilayaDto } from './dto/update-wilaya.dto';
import { Wilaya } from './entities/wilaya.entity';

@Injectable()
export class WilayasService {
  logger = new Logger(WilayasService.name);

  /**
   *
   * @param wilayaRepository Repository<Wilaya>
   */
  constructor(
    @InjectRepository(Wilaya)
    private wilayaRepository: Repository<Wilaya>,
    private employeService: EmployesService,
    @Inject(forwardRef(() => AgencesService))
    private agenceService: AgencesService,
    private excelService: ExcelService,
  ) {}
  /**
   * create and sav new wilaya instance
   * @param createWilayaDto
   * @returns
   */
  async create(createWilayaDto: CreateWilayaDto) {
    for (const key in createWilayaDto) {
      if (typeof createWilayaDto[key] == 'string') {
        createWilayaDto[key] = createWilayaDto[key].toLowerCase();
      }
    }
    const wilaya = this.wilayaRepository.create(createWilayaDto);
    const agenceRetour = await this.agenceService.findOneAgenceById(
      createWilayaDto.agenceRetourId,
    );
    wilaya.agenceRetour = agenceRetour;
    wilaya.dureeReceptionRecolte = createWilayaDto.dureeReceptionRecolte;
    return await this.wilayaRepository.save(wilaya);
  }
  async createWilayaByFile(createWilayasDto: CreateWilayaDto[]) {
    for await (const createWilayaDto of createWilayasDto) {
      const wilaya = await this.wilayaRepository.findOne({
        where: {
          codeWilaya: createWilayaDto.codeWilaya.toString(),
        },
      });
      console.log(
        '🚀 ~ file: wilayas.service.ts ~ line 55 ~ WilayasService ~ forawait ~ wilaya',
        wilaya,
      );
      if (wilaya == undefined) {
        console.log('hakim');
        const wilaya = this.wilayaRepository.create(createWilayaDto);
        wilaya.agenceRetour = null;
        await this.wilayaRepository.save(wilaya);
      }
    }
    return true;
  }
  /**
   * get all wilayas
   * @returns
   */
  async findAllWilaya(): Promise<Wilaya[]> {
    const wilayas = await this.wilayaRepository.find();

    if (wilayas.length <= 0) {
      throw new EntityNotFoundError(Wilaya, 'No Wilaya');
    }
    return wilayas;
  }
  async wilayasOfMyCenter(user) {
    const employe = await this.employeService.findOneByUserId(user.id);
    if (employe.agence.type === AgencesTypesEnum.centreRetour) {
      const wilayasRetour = await this.wilayaRepository.find({
        where: {
          agenceRetour: employe.agence.id,
        },
      });
      return wilayasRetour;
    } else {
      return [];
    }
  }
  /**
   *
   * @param options IPaginationOptions
   * @param searchWilayaTerm string
   * @returns Promise<Pagination<Wilaya>>
   */
  async findPaginateWilaya(
    options: IPaginationOptions,
    searchWilayaTerm?: string,
  ): Promise<Pagination<Wilaya>> {
    this.logger.verbose(this.findPaginateWilaya.name);
    let wilayas;
    if (searchWilayaTerm && Number(searchWilayaTerm) != NaN) {
      this.logger.verbose(searchWilayaTerm);
      wilayas = paginate<Wilaya>(
        this.wilayaRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/wilayas/paginateWilaya',
        },
        {
          where: [
            { codeWilaya: ILike(`%${searchWilayaTerm}%`) },
            { nomArabe: ILike(`%${searchWilayaTerm}%`) },
            { nomLatin: ILike(`%${searchWilayaTerm}%`) },
          ],
          order: {
            codeWilaya: 'DESC',
          },
        },
      );
    } else {
      wilayas = paginate<Wilaya>(
        this.wilayaRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/wilayas/paginateWilaya',
        },
        {
          order: {
            id: 'ASC',
          },
        },
      );
    }
    if ((await wilayas).items <= 0) {
      throw new EntityNotFoundError(Wilaya, 'No wilayas');
    }
    return wilayas;
  }

  /**
   *
   * @param id number
   * @returns Promise<Wilaya>
   */
  async findOne(id: number): Promise<Wilaya> {
    const response = await this.wilayaRepository.findOne({
      where: { id: id },
      relations: ['agenceRetour'],
    });
    console.log(
      '🚀 ~ file: wilayas.service.ts ~ line 131 ~ WilayasService ~ findOne ~ response',
      response,
    );
    if (response) {
      return response;
    } else {
      throw new EntityNotFoundError(
        Wilaya,
        `la wilaya d'id ${id} n'existe pas`,
      );
    }
  }
  //
  async findOneByCodeWilaya(code: string): Promise<Wilaya> {
    const response = await this.wilayaRepository.findOne({
      where: { codeWilaya: code },
    });
    return response;
  }
  //////////
  async findByAgenceRetourId(stationId: number) {
    const wilayasRetour = await this.wilayaRepository.find({
      where: {
        agenceRetour: stationId,
      },
    });
    if (wilayasRetour) {
      return wilayasRetour;
    } else {
      throw new EntityNotFoundError(Wilaya, stationId);
    }
  }
  async updateWilaya(
    id: number,
    wilayaUpdateDto: UpdateWilayaDto,
  ): Promise<UpdateResult> {
    await this.findOne(id);

    if (wilayaUpdateDto.agenceRetourId) {
      const wilaya = await this.wilayaRepository.create(wilayaUpdateDto);
      const agenceRetour = await this.agenceService.findOneAgenceById(
        wilayaUpdateDto.agenceRetourId,
      );
      wilaya.agenceRetour = agenceRetour;
      return await this.wilayaRepository.update(id, wilaya);
    }
    return await this.wilayaRepository.update(id, wilayaUpdateDto);
  }

  async getAllwilayaToExport(): Promise<any> {
    const wilayas = await this.wilayaRepository
      .createQueryBuilder('wilaya')
      .select('wilaya.nomLatin', 'Nom Latin')
      .getRawMany();
    return wilayas;
  }

  async exportWilayas(res: any, term: string) {
    const data = await this.getAllwilayaToExport();
    this.excelService.exportToExcel(res, term, data);
  }
}
