import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { PoidsService } from '../poids/poids.service';
import { ZonesService } from '../zones/zones.service';
import { CreateCodeTarifsZoneDto } from './dto/create-code-tarifs-zone.dto';
import { UpdateCodeTarifsZoneDto } from './dto/update-code-tarifs-zone.dto';
import { CodeTarifsZone } from './entities/code-tarifs-zone.entity';

/**
 *
 */
@Injectable()
export class CodeTarifsZonesService {
  logger = new Logger(CodeTarifService.name)
  constructor(
    @InjectRepository(CodeTarifsZone)
    private codeTarifZonesRepository: Repository<CodeTarifsZone>,
    private zonesService: ZonesService,
    private poidsService: PoidsService,
    @Inject(forwardRef(() => CodeTarifService))
    private codeTarifService: CodeTarifService,
  ) {}

  async create(createCodeTarifsZoneDto: any) {
    const newCodeTarifZone = this.codeTarifZonesRepository.create(
      createCodeTarifsZoneDto,
    );
    return await this.codeTarifZonesRepository.save(newCodeTarifZone);
  }
  async findOneByParam(codeTarif, zone, poids) {
    return await this.codeTarifZonesRepository.findOne({
      relations: ['codeTarif', 'zone', 'poids'],
      where: {
        codeTarif: {
          id: codeTarif.id,
        },
        zone: {
          id: zone.id,
        },
        poids: {
          id: poids.id,
        },
      },
    });
  }
  async createTarifsByFile(createCodeTarifsZoneDto) {
    console.log("🚀 ~ file: code-tarifs-zones.service.ts ~ line 48 ~ CodeTarifsZonesService ~ createTarifsByFile ~ createCodeTarifsZoneDto", createCodeTarifsZoneDto)
    for await (const tarif of createCodeTarifsZoneDto) {
      const zone = await this.zonesService.findOne(parseInt(tarif.zoneId));
      const poids = await this.poidsService.findPoidsPlage(
        tarif.poidsMin,
        tarif.poidsMax,
      );
      const codeTarif = await this.codeTarifService.findCodeTarifsByNom(
        tarif.codeTarif,
      );
      const checkExist = await this.findOneByParam(codeTarif, zone, poids);
      console.log(
        '🚀 ~ file: code-tarifs-zones.service.ts ~ line 75 ~ CodeTarifsZonesService ~ forawait ~ checkExist',
        checkExist,
      );
      if (checkExist) {
        const newTarifs = {
          codeTarif: codeTarif,
          zone: zone,
          poids: poids,
          tarifStopDesk: tarif.tarifStopDesk ? tarif.tarifStopDesk : null,
          tarifDomicile: tarif.tarifDomicile,
          tarifPoidsParKg: tarif.tarifsPoidsKg,
        };
        this.codeTarifZonesRepository.save(newTarifs);
      } else if (zone && poids && codeTarif) {
        await this.create({
          codeTarif: codeTarif,
          zone: zone,
          poids: poids,
          tarifStopDesk: tarif.tarifStopDesk ? tarif.tarifStopDesk : null,
          tarifDomicile: tarif.tarifDomicile,
          tarifPoidsParKg: tarif.tarifsPoidsKg,
        });
      } else {
        throw new EntityNotFoundError(
          CodeTarifsZone,
          'Verifier les parametres',
        );
      }
    }
  }
  // zoneId: '6',
  // poidsMin: 101,
  // poidsMax: 150,
  // tarifsPoidsKg: 50,
  // tarifStopDesk: 1150,
  // tarifDomicile: 1375,
  // codeTarif: 'Eexp_J'
  /**
   * 
   *     const codeTarifZones = await this.codeTarifZonesRepository
      .createQueryBuilder('codeTarifZone')
      .leftJoinAndSelect('codeTarifZone.codeTarif', 'codeTarif')
      .leftJoinAndSelect('codeTarifZone.zone', 'zone')
      .where(`codeTarif.id = '${codeTarif.codeTarif_id}'`)
      .andWhere(`zone.id = '${zone.zone_id}'`)
      .select(['codeTarifZone'])
      .getRawOne();
   */

  async findCodeTarifZone(
    zonId: number,
    codeTarifId: number,
    plageSurpoidsId: number,
  ) {
    const codeTarifZones = await this.codeTarifZonesRepository
      .createQueryBuilder('codeTarifZone')
      .leftJoinAndSelect('codeTarifZone.codeTarif', 'codeTarif')
      .leftJoinAndSelect('codeTarifZone.zone', 'zone')
      .leftJoinAndSelect('codeTarifZone.poids', 'poids')
      .where(
        `codeTarif.id = ${codeTarifId} and zone.id = ${zonId} and poids.id = ${plageSurpoidsId}`,
      )
      .select(['codeTarifZone'])
      .getRawOne();

    if (codeTarifZones) {
      return codeTarifZones;
    } else {
      throw new EntityNotFoundError(CodeTarifsZone, { zonId, codeTarifId });
    }
  }
  
  async findCodeTarifZon_v2(
    zonId: number,
    codeTarifId: number,
    plageSurpoidsId: number,
  ): Promise<CodeTarifsZone[]> {
    const codeTarifZones = await this.codeTarifZonesRepository
      .createQueryBuilder('codeTarifZone')
      .leftJoinAndSelect('codeTarifZone.codeTarif', 'codeTarif')
      .leftJoinAndSelect('codeTarifZone.zone', 'zone')
      .leftJoinAndSelect('codeTarifZone.poids', 'poids')
      .where(
        `codeTarif.id = '${codeTarifId}' and zone.id = '${zonId}' and poids.id = '${plageSurpoidsId}'`,
      )
      .select(['codeTarifZone'])
      .getMany();

    if (codeTarifZones) {
      return codeTarifZones;
    } else {
      throw new EntityNotFoundError(CodeTarifsZone, { zonId, codeTarifId });
    }
  }

  findAll() {
    return `This action returns all codeTarifsZones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} codeTarifsZone`;
  }

  update(id: number, updateCodeTarifsZoneDto: UpdateCodeTarifsZoneDto) {
    return `This action updates a #${id} codeTarifsZone`;
  }

  remove(id: number) {
    return `This action removes a #${id} codeTarifsZone`;
  }

  async findCodeTarifZoneWithoutPoids(
    zonId: number,
    codeTarifId: number,
  ) {
    const codeTarifZones = await this.codeTarifZonesRepository
      .createQueryBuilder('codeTarifZone')
      .leftJoin('codeTarifZone.codeTarif', 'codeTarif')
      .leftJoin('codeTarifZone.zone', 'zone')
      .leftJoin('codeTarifZone.poids', 'poids')
      .where(
        `codeTarif.id = '${codeTarifId}' and zone.id = '${zonId}'`,
      )
      .getOne();

    if (codeTarifZones) {
      return codeTarifZones;
    } else {
      throw new EntityNotFoundError(CodeTarifsZone, { zonId, codeTarifId });
    }
  }
}
