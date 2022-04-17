/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PdfService } from 'src/core/templates/pdf.service';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import { EntityNotFoundError, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { CoursierService } from '../coursier/coursier.service';
import { EmployesService } from '../employes/employes.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { UpdateRecolteDto } from './dto/update-recolte.dto';
import { Recolte } from './entities/recolte.entity';

@Injectable()
export class RecoltesService {
  constructor(
    @InjectRepository(Recolte) private recolteRepository: Repository<Recolte>,
    private shipmentService: ShipmentsService,
    private statusService: StatusService,
    private userService: UsersService,
    private coursierService: CoursierService,
    private employeService: EmployesService,
    private clientService: ClientsService,
    private pdfService: PdfService,
  ) { }
  async getPaginateRecolteOfUser(
    user,
    options: IPaginationOptions,
    searchRecolteTerm?: string,
  ): Promise<Pagination<Recolte>> {
    let recolte;
    if (searchRecolteTerm && Number(searchRecolteTerm) != NaN) {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('recolte.recolteCoursier', 'coursier')
        .leftJoinAndSelect('coursier.coursier', 'coursierdet')
        .where(`(recolte.tracking  ILike '%${searchRecolteTerm}%' or
           coursierdet.nom  ILike '%${searchRecolteTerm}%' or
            coursierdet.prenom  ILike '%${searchRecolteTerm}%') and creatBy.id = ${user.id} and recolte.receivedById is null`);
    } else {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('recolte.recolteCoursier', 'coursier')
        .leftJoinAndSelect('coursier.coursier', 'coursierdet')
        .where(`creatBy.id = ${user.id} and recolte.receivedById is null`);
    }
    return paginate<Recolte>(recolte, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/recoltes/paginateRecolteOfUser',
    });
  }
  async getPaginateAllRecolte(
    options: IPaginationOptions,
    searchRecolteTerm?: string,
  ) {
    let recolte;
    if (searchRecolteTerm && Number(searchRecolteTerm) != NaN) {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('creatBy.employe', 'employe')
        .leftJoinAndSelect('employe.agence', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('recolte.receivedBy', 'receivedBy')
        .where(
          `
          recolte.tracking ILike '%${searchRecolteTerm}%' or
          coursierdet.nom ILike '%${searchRecolteTerm}%' or
          coursierdet.prenom ILike '%${searchRecolteTerm}%' or 
          wilaya.nomLatin ILike '%${searchRecolteTerm}%' or
          agence.nom ILike '%${searchRecolteTerm}%'`,
        )
        .orderBy('recolte.createdAt', 'DESC');
    } else {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('creatBy.employe', 'employe')
        .leftJoinAndSelect('employe.agence', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('recolte.receivedBy', 'receivedBy')
        .addSelect('wilaya')
        .orderBy('recolte.createdAt', 'DESC');
    }
    return paginate<Recolte>(recolte, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/recoltes/paginateAllRecolte',
    });
  }

  // changer le created By avec le craetedOn
  async getPaginateAllRegionalRecolte(
    user: User,
    options: IPaginationOptions,
    searchRecolteTerm?: string,
  ) {
    let recolte;
    const agenceUser = await this.userService.findInformationsEmploye(user.id);
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 114 ~ RecoltesService ~ agenceUser',
      agenceUser,
    );
    if (searchRecolteTerm && Number(searchRecolteTerm) != NaN) {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('creatBy.employe', 'employe')
        .leftJoinAndSelect('employe.agence', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('recolte.receivedBy', 'receivedBy')
        .where(
          `
          recolte.tracking ILike '%${searchRecolteTerm}%' or
          coursierdet.nom ILike '%${searchRecolteTerm}%' or
          coursierdet.prenom ILike '%${searchRecolteTerm}%' or 
          wilaya.nomLatin ILike '%${searchRecolteTerm}%' or
          agence.nom ILike '%${searchRecolteTerm}%'`,
        )
        .orderBy('recolte.createdAt', 'DESC');
    } else {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('creatBy.employe', 'employe')
        .leftJoinAndSelect('employe.agence', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('recolte.receivedBy', 'receivedBy')
        .where(`wilaya.caisseRegional=${agenceUser.employe.agence.id}`)
        .addSelect('wilaya')
        .orderBy('recolte.createdAt', 'DESC');
    }
    return paginate<Recolte>(recolte, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/recoltes/paginateAllRecolte',
    });
  }

  async getPaginateAllAgenceRecolte(
    user: User,
    options: IPaginationOptions,
    searchRecolteTerm?: string,
  ) {
    let recolte;
    const agenceUser = await this.userService.findInformationsEmploye(user.id);
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 114 ~ RecoltesService ~ agenceUser',
      agenceUser,
    );
    if (searchRecolteTerm && Number(searchRecolteTerm) != NaN) {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('creatBy.employe', 'employe')
        .leftJoinAndSelect('employe.agence', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('recolte.receivedBy', 'receivedBy')
        .where(
          `
          recolte.tracking ILike '%${searchRecolteTerm}%' or
          coursierdet.nom ILike '%${searchRecolteTerm}%' or
          coursierdet.prenom ILike '%${searchRecolteTerm}%' or 
          wilaya.nomLatin ILike '%${searchRecolteTerm}%' or
          agence.nom ILike '%${searchRecolteTerm}%'`,
        )
        .orderBy('recolte.createdAt', 'DESC');
    } else {
      recolte = this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('recolte.createdOn', 'creatOn')
        .leftJoinAndSelect('recolte.createdBy', 'creatBy')
        .leftJoinAndSelect('creatBy.employe', 'employe')
        .leftJoinAndSelect('employe.agence', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('recolte.receivedBy', 'receivedBy')
        .where(`creatOn.id=${agenceUser.employe.agence.id}`)
        .addSelect('wilaya')
        .orderBy('recolte.createdAt', 'DESC');
    }
    return paginate<Recolte>(recolte, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/recoltes/paginateAllRecolte',
    });
  }

  async create(user, createRecolteDto: CreateRecolteDto, res) {
    const listOfRecolte: string[] = [];
    const userCoursierInfo =
      await this.userService.findInformationUserOfCoursier(createRecolteDto.id);
    const userStation = await this.userService.findInformationsEmploye(user.id);
    const shipmentLivreOfCoursier =
      await this.shipmentService.findShipmentLivreOfCoursier(
        userCoursierInfo.id,
      );
    if (shipmentLivreOfCoursier.length > 0) {
      //creation de la recolte
      const tracking = await this.generateRct();
      const recolte = this.recolteRepository.create();
      recolte.tracking = tracking;
      recolte.createdBy = userStation;
      recolte.createdOn = userStation.employe.agence;
      recolte.receivedAt = null;
      recolte.receivedBy = null;
      recolte.receivedOn = null;
      recolte.recolteCoursier = userCoursierInfo;

      const recolteSave = await this.recolteRepository.save(recolte);
      for await (const shipment of shipmentLivreOfCoursier) {
        console.log("🚀 ~ file: recoltes.service.ts ~ line 236 ~ RecoltesService ~ forawait ~ shipment",)
        const statusShipment = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.pasPres
        ) {
          listOfRecolte.push(shipment.tracking);
          await this.shipmentService.updateShipmentRecolteId(
            shipment.id,
            recolteSave,
          );

          await this.statusService.create({
            shipment: await this.shipmentService.findOne(shipment.id),
            user: user,
            libelle: StatusShipmentEnum.preRecolte,
            userAffect: userCoursierInfo,
            createdOn: userStation.employe.agence.id,
          });
        }
      }
      return await this.printRecolteManifest(recolteSave.id, res);
    } else {
      throw new NotFoundException();
    }
  }
  async createRecolteDesk(user, resp) {
    const dateRecolte = new Date()
    const listOfRecolte: string[] = [];
    const employeInfo = await this.userService.findInformationsEmploye(user.id);
    console.log("🚀 ~ file: recoltes.service.ts ~ line 267 ~ RecoltesService ~ createRecolteDesk ~ employeInfo", employeInfo)
    const shipmentLivreDesk =
      await this.shipmentService.findShipmentLivreDesk(
        user
      );
    if (shipmentLivreDesk.length > 0) {
      //creation de la recolte
      const tracking = await this.generateRct();
      const recolte = this.recolteRepository.create();
      recolte.tracking = tracking;
      recolte.createdBy = employeInfo;
      recolte.createdOn = employeInfo.employe.agence;
      recolte.receivedAt = null;
      recolte.receivedBy = null;
      recolte.receivedOn = null;
      recolte.recolteCoursier = null;
      const recolteSave = await this.recolteRepository.save(recolte);
      for await (const shipment of shipmentLivreDesk) {
        console.log("🚀 ~ file: recoltes.service.ts ~ line 284 ~ RecoltesService ~ forawait ~ shipment", shipment)
        if (
          shipment.shipment_lastStatus == StatusShipmentEnum.pasPres
        ) {
          listOfRecolte.push(shipment.shipment_tracking);
          await this.shipmentService.updateShipmentRecolteId(
            shipment.shipment_id,
            recolteSave,
          );
          await this.statusService.create({
            shipment: await this.shipmentService.findOne(shipment.shipment_id),
            user: user,
            libelle: StatusShipmentEnum.preRecolte,
            createdAt: dateRecolte,
            userAffect: null,
            createdOn: employeInfo.employe.agence.id,
          });
          //
          await this.statusService.create({
            shipment: await this.shipmentService.findOne(shipment.shipment_id),
            user: user,
            libelle: StatusShipmentEnum.recolte,
            createdAt: this.addToDate(dateRecolte),
            userAffect: null,
            createdOn: employeInfo.employe.agence.id,

          });
      //
        }
      }
      return await this.printRecolteManifest(recolteSave.id, resp);
    } else {
      throw new NotFoundException();
    }
  }
  addToDate(objDate) {
    const numberOfMlSeconds = objDate.getTime();
    const addMlSeconds = 1000;
    const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
  }
  async getRecoltePresRecolte() {
    const listRctTrackings = [];
    const recoltes = await this.recolteRepository.find({
      where: {
        receivedBy: null,
      },
      select: ['tracking'],
    });
    for (const rct of recoltes) {
      listRctTrackings.push(rct.tracking);
    }
    if (listRctTrackings.length > 0) {
      return listRctTrackings;
    } else {
      return null;
    }
  }

  // #############################################################################
  // #############################################################################
  // #############################################################################

  async getRecolteRegionalPresRecolte(user: User) {
    const listRctTrackings = [];
    const userStation = await this.userService.findInformationsEmploye(user.id);
    const recoltes = await this.recolteRepository.find({
      relations: ['createdOn', 'createdOn.commune', 'createdOn.commune.wilaya'],
      where: {
        receivedBy: null,
        createdOn: {
          commune: {
            wilaya: {
              caisseRegional: userStation.employe.agence,
            },
          },
        },
      },
      select: ['tracking'],
    });
    for (const rct of recoltes) {
      listRctTrackings.push(rct.tracking);
    }
    if (listRctTrackings.length > 0) {
      return listRctTrackings;
    } else {
      return null;
    }
  }

  async getRecolteAgencePresRecolte(user: User) {
    const listRctTrackings = [];
    const userStation = await this.userService.findInformationsEmploye(user.id);
    const recoltes = await this.recolteRepository.find({
      relations: ['createdOn', 'createdOn.commune', 'createdOn.commune.wilaya'],
      where: {
        receivedBy: null,
        createdOn: userStation.employe.agence,
      },
      select: ['tracking'],
    });
    for (const rct of recoltes) {
      listRctTrackings.push(rct.tracking);
    }
    if (listRctTrackings.length > 0) {
      return listRctTrackings;
    } else {
      return null;
    }
  }

  // #############################################################################
  // #############################################################################
  // #############################################################################
  async receiveRecoltes(user, rctTrackings: string[]) {

    const dateRecept = new Date();
    const userStation = await this.userService.findInformationsEmploye(user.id);
    if (userStation.typeUser === TypeUserEnum.caissierAgence) {
      console.log(
        '🚀 ~ file: recoltes.service.ts ~ line 346 ~ RecoltesService ~ receiveRecoltes ~ userStation.typeUser ',
        userStation.typeUser,
      );
      for await (const rctTracking of rctTrackings) {
        const recolte = await this.recolteRepository.findOne({
          relations: [
            'createdOn',
            'createdOn.commune',
            'createdOn.commune.wilaya',
          ],
          where: {
            receivedBy: null,
            tracking: rctTracking.toLowerCase(),
            createdOn: userStation.employe.agence,
          },
        });

        if (recolte) {
          await this.shipmentService.setShipmentsOfRecolteStatusRecolte(
            user,
            recolte.id,
          );

          recolte.receivedBy = userStation;
          recolte.receivedOn = userStation.employe.agence;
          recolte.receivedAt = dateRecept;
          await this.recolteRepository.update(recolte.id, recolte);
        }
      }
    } else if (userStation.typeUser === TypeUserEnum.caissierRegional) {
      for await (const rctTracking of rctTrackings) {
        const recolte = await this.recolteRepository.findOne({
          relations: [
            'createdOn',
            'createdOn.commune',
            'createdOn.commune.wilaya',
          ],
          where: {
            receivedBy: null,
            tracking: rctTracking.toLowerCase(),
            createdOn: {
              commune: {
                wilaya: {
                  caisseRegional: userStation.employe.agence,
                },
              },
            },
          },
        });

        if (recolte) {
          await this.shipmentService.setShipmentsOfRecolteStatusRecolte(
            user,
            recolte.id,
          );

          recolte.receivedBy = userStation;
          recolte.receivedOn = userStation.employe.agence;
          recolte.receivedAt = dateRecept;
          await this.recolteRepository.update(recolte.id, recolte);
        }
      }
    } else {
      for await (const rctTracking of rctTrackings) {
        const recolte = await this.recolteRepository.findOne({
          where: {
            tracking: rctTracking.toLowerCase(),
            receivedBy: null,
          },
        });

        if (recolte) {
          await this.shipmentService.setShipmentsOfRecolteStatusRecolte(
            user,
            recolte.id,
          );

          recolte.receivedBy = userStation;
          recolte.receivedOn = userStation.employe.agence;
          recolte.receivedAt = dateRecept;
          await this.recolteRepository.update(recolte.id, recolte);
        }
      }
    }
    return true;
  }
  // #############################################################################
  // #############################################################################
  // #############################################################################

  async getInformationsPaiementToLiberer(reqestedUser: User) {
    let totalRamasse = 0;
    let netClient = 0;
    let gain = 0;
    let nbrColis = 0;
    const listRecolte = [];
    const listDateRecolte = [];
    const listClients = [];
    const listInformations = {};
    const userStation = await this.userService.findInformationsEmploye(
      reqestedUser.id,
    );
    let recoltes: Recolte[];
    if (userStation.typeUser === TypeUserEnum.caissierAgence) {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('recolte.createdOn', 'agence')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.recolte}'`,
        )
        .andWhere(`agence.id=${userStation.employe.agence.id}`)
        .getMany();
    } else if (userStation.typeUser === TypeUserEnum.caissierRegional) {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('recolte.createdOn', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.recolte}'`,
        )
        .andWhere(`wilaya.caisseRegional=${userStation.employe.agence.id}`)
        .getMany();
    } else {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.recolte}'`,
        )
        .getMany();
    }

    for await (const recolte of recoltes) {
      for await (const shipment of recolte.shipment) {
        const statusShipment = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.recolte
        ) {
          let tarifsBordereau = 0;
          const tarifLivraison =
            await this.shipmentService.calculTarifslivraison(shipment.tracking);

          const clientInfo = await this.clientService.findOne(
            statusShipment[0].user.id,
          );

          const client = {
            id: clientInfo.client_id,
            nomCommercial: clientInfo.client_nomCommercial,
          };

          if (!listClients.some((c) => c.id === client.id)) {
            listClients.push(client);
          }

          if (shipment.livraisonGratuite) {
            tarifsBordereau = shipment.prixVente;
            totalRamasse += shipment.prixVente;
          } else {
            tarifsBordereau = shipment.prixVente + tarifLivraison;
            totalRamasse += tarifLivraison + shipment.prixVente;
          }
          netClient += tarifsBordereau - tarifLivraison;
          gain += tarifLivraison;
          nbrColis += 1;
          if (
            recolte.shipment.length > 0 &&
            !listRecolte.includes(recolte.tracking)
          ) {
            listRecolte.push(recolte.tracking);
          }
          if (
            !listDateRecolte.includes(
              recolte.receivedAt.toLocaleDateString('fr-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
            )
          ) {
            listDateRecolte.push(
              recolte.receivedAt.toLocaleDateString('fr-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
            );
          }
        }
      }
    }

    listInformations['listDateRecolte'] = listDateRecolte;
    listInformations['listRecolte'] = listRecolte;
    listInformations['listClients'] = listClients;
    listInformations['nbrColis'] = nbrColis;
    listInformations['totalRamasse'] = totalRamasse;
    listInformations['netClient'] = netClient;
    listInformations['gain'] = gain;
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 248 ~ RecoltesService ~ getInformationsPaiementToLiberer ~ listInformations',
      listInformations,
    );
    return listInformations;
  }

  async getSoldeAgence(reqestedUser: User) {
    let totalRamasse = 0;
    let netClient = 0;
    let gain = 0;
    let nbrColis = 0;
    let fraiRetoure = 0;
    const listRecolte = [];
    const listDateRecolte = [];
    const listClients = [];
    const listInformations = {};
    let recoltes: Recolte[];

    const userStation = await this.userService.findInformationsEmploye(
      reqestedUser.id,
    );

    if (userStation.typeUser === TypeUserEnum.caissierAgence) {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('recolte.receivedOn', 'agence')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.pretAPayer}'`,
        )
        .andWhere(`agence.id=${userStation.employe.agence.id}`)
        .getMany();
    } else if (userStation.typeUser === TypeUserEnum.caissierRegional) {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('recolte.createdOn', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.pretAPayer}'`,
        )
        .andWhere(`wilaya.caisseRegional=${userStation.employe.agence.id}`)
        .getMany();
    } else {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.pretAPayer}'`,
        )
        .getMany();
      console.log(
        '🚀 ~ file: recoltes.service.ts ~ line 573 ~ RecoltesService ~ getSoldeAgence ~ recoltes',
        recoltes,
      );
    }

    for await (const recolte of recoltes) {
      for await (const shipment of recolte.shipment) {
        const statusShipment = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.pretAPayer
        ) {
          let tarifsBordereau = 0;
          const tarifLivraison =
            await this.shipmentService.calculTarifslivraison(shipment.tracking);

          const clientInfo = await this.clientService.findOne(
            statusShipment[0].user.id,
          );

          const client = {
            id: clientInfo.client_id,
            nomCommercial: clientInfo.client_nomCommercial,
          };

          if (!listClients.some((c) => c.id === client.id)) {
            listClients.push(client);
          }

          if (shipment.livraisonGratuite) {
            tarifsBordereau = shipment.prixVente;
            totalRamasse += shipment.prixVente;
          } else {
            tarifsBordereau = shipment.prixVente + tarifLivraison;
            totalRamasse += tarifLivraison + shipment.prixVente;
          }

          netClient += tarifsBordereau - tarifLivraison;
          gain += tarifLivraison;
          nbrColis += 1;

          if (
            recolte.shipment.length > 0 &&
            !listRecolte.includes(recolte.tracking)
          ) {
            listRecolte.push(recolte.tracking);
          }

          if (
            !listDateRecolte.includes(
              recolte.receivedAt.toLocaleDateString('fr-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
            )
          ) {
            listDateRecolte.push(
              recolte.receivedAt.toLocaleDateString('fr-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
            );
          }
        }
      }
    }
    /**
     * sommer tt les frai retoure de tt les client pre a payer
     */
    for await (const client of listClients) {
      fraiRetoure += await this.shipmentService.getInfoFraiRetourOfClient(
        client.id,
      );
      console.log(
        '🚀----------------------------------------------------------------------',
        fraiRetoure,
      );
    }

    listInformations['listDateRecolte'] = listDateRecolte;
    listInformations['listRecolte'] = listRecolte;
    listInformations['listClients'] = listClients;
    listInformations['fraiRetoure'] = fraiRetoure;
    listInformations['nbrColis'] = nbrColis;
    listInformations['totalRamasse'] = totalRamasse;
    listInformations['netClient'] = netClient - fraiRetoure;
    listInformations['gain'] = gain + fraiRetoure;
    return listInformations;
  }

  async libererParIdRecolte(user: User, tracking) {
    const userAgence = await this.userService.findInformationsEmploye(user.id);

    const recolte = await this.recolteRepository
      .createQueryBuilder('recolte')
      .leftJoinAndSelect('recolte.shipment', 'shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(
        `recolte.tracking = '${tracking.toLowerCase()}' and  recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.recolte
        }'`,
      )
      .getOne();
    console.log("🚀 ~ file: recoltes.service.ts ~ line 713 ~ RecoltesService ~ libererParIdRecolte ~ recolte", recolte)
    for await (const shipment of recolte.shipment) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        statusShipment[statusShipment.length - 1].libelle ===
        StatusShipmentEnum.recolte
      ) {
        console.log('--------------',statusShipment[statusShipment.length - 1].userAffect)
        delete shipment.status;
        await this.statusService.create({
          shipment: shipment,
          user: user.id,
          libelle: StatusShipmentEnum.pretAPayer,
          userAffect: statusShipment[statusShipment.length - 1].userAffect
            ? statusShipment[statusShipment.length - 1].userAffect.id : null,
        });

        await this.shipmentService.update_v2(shipment.id, {
          libererAt: new Date(),
          libererBy: userAgence,
          libererOn: userAgence.employe.agence,
        });
      }
    }
    if (recolte.shipment.length > 0) {
      return true;
    } else throw new NotFoundException(Recolte, 'La récolte est déja libérer');
  }
  async libererParDateRecolte(user, dateRecolte) {
    const startDay = new Date(dateRecolte);
    startDay.setTime(
      startDay.getTime() - new Date().getTimezoneOffset() * 60 * 1000,
    );
    startDay.setHours(0, 0, 0);
    console.log('date start', startDay);
    const endDay = new Date(startDay);
    endDay.setHours(23, 59, 59);
    console.log('date end', endDay);
    const recoltes = await this.recolteRepository
      .createQueryBuilder('recolte')
      .leftJoinAndSelect('recolte.shipment', 'shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(
        `recolte.receivedBy is not null and 
          (recolte.receivedAt BETWEEN '${startDay.toISOString()}' and '${endDay.toISOString()}')
           and status.libelle = '${StatusShipmentEnum.recolte}'`,
      )
      .getMany();
    const userAgence = await this.userService.findInformationsEmploye(user.id);

    for await (const recolte of recoltes) {
      for await (const shipment of recolte.shipment) {
        const statusShipment = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.recolte
        ) {
          delete shipment.status
          await this.statusService.create({
            // shipment: await this.shipmentService.findOne(shipment.id),
            shipment: shipment,
            user: user.id,
            libelle: StatusShipmentEnum.pretAPayer,
            userAffect: statusShipment[statusShipment.length - 1].userAffect 
            ? statusShipment[statusShipment.length - 1].userAffect.id : null,
          });

          await this.shipmentService.updateLibererPaiementParDate(shipment.id, {
            libererAt: new Date(),
            libererBy: userAgence,
            libererOn: userAgence.employe.agence,
          });
        }
      }
    }
    if (recoltes.length > 0) {
      return true;
    } else throw new NotFoundException(Recolte, 'La récolte est déja libérer');
  }

  async libererParClient(user: User, clientId) {
    const userClient = await this.clientService.findUserInformationsOfClient(
      clientId,
    );

    const userAgence = await this.userService.findInformationsEmploye(user.id);
    if (userClient) {
      return await this.shipmentService.libererShipmentsOfClientRecolte(
        userAgence,
        userClient.user.id,
      );
    }
  }

  findAll() {
    return `This action returns all recoltes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recolte`;
  }

  update(id: number, updateRecolteDto: UpdateRecolteDto) {
    return `This action updates a #${id} recolte`;
  }

  remove(id: number) {
    return `This action removes a #${id} recolte`;
  }
  async generateRct() {
    const x1 = 'rct-';
    let x2 = '';
    let x3 = '';
    for (let i = 0; i < 3; i++) {
      x2 += Math.floor(Math.random() * 10);
    }
    for (let i = 0; i < 3; i++) {
      const alph = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ];
      x3 += alph[Math.floor(Math.random() * 25)];
    }
    const tracking = x1 + x2 + x3;
    const response = await this.recolteRepository.findOne({
      where: {
        tracking: tracking,
      },
    });
    while (response) {
      await this.generateRct();
    }
    return tracking.toLowerCase();
  }
  //
  async printRecolteManifest(recolteId, res) {
    console.log(recolteId, 'hakim');
    const listTracking = [];
    let montant = 0;
    const recolte = await this.recolteRepository.findOne({
      relations: ['recolteCoursier', 'createdBy'],
      where: {
        id: recolteId,
      },
    });
    if (recolte) {
      let userInfo;
      const listShipmentOfRecolte =
        await this.shipmentService.getShipmentsOfRecolte(recolte.id);

      if (recolte.recolteCoursier == null) {
        userInfo =
          await this.employeService.findOneByUserId(
            recolte.createdBy.id,
          );

      } else {
        userInfo =
          await this.coursierService.findInformationOfCoursierByUserId(
            recolte.recolteCoursier.id,
          );
      }
      for await (const shipment of listShipmentOfRecolte) {
        let cost = 0;
        const tarifLivraison = await this.shipmentService.calculTarifslivraison(
          shipment.tracking,
        );
        if (shipment.livraisonGratuite) {
          cost += shipment.prixVente;
          montant += cost;
        } else {
          cost += tarifLivraison + shipment.prixVente;
          montant += cost;
        }
        listTracking.push([shipment.tracking + ' ' + cost + '   ']);
      }
      const buffer = await this.pdfService.printRecolteManifest(
        recolte,
        listTracking,
        userInfo,
        montant,
      );
      const buf = Buffer.from(buffer);
      res.send(buf);
      return res;
    }
  }
}
