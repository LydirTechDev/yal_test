import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import {
  EntityNotFoundError,
  getConnection,
  getManager,
  ILike,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { ZonesService } from '../zones/zones.service';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { Rotation } from './entities/rotation.entity';

@Injectable()
export class RotationsService {
  /**
   *
   * @param rotationRepository
   * @param wilayaService
   * @param zoneService
   */
  constructor(
    @InjectRepository(Rotation)
    private rotationRepository: Repository<Rotation>,
    private wilayaService: WilayasService,
    private zoneService: ZonesService,
    private excelService: ExcelService,
  ) {}

  /**
   * check if rotation exist if exist throw unprocessableEntityException
   * if not create new rotaion
   * find wilaya distination
   * find wilaya depart
   * find zone
   * save new rotation instance
   *
   * @param createRotationDto
   * @returns
   */
  async create(createRotationDto: CreateRotationDto): Promise<Rotation> {
    if (
      await this.findOneRotationByDepartId_DestinationId(
        createRotationDto.wilayaDepartId,
        createRotationDto.wilayaDestinationId,
      )
    ) {
      throw new UnprocessableEntityException(`Cette rotation existe déja `);
    }
    const rotation = this.rotationRepository.create(createRotationDto);
    const wilayaDepart = await this.wilayaService.findOne(
      createRotationDto.wilayaDepartId,
    );
    const wilayaDistination = await this.wilayaService.findOne(
      createRotationDto.wilayaDestinationId,
    );
    const zone = await this.zoneService.findOne(createRotationDto.zoneId);
    rotation.wilayaDepart = wilayaDepart;
    rotation.wilayaDestination = wilayaDistination;
    rotation.zone = zone;
    rotation.rotation = wilayaDepart.nomLatin + '/' + wilayaDistination.nomLatin;
    return await this.rotationRepository.save(rotation);
  }
  async createRotationsByFile(createRotationsDto: CreateRotationDto[]) {
    for await (const createRotationDto of createRotationsDto) {
      const wilayaDepart = await this.wilayaService.findOneByCodeWilaya(
        createRotationDto.wilayaDepartId.toString(),
      );
      const wilayaDistination = await this.wilayaService.findOneByCodeWilaya(
        createRotationDto.wilayaDestinationId.toString(),
      );
      if (
        !(await this.findOneRotationByDepartId_DestinationId(
          wilayaDepart.id,
          wilayaDistination.id,
        ))
      ) {
        const rotation = this.rotationRepository.create(createRotationDto);
        const zone = await this.zoneService.findOne(createRotationDto.zoneId);
        rotation.wilayaDepart = wilayaDepart;
        rotation.wilayaDestination = wilayaDistination;
        rotation.zone = zone;
        rotation.rotation = wilayaDepart.nomLatin + '/' + wilayaDistination.nomLatin;
        await this.rotationRepository.save(rotation);
      }
    }
    return true;
  }

  /**
   * find all rotations
   * @returns
   */
  async findAllRotations(): Promise<Rotation[]> {
    const rotations = await this.rotationRepository.find({
      relations: ['wilayaDepart', 'wilayaDestination', 'zone'],
    });
    if (rotations.length <= 0) {
      throw new EntityNotFoundError(Rotation, 'No Rotation');
    }
    return rotations;
  }

  async findPaginateRotation(
    options: IPaginationOptions,
    searchRotationTerm?: string,
  ): Promise<Pagination<Rotation>> {
    let rotations;
    if (searchRotationTerm && Number(searchRotationTerm) != NaN) {
      rotations = paginate<Rotation>(
        this.rotationRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/rotations/paginateRotation',
        },
        {
          relations: ['wilayaDepart', 'wilayaDestination', 'zone'],
          where: [
            { rotation: ILike(`%${searchRotationTerm}%`)},
            {
              wilayaDepart: {
                codeWilaya: ILike(`%${searchRotationTerm}%`),
              },
            },
            {
              wilayaDepart: {
                nomLatin: ILike(`%${searchRotationTerm}%`),
              },
            },
            {
              wilayaDepart: {
                nomArabe: ILike(`%${searchRotationTerm}%`),
              },
            },
            {
              wilayaDestination: {
                codeWilaya: ILike(`%${searchRotationTerm}%`),
              },
            },
            {
              wilayaDestination: {
                nomArabe: ILike(`%${searchRotationTerm}%`),
              },
            },
            {
              wilayaDestination: {
                nomLatin: ILike(`%${searchRotationTerm}%`),
              },
            },
            {
              zone: {
                codeZone: ILike(`%${searchRotationTerm}%`),
              },
            },
          ],
        },
      );
    } else {
      rotations = paginate<Rotation>(
        this.rotationRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/rotations/paginateRotation',
        },
        {
          relations: ['wilayaDepart', 'wilayaDestination', 'zone'],
        },
      );
    }
    if ((await rotations).items.length <= 0) {
      throw new EntityNotFoundError(Rotation, 'No rotation');
    }
    return rotations;
  }
  /**
   * find one rotation by id
   * @param id
   * @returns
   */
  findOneRotationById(id: number): Promise<Rotation> {
    const rotation = this.rotationRepository.findOne({
      where: {
        id: id,
      },
      relations: ['wilayaDepart', 'wilayaDestination', 'zone'],
    });
    if (!rotation) {
      throw new EntityNotFoundError(
        Rotation,
        `la rotation d'id ${id} n'existe pas`,
      );
    }
    return rotation;
  }

  /**
   * find one rotation by
   * @param wilayaDepartId
   * @param wilayaDestinationId
   * @returns
   */
  async findOneRotationByDepartId_DestinationId(
    wilayaDepartId: number,
    wilayaDestinationId: number,
  ) {
    const rotation = await this.rotationRepository.findOne({
      where: {
        wilayaDepartId: wilayaDepartId,
        wilayaDestinationId: wilayaDestinationId,
      },
      relations: ['wilayaDepart', 'wilayaDestination', 'zone'],
    });
    return rotation;
  }
  //
  async findOneRotationByDepartCode_DestinationCode(
    wilayaDepartId: number,
    wilayaDestinationId: number,
  ) {
    const rotation = await this.rotationRepository.findOne({
      where: {
        wilayaDepartId: wilayaDepartId,
        wilayaDestinationId: wilayaDestinationId,
      },
      relations: ['wilayaDepart', 'wilayaDestination', 'zone'],
    });
    return rotation;
  }
  //
  async updateRotation(
    id: number,
    updateRotationDto: UpdateRotationDto,
  ): Promise<UpdateResult> {
    const wilayaDepart = await this.wilayaService.findOne(
      updateRotationDto.wilayaDepartId,
    );
    const wilayaDestination = await this.wilayaService.findOne(
      updateRotationDto.wilayaDestinationId,
    );
    const zone = await this.zoneService.findOne(updateRotationDto.zoneId);
    const zoneRotation = await this.rotationRepository.findOne({
      where: {
        wilayaDepartId: updateRotationDto.wilayaDepartId,
        wilayaDestinationId: updateRotationDto.wilayaDestinationId,
      },
    });

    if (
      (await this.findOneRotationByDepartId_DestinationId(
        updateRotationDto.wilayaDepartId,
        updateRotationDto.wilayaDestinationId,
      )) &&
      updateRotationDto.zoneId == zoneRotation.zoneId
    ) {
      throw new UnprocessableEntityException(`Cette rotation existe déja `);
    }

    const updateRotation = getConnection()
      .createQueryBuilder()
      .update(Rotation)
      .set({
        wilayaDepart: wilayaDepart,
        wilayaDestination: wilayaDestination,
        zone: zone,
      })
      .where('id = :ids', { ids: id });
    return updateRotation.execute();
  }

  async getRotationsBySearch(term: string): Promise<Rotation[]> {
    return await getManager()
      .createQueryBuilder(Rotation, 'r')
      .select('r.id', 'Numéro rotation')
      .addSelect('wdp.nomLatin', 'wilaya départ')
      .addSelect('wds.nomLatin', 'wilaya destination')
      .innerJoin(Wilaya, 'wdp', 'r.wilayaDepart.id=wdp.id')
      .innerJoin(Wilaya, 'wds', 'r.wilayaDestination.id=wds.id')
      .where('wdp.nomLatin ILike :name', { name: `%${term}%` })
      .orWhere('wds.nomLatin ILike :name', { name: `%${term}%` })
      .getRawMany();
  }

  async pars(res: any, term: string) {
    const data_1 = await this.getRotationsBySearch(term);
    //npm install xlsx-populate
    const XlsxPopulate = require('xlsx-populate');
    //npm install xlsx
    const reader = require('xlsx');
    // Reading our test file
    const file = reader.readFile('./test.xlsx');
    const ws = reader.utils.json_to_sheet(data_1);
    // Writing to our file
    reader.utils.book_append_sheet(file, ws);
    reader.writeFile(file, './test.xlsx');
    // Load an existing workbook
    XlsxPopulate.fromFileAsync('./test.xlsx')
      .then((workbook) => {
        workbook.deleteSheet(0);
        workbook.toFileAsync('./test.xlsx');
        return workbook.outputAsync();
      })
      .then((data) => {
        res.attachment('test.xlsx');
        res.send(data);
      });
  }
  async getRotationsToExportBySearch(term: string): Promise<Rotation[]> {
    return await this.rotationRepository
      .createQueryBuilder('rotation')
      .innerJoin('rotation.zone', 'zone')
      .innerJoin('rotation.wilayaDepart', 'wilayaDepart')
      .innerJoin('rotation.wilayaDestination', 'wilayaDestination')
      .select('rotation.id', 'Numéro rotation')
      .addSelect('zone.codeZone', 'zone')
      .addSelect('wilayaDepart.nomLatin', 'wilaya de départ')
      .addSelect('wilayaDestination.nomLatin', 'wilaya de destination')
      .where(`wilayaDepart.nomLatin ilike '%${term}%' or
              wilayaDestination.nomLatin ilike '%${term}%' or
              zone.codeZone ilike '%${term}%'
          `)
      .orderBy('rotation.id', 'ASC')
      .getRawMany();
  }

  async export(res: any, term: string) {
    const data = await this.getRotationsToExportBySearch(term);
    this.excelService.exportToExcel(res, term, data);
  }
}
