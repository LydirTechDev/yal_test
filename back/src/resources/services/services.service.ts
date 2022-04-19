import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Not, Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepository.create(createServiceDto);
    console.log(
      '🚀 ~ file: services.module.ts ~ line 21 ~ ServicesModule ~ create ~ service',
      service,
    );

    return await this.serviceRepository.save(service);
  }

  /**
   * find all services
   * @returns
   */
  async findAllServices(): Promise<Service[]> {
    return await this.serviceRepository.find({
      relations: ['codeTarif'],
      where: {
        id: Not(1),
      },
    });
  }

  async findOneByName(serviceName: string): Promise<Service> {
    console.log(
      '🚀 ~ file: services.service.ts ~ line 56 ~ ServicesService ~ findOneByName ~ serviceName',
      serviceName,
    );
    const service = await this.serviceRepository.findOne({
      where: [{ nom: serviceName }],
      relations: ['codeTarif', 'codeTarif.codeTarifZone'],
    });
    console.log("🚀 ~ file: services.service.ts ~ line 46 ~ ServicesService ~ findOneByName ~ service", service)
    return service;
  }

  async findOneByNameOrCreate(serviceName: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: [{ nom: serviceName }],
      relations: ['codeTarif', 'codeTarif.codeTarifZone'],
    });
    if (!service) {
      const newService = this.serviceRepository.create({
        nom: serviceName,
      });
      return await this.serviceRepository.save(newService);
    } else {
      return service;
    }
  }

  /**
   * find one service by Id
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne(id, {
      relations: ['codeTarif', 'codeTarif.codeTarifZone'],
    });
    if (!service) {
      throw new EntityNotFoundError(
        Service,
        `service with id ${id} not found.`,
      );
    }
    return service;
  }

  async chekIfServiceExist(serviceName: string): Promise<boolean> {
    console.log(
      '🚀 ~ file: services.service.ts ~ line 53 ~ ServicesService ~ chekIfServiceExist ~ serviceName',
      serviceName,
    );
    const service = await this.serviceRepository.findOne({
      where: {
        nom: serviceName.toLowerCase(),
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

  /**
   * get count of all service
   * @returns
   */
  async getNbServices(): Promise<number> {
    return (await this.serviceRepository.count()) - 1;
  }

  async findServicesOfUser(req) {
    console.log(
      '🚀 ~ file: services.service.ts ~ line 32 ~ ServicesService ~ findServicesOfUser ~ req',
      req.user,
    );
    const serives = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.codeTarif', 'codeTarif')
      .leftJoinAndSelect('codeTarif.clientsTarifs', 'clientsTarif')
      .leftJoinAndSelect('clientsTarif.client', 'client')
      .leftJoinAndSelect('client.user', 'user')
      .where(`user.id = '${req.user.id}'`)
      .select('service')
      .getRawMany();
    console.log(serives);
    return serives;
  }
}
