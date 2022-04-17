import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { ServicesService } from '../services/services.service';
import { CreateCodeTarifDto } from './dto/create-code-tarif.dto';
import { UpdateCodeTarifDto } from './dto/update-code-tarif.dto';
import { CodeTarif } from './entities/code-tarif.entity';

@Injectable()
export class CodeTarifService {
  constructor(
    @InjectRepository(CodeTarif)
    private codeTarifRepository: Repository<CodeTarif>,
    private serviceService: ServicesService,
    @Inject(forwardRef(() => CodeTarifsZonesService))
    private codeTarifsZonesService: CodeTarifsZonesService,
  ) {}

  /**
   * get count of all code tarif
   * @returns
   */
  async getNbCodeTarif(): Promise<number> {
    return await this.codeTarifRepository.count();
  }

  async create(createCodeTarifDto: CreateCodeTarifDto) {
    const service = await this.serviceService.findOne(
      createCodeTarifDto.serviceId,
    );
    const codeTarif = this.codeTarifRepository.create(createCodeTarifDto);
    codeTarif.service = service;
    console.log(
      '🚀 ~ file: code-tarif.service.ts ~ line 18 ~ CodeTarifService ~ create ~ codeTarif',
      codeTarif,
    );

    return await this.codeTarifRepository.save(codeTarif);
  }

  async createNewTarification(newTarification: any) {
    console.log(
      '🚀 ~ file: code-tarif.service.ts ~ line 37 ~ CodeTarifService ~ createNewTarification ~ newTarification',
      newTarification['nom'],
    );
    const service = await this.serviceService.findOneByNameOrCreate(
      newTarification['nom'],
    );

    if (service) {
      console.log(
        '🚀 ~ file: code-tarif.service.ts ~ line 49 ~ CodeTarifService ~ createNewTarification ~ newService',
        service,
      );
      const codeTarif = this.codeTarifRepository.create({
        service: service,
        nom: newTarification['codeTarif'][0]['nom'],
        isStandard: newTarification['codeTarif'][0]['isStandard'],
      });
      const newCodeTarif = await this.codeTarifRepository.save(codeTarif);
      console.log(
        '🚀 ~ file: code-tarif.service.ts ~ line 50 ~ CodeTarifService ~ createNewTarification ~ newCodeTarif',
        newCodeTarif,
      );

      newTarification['codeTarif'][0]['codeTarifZone'].forEach(
        async (codeTarifZone) => {
          await this.codeTarifsZonesService.create({
            codeTarif: newCodeTarif,
            zone: codeTarifZone['zone'],
            poids: codeTarifZone['poids'],
            tarifDomicile: codeTarifZone['tarifDomicile'],
            tarifStopDesk: codeTarifZone['tarifStopDesk'],
            tarifPoidsParKg: codeTarifZone['tarifPoidsParKg'],
          });
        },
      );
    }

    newTarification['nom'];
    newTarification['codeTarif'];
    newTarification['codeTarif']['nom'];
    newTarification['codeTarif']['isStandard'];
    newTarification['codeTarif']['codeTarifZone'];
    console.log(
      "🚀 ~ file: code-tarif.service.ts ~ line 51 ~ CodeTarifService ~ createNewTarification ~ newTarification['codeTarif']['codeTarifZone']",
      newTarification['codeTarif'][0]['codeTarifZone'],
    );
    console.log(
      "🚀 ~ file: code-tarif.service.ts ~ line 53 ~ CodeTarifService ~ createNewTarification ~ newTarification['codeTarif']['isStandard']",
      newTarification['codeTarif'][0]['isStandard'],
    );
    console.log(
      "🚀 ~ file: code-tarif.service.ts ~ line 53 ~ CodeTarifService ~ createNewTarification ~ newTarification['codeTarif']['nom']",
      newTarification['codeTarif'][0]['nom'],
    );
    console.log(
      "🚀 ~ file: code-tarif.service.ts ~ line 53 ~ CodeTarifService ~ createNewTarification ~ newTarification['codeTarif']",
      newTarification['codeTarif'][0],
    );
    console.log(
      "🚀 ~ file: code-tarif.service.ts ~ line 53 ~ CodeTarifService ~ createNewTarification ~ newTarification['nom']",
      newTarification['nom'],
    );
  }

  async findAll() {
    return await this.codeTarifRepository.find({
      relations: ['service'],
    });
  }
  async findCodeTarifsByNom(nomCode) {
    const codeTarif = await this.codeTarifRepository.findOne({
      where: {
        nom: nomCode,
      },
    });
    if (!codeTarif) {
      throw new EntityNotFoundError(CodeTarif, 'Not Found');
    }
    return codeTarif;
  }
  async findOneCodeTarifById(id: number) {
    // const codeTarif = await this.codeTarifRepository.findOne(id, {
    //   relations: [
    //     'codeTarifZone',
    //     'codeTarifZone.zone',
    //     'codeTarifZone.poids',
    //   ],
    // });
    const codeTarif = await this.codeTarifRepository
      .createQueryBuilder('codeTarif')
      .where('codeTarif.id = :id', { id: id })
      .leftJoinAndSelect('codeTarif.codeTarifZone', 'codeTarifZone')
      .leftJoinAndSelect('codeTarifZone.zone', 'zone')
      .leftJoinAndSelect('codeTarifZone.poids', 'poids')
      .getMany();

    if (!codeTarif) {
      throw new EntityNotFoundError(CodeTarif, 'Not Found');
    }
    return codeTarif;
  }

  async chekIfServiceExist(codeTarifName: string): Promise<boolean> {
    console.log(
      '🚀 ~ file: services.service.ts ~ line 53 ~ ServicesService ~ chekIfServiceExist ~ codeTarifName',
      codeTarifName,
    );
    const service = await this.codeTarifRepository.findOne({
      where: {
        nom: codeTarifName.toLowerCase(),
      },
    });
    if (service) {
      console.log(
        '🚀 ~ file: services.service.ts ~ line 62 ~ ServicesService ~ chekIfServiceExist ~ true',
        'true',
      );
      return true;
    }
    console.log(
      '🚀 ~ file: services.service.ts ~ line 62 ~ ServicesService ~ chekIfServiceExist ~ true',
      'false',
    );
    return false;
  }
  async findOne(id: number): Promise<CodeTarif> {
    const codeTarif = await this.codeTarifRepository.findOne({
      relations: ['service'],
      where: { id: id },
    });
    if (codeTarif) {
      return codeTarif;
    } else {
      throw new EntityNotFoundError(CodeTarif, id);
    }
  }

  update(id: number, updateCodeTarifDto: UpdateCodeTarifDto) {
    return `This action updates a #${id} codeTarif`;
  }

  remove(id: number) {
    return `This action removes a #${id} codeTarif`;
  }
  async getTarifByserviceId(serviceId: number): Promise<CodeTarif[]> {
    const codeTarifs = this.codeTarifRepository.find({
      relations: ['service'],
      where: {
        service: { id: serviceId },
      },
    });
    if (codeTarifs) {
      return codeTarifs;
    }
    throw new EntityNotFoundError(CodeTarif, serviceId);
  }
}
