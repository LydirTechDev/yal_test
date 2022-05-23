import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { response } from 'express';
import { NotFoundError } from 'rxjs';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AgencesService } from '../agences/agences.service';
import { Agence } from '../agences/entities/agence.entity';
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
    private agenceService: AgencesService,
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
  //
  async getStatistiquesStatusFinance(agence, dateDebut, dateFin) {
    const statistique = {
      total: 0,
      livre: 0,
      retourRetire: 0,
      preRecolte: 0,
      recolte: 0,
      pretAPayer: 0,
      payer: 0,
      mantantLivraison: 0,
      mantantRetour: 0,
      totalFraiCOD: 0,
      nbrColisCOD: 0,
      recouvrement: 0,
    };
    let status;
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    if (agence.agence !== 'all') {
      const station = await this.agenceService.findOneAgenceById(agence.agence);
      if (station) {
        status = await this.statusRepository
          .createQueryBuilder('status')
          .leftJoinAndSelect('status.createdOn', 'createdOn')
          .leftJoinAndSelect('status.shipment', 'shipment')
          .leftJoinAndSelect('shipment.createdBy', 'createdBy')
          .leftJoinAndSelect('createdBy.client', 'client')
          .where(
            `CAST(status.libelle as text) = CAST(shipment.lastStatus as text)`,
          )
          .andWhere(`createdOn.id = ${agence.agence}`)
          .andWhere('status.createdAt >= :dateDebut', {
            dateDebut: `${dateDebut}`,
          })
          .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
          .distinctOn(['shipment.id'])
          .orderBy('shipment.id', 'DESC')
          .getMany();
      } else {
        throw new EntityNotFoundError(Agence, 'agence eronné');
      }
    } else {
      status = await this.statusRepository
        .createQueryBuilder('status')
        .leftJoinAndSelect('status.shipment', 'shipment')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('createdBy.client', 'client')
        .where(
          `CAST(status.libelle as text) = CAST(shipment.lastStatus as text)`,
        )
        .andWhere('status.createdAt >= :dateDebut', {
          dateDebut: `${dateDebut}`,
        })
        .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
        .distinctOn(['shipment.id'])
        .orderBy('shipment.id', 'DESC')
        .getMany();
    }
    for await (const stat of status) {
      switch (stat.libelle) {
        case StatusShipmentEnum.pasPres:
          statistique.total += 1;
          statistique.livre += 1;
          break;
        //
        case StatusShipmentEnum.preRecolte:
          statistique.total += 1;
          statistique.preRecolte += 1;
          break;
        //
        case StatusShipmentEnum.recolte:
          statistique.total += 1;
          statistique.recolte += 1;
          break;
        //
        case StatusShipmentEnum.pretAPayer:
          statistique.total += 1;
          statistique.pretAPayer += 1;
          break;
        //
        case StatusShipmentEnum.payer:
          statistique.total += 1;
          statistique.payer += 1;
          const tarifLivraison =
            await this.shipmentService.calculTarifslivraison(
              stat.shipment.tracking,
            );
          statistique.mantantLivraison += tarifLivraison;
          if (stat.shipment.livraisonGratuite) {
            statistique.recouvrement += stat.shipment.prixVente;
          } else {
            statistique.recouvrement +=
              tarifLivraison + stat.shipment.prixVente;
          }
          if (
            stat.shipment.prixEstimer >
            stat.shipment.createdBy.client.c_o_d_ApartirDe
          ) {
            statistique.nbrColisCOD += 1;
            statistique.totalFraiCOD +=
              (stat.shipment.createdBy.client.tauxCOD / 100) *
              stat.shipment.prixEstimer;
          }
          break;
        //
        case StatusShipmentEnum.retirer:
          statistique.total += 1;
          statistique.retourRetire += 1;
          statistique.mantantRetour +=
            stat.shipment.createdBy.client.tarifRetour;
          break;
        //
      }
    }
    console.log(
      '🚀 ~ file: status.service.ts ~ line 205 ~ StatusService ~ forawait ~ statistique',
      statistique,
    );
    return statistique;
  }
  //
  async getStatistiquesStatusOPS(agence, dateDebut, dateFin) {
    const statistique = {
      total: 0,
      livre: 0,
      echecLivraison: 0,
      tentativeEchouee: 0,
      sortiEnLivraison: 0,
      enPreparation: 0,
      presExpidier: 0,
      expidier: 0,
      transfert: 0,
      centre: 0,
      versWilaya: 0,
      recuWilaya: 0,
      versAgence: 0,
      recuAgence: 0,
      retourVersCentre: 0,
      retourneAuCentre: 0,
      retourVersWilaya: 0,
      retourRecuWilaya: 0,
      retourVersAgence: 0,
      retourRecuAgence: 0,
      retourARetirer: 0,
      retourRetire: 0,
    };
    let status;
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    console.log(
      '🚀 ~ file: status.service.ts ~ line 127 ~ StatusService ~ getStatistiquesStatus ~ dateFin',
      dateFin,
      agence.agence,
    );
    if (agence.agence !== 'all') {
      const station = await this.agenceService.findOneAgenceById(agence.agence);
      if (station) {
        status = await this.statusRepository
          .createQueryBuilder('status')
          .leftJoinAndSelect('status.createdOn', 'createdOn')
          .leftJoinAndSelect('status.shipment', 'shipment')
          .where(
            `CAST(status.libelle as text) = CAST(shipment.lastStatus as text)`,
          )
          .andWhere(`createdOn.id = ${agence.agence}`)
          .andWhere('status.createdAt >= :dateDebut', {
            dateDebut: `${dateDebut}`,
          })
          .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
          .distinctOn(['shipment.id'])
          .orderBy('shipment.id', 'DESC')
          .getMany();
        console.log(
          '🚀 ~ file: status.service.ts ~ line 133 ~ StatusService ~ getStatistiquesStatus ~ status',
          status,
        );
      } else {
        throw new EntityNotFoundError(Agence, 'agence eronné');
      }
    } else {
      status = await this.statusRepository
        .createQueryBuilder('status')
        .leftJoinAndSelect('status.shipment', 'shipment')
        .where(
          `CAST(status.libelle as text) = CAST(shipment.lastStatus as text)`,
        )
        .andWhere('status.createdAt >= :dateDebut', {
          dateDebut: `${dateDebut}`,
        })
        .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
        .distinctOn(['shipment.id'])
        .orderBy('shipment.id', 'DESC')
        .getMany();
      console.log(
        '🚀 ~ file: status.service.ts ~ line 165 ~ StatusService ~ getStatistiquesStatus ~ status',
        status,
      );
    }
    for await (const stat of status) {
      switch (stat.libelle) {
        case StatusShipmentEnum.livre ||
          StatusShipmentEnum.pasPres ||
          StatusShipmentEnum.preRecolte ||
          StatusShipmentEnum.recolte ||
          StatusShipmentEnum.pretAPayer ||
          StatusShipmentEnum.payer:
          statistique.total += 1;
          statistique.livre += 1;
          break;
        //
        case StatusShipmentEnum.echecLivraison:
          statistique.total += 1;
          statistique.echecLivraison += 1;
          break;
        //
        case StatusShipmentEnum.tentativeEchoue:
          statistique.total += 1;
          statistique.tentativeEchouee += 1;
          break;
        //
        case StatusShipmentEnum.enPreparation:
          statistique.total += 1;
          statistique.enPreparation += 1;
          break;
        //
        case StatusShipmentEnum.presExpedition:
          statistique.total += 1;
          statistique.presExpidier += 1;
          break;
        //
        case StatusShipmentEnum.expidie:
          statistique.total += 1;
          statistique.expidier += 1;
          break;
        //
        case StatusShipmentEnum.transfert:
          statistique.total += 1;
          statistique.transfert += 1;
          break;
        //
        case StatusShipmentEnum.centre:
          statistique.total += 1;
          statistique.centre += 1;
          break;
        //
        case StatusShipmentEnum.versWilaya:
          statistique.total += 1;
          statistique.versWilaya += 1;
          break;
        //
        case StatusShipmentEnum.recueWilaya:
          statistique.total += 1;
          statistique.recuWilaya += 1;
          break;
        //
        case StatusShipmentEnum.versAgence:
          statistique.total += 1;
          statistique.versAgence += 1;
          break;
        //
        case StatusShipmentEnum.recueAgence:
          statistique.total += 1;
          statistique.recuAgence += 1;
          break;
        //
        case StatusShipmentEnum.retourneCentre:
          statistique.total += 1;
          statistique.retourVersCentre += 1;
          break;
        //
        case StatusShipmentEnum.centreRetour:
          statistique.total += 1;
          statistique.retourneAuCentre += 1;
          break;
        //
        case StatusShipmentEnum.returnVersWilaya:
          statistique.total += 1;
          statistique.retourVersWilaya += 1;
          break;
        //
        case StatusShipmentEnum.retourRecuWilaya:
          statistique.total += 1;
          statistique.retourRecuWilaya += 1;
          break;
        //
        case StatusShipmentEnum.retourVersAgence:
          statistique.total += 1;
          statistique.retourVersAgence += 1;
          break;
        //
        case StatusShipmentEnum.retourRecuAgence:
          statistique.total += 1;
          statistique.retourRecuAgence += 1;
          break;
        //
        case StatusShipmentEnum.ARetirer:
          statistique.total += 1;
          statistique.retourARetirer += 1;
          break;
        //
        case StatusShipmentEnum.retirer:
          statistique.total += 1;
          statistique.retourRetire += 1;
          break;
        //
      }
    }
    return statistique;
  }
  //
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
