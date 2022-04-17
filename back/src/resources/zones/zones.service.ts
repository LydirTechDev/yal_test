import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, ILike, Repository, UpdateResult } from 'typeorm';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { Zone } from './entities/zone.entity';

@Injectable()
export class ZonesService {
  logger = new Logger(ZonesService.name);
  /**
   * ZoneService dependencies
   * @param zoneRepository
   */
  constructor(
    @InjectRepository(Zone)
    private zoneRepository: Repository<Zone>,
  ) {}

  /**
   * create new zone instance
   * save new zone instance
   * @param createZoneDto
   * @returns
   */
  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    const zone = this.zoneRepository.create(createZoneDto);
    return await this.zoneRepository.save(zone);
  }

  /**
   * find all zones
   * @returns
   */
  async findAllZone(): Promise<Zone[]> {
    const zones = await this.zoneRepository.find();
    if (zones.length <= 0) {
      throw new EntityNotFoundError(Zone, 'No Zones');
    }
    return zones;
  }
  /**
   *
   * @param options
   * @param searchZoneTerm
   * @returns
   */
  async findPaginateZone(
    options: IPaginationOptions,
    searchZoneTerm?: string,
  ): Promise<Pagination<Zone>> {
    this.logger.debug(this.findPaginateZone.name);
    let zones;
    if (searchZoneTerm && Number(searchZoneTerm) != NaN) {
      zones = paginate<Zone>(
        this.zoneRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/zones/paginateZone',
        },
        {
          relations: ['rotations', 'codeTarifsZones'],
          where: {
            codeZone: ILike(`%${searchZoneTerm}%`),
          },
        },
      );
    } else {
      zones = paginate<Zone>(
        this.zoneRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/zones/paginateZone',
        },
        {
          relations: ['rotations', 'codeTarifsZones'],
        },
      );
    }

    if ((await zones).items.length <= 0) {
      throw new EntityNotFoundError(Zone, 'No Zones');
    }
    return zones;
  }

  async findZoneByRotation(departId: number, destinationId: number) {
    console.log(
      '🚀 ~ file: zones.service.ts ~ line 30 ~ ZonesService ~ findZoneByRotation ~ destinationId',
      destinationId,
    );
    console.log(
      '🚀 ~ file: zones.service.ts ~ line 30 ~ ZonesService ~ findZoneByRotation ~ departId',
      departId,
    );
    const zone = await this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.rotations', 'rotations')
      .where(`rotations.wilayaDepart = ${departId}`)
      .andWhere(`rotations.wilayaDestination = ${destinationId}`)
      .select(['zone'])
      .getRawOne();
    console.log("🚀 ~ file: zones.service.ts ~ line 110 ~ ZonesService ~ findZoneByRotation ~ zone", zone)

    if (zone) {
      return zone;
    } else {
      throw new EntityNotFoundError(Zone, { departId, destinationId });
    }
  }

  async findOne(id: number): Promise<Zone> {
    const zone = await this.zoneRepository.findOne(id, {
      // relations: [
      // 'rotation',
      // 'rotation.wilayaDepart',
      // 'rotation.wilayaDestination',
      // ],
    });
    if (!zone) {
      throw new EntityNotFoundError(Zone, `zone with id ${id} not found.`);
    }
    return zone;
  }

  async fineZoneBycodeTarif(id: number) {
    // find({
    //   relations: ['codeTarifsZones', 'codeTarifsZones.codeTarif', 'codeTarifsZones.poids'],
    //   where: {
    //     codeTarifsZones: {

    //     }
    //   }

    // })
    const zone = await this.zoneRepository
      .createQueryBuilder('zone')
      .leftJoinAndSelect('zone.codeTarifsZones', 'codeTarifsZones')
      .leftJoinAndSelect('codeTarifsZones.poids', 'poids')
      .leftJoinAndSelect('codeTarifsZones.codeTarif', 'codeTarif')
      .where(`codeTarif.id = ${id}`)
      .orderBy('zone.id', "ASC")
      .addOrderBy('poids.min', "ASC")
      .getMany();
    return zone;
  }

  async update(
    id: number,
    updateZoneDto: UpdateZoneDto,
  ): Promise<UpdateResult> {
    await this.findOne(id);
    return this.zoneRepository.update(id, updateZoneDto);
  }

  remove(id: number) {
    return `This action removes a #${id} zone`;
  }
}
