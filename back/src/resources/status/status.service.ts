import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Shipment } from '../shipments/entities/shipment.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { User } from '../users/entities/user.entity';
import { Status } from './entities/status.entity';

/**
 *
 */
@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private statusRepository: Repository<Status>,
    @Inject(forwardRef(() => ShipmentsService))
    private shipmentService: ShipmentsService,
  ) {}

  async create(createStatusDto) {
    const newStatus = this.statusRepository.create(createStatusDto);
    const saveStatus = await this.statusRepository.save(newStatus);
    if (saveStatus) {
      console.log('hakim1');
      return await this.shipmentService.updateShipmentLastStatus(
        createStatusDto.shipment,
        createStatusDto.user,
        createStatusDto.libelle,
      );
    }
  }

  async getShipmentStatusByUser(userId: number, shipmentId: number) {
    console.log("🚀 ~ file: status.service.ts ~ line 36 ~ StatusService ~ getShipmentStatusByUser ~ shipmentId", shipmentId)
    console.log("🚀 ~ file: status.service.ts ~ line 36 ~ StatusService ~ getShipmentStatusByUser ~ userId", userId)
    const shipmentStatus = await this.statusRepository.find({
      relations: ['shipment', 'user'],
      where: {
        shipment: shipmentId,
        user: userId,
      },
      order: {
        createdAt: 'ASC',
      },
    });
    if (!shipmentStatus) {
      throw new EntityNotFoundError(Status, shipmentId);
    } else {
      return shipmentStatus;
    }
  }

  async getShipmentStatusById(id: any) {
    // const status = await this.statusRepository.find({
    //   relations: ['user', 'shipment', 'userAffect', 'createdOn'],
    //   where: {
    //     shipment: { id: id },
    //   },
    //   order: {
    //     createdAt: 'ASC',
    //   },
    // });
    const status = await this.statusRepository
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.createdOn', 'createdOn')
      .leftJoinAndSelect('createdOn.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('status.user', 'user')
      .leftJoinAndSelect('status.shipment', 'shipment')
      .leftJoinAndSelect('status.userAffect', 'userAffect')
      .where(`shipment.id = ${id}`)
      .orderBy('status.createdAt', 'ASC')
      .getMany();

    if (status) {
      return status;
    } else {
      throw new EntityNotFoundError(Status, id);
    }
  }
  async getShipmentStatusByShipmentUserAffected(
    shipment: Shipment,
    userAffect: User,
  ) {
    const statusShipment = await this.statusRepository.find({
      relations: ['shipment'],
      where: {
        shipment: shipment,
        userAffect: userAffect,
      },
      order: {
        createdAt: 'ASC',
      },
    });
    return statusShipment;
  }
  async getShipmentStatusInformationsSearch(id: number) {
    const statusShipment = await this.statusRepository
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.shipment', 'shipment')
      .leftJoinAndSelect('status.createdOn', 'createdOn')
      .leftJoinAndSelect('createdOn.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('status.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('user.employe', 'employe')
      .leftJoinAndSelect('user.coursier', 'coursier')
      .where(`shipment.id = ${id}`)
      .orderBy('status.createdAt', 'ASC')
      .getRawMany();

    if (statusShipment) {
      return statusShipment;
    } else {
      throw new EntityNotFoundError(Status, id);
    }
  }
  async remove(shipmentId, userId) {
    const status = await this.statusRepository.findOne({
      where: { shipment: shipmentId, user: userId },
    });
    if (status) {
      const respons = await this.statusRepository.delete({
        shipment: shipmentId,
        user: userId,
      });
      return response;
    }
  }

  async getEmployeByStatus(status: any) {
    console.log(
      '🚀 ~ file: status.service.ts ~ line 73 ~ StatusService ~ getEmployeByStatus ~ status',
      status,
    );
    const employe = await this.statusRepository
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.shipment', 'shipment')
      .leftJoinAndSelect('status.user', 'user')
      .leftJoinAndSelect('user.employe', 'employe')
      .orderBy('status.createdAt', 'ASC')
      .where(
        `status.shipment = '${status.shipment.id}'
          and status.libelle = '${status.libelle}'`,
      )
      .select('employe')
      .getRawOne();
    console.log(
      '🚀 ~ file: status.service.ts ~ line 86 ~ StatusService ~ getEmployeByStatus ~ employe',
      employe,
    );
    return employe;
  }
  /**
   *
   */
}
