/* eslint-disable prettier/prettier */
import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
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
import { ServiceClientService } from '../service-client/service-client.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateRecolteDto } from './dto/create-recolte.dto';
import { UpdateRecolteDto } from './dto/update-recolte.dto';
import { Recolte } from './entities/recolte.entity';

@Injectable()
export class RecoltesService {
  logger: Logger = new Logger(RecoltesService.name);
  constructor(
    @InjectRepository(Recolte) private recolteRepository: Repository<Recolte>,
    @Inject(forwardRef(() => ShipmentsService))
    private shipmentService: ShipmentsService,
    private statusService: StatusService,
    private userService: UsersService,
    private coursierService: CoursierService,
    private employeService: EmployesService,
    private clientService: ClientsService,
    private pdfService: PdfService,
    private readonly serviceClientService: ServiceClientService,
  ) {}

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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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
        .leftJoinAndSelect('recolte.shipmentCs', 'shipmentCs')
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

      const recolte = this.recolteRepository.create();
      recolte.createdBy = userStation;
      recolte.createdOn = userStation.employe.agence;
      recolte.typeRtc = 'coursier';
      recolte.receivedAt = null;
      recolte.receivedBy = null;
      recolte.receivedOn = null;
      recolte.recolteCoursier = userCoursierInfo;
      const recolteSave = await this.recolteRepository.save(recolte);
      const tracking = 'rec-' + (await this.generateTracking(recolteSave.id));
      await this.recolteRepository.update(recolteSave.id, {
        tracking: tracking,
      });

      for await (const shipment of shipmentLivreOfCoursier) {
        console.log(
          '🚀 ~ file: recoltes.service.ts ~ line 236 ~ RecoltesService ~ forawait ~ shipment',
        );
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
    let montant = 0;
    const dateRecolte = new Date();
    const listOfRecolte: string[] = [];
    const employeInfo = await this.userService.findInformationsEmploye(user.id);
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 267 ~ RecoltesService ~ createRecolteDesk ~ employeInfo',
      employeInfo,
    );
    const shipmentLivreDesk = await this.shipmentService.findShipmentLivreDesk(
      user,
    );
    if (shipmentLivreDesk.length > 0) {
      //creation de la recolte
      const recolte = this.recolteRepository.create();
      recolte.createdBy = employeInfo;
      recolte.createdOn = employeInfo.employe.agence;
      recolte.typeRtc = 'desk';
      recolte.receivedAt = null;
      recolte.receivedBy = null;
      recolte.receivedOn = null;
      recolte.recolteCoursier = null;
      const recolteSave = await this.recolteRepository.save(recolte);
      const tracking = 'rec-' + (await this.generateTracking(recolteSave.id));
      await this.recolteRepository.update(recolteSave.id, {
        tracking: tracking,
      });
      for await (const shipment of shipmentLivreDesk) {
        let cost = 0;
        if (shipment.service_nom.toLowerCase() == 'classique divers' || shipment.service_nom.toLowerCase() == 'soumission' || shipment.service_nom.toLowerCase() == 'cahier de charge' ) {
          if (shipment.shipment_cashOnDelivery) {
            console.log(
              '*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/',
            );
            console.log(shipment);
            const createdCs = await this.userService.findOne(
              shipment.shipment_createdById,
            );
            cost = await this.serviceClientService.getEstimateTarif(createdCs, {
              communeId: shipment.commune_id,
              poids: shipment.shipment_poids,
              longueur: shipment.shipment_longueur,
              largeur: shipment.shipment_largeur,
              hauteur: shipment.shipment_hauteur,
              wilayaId: shipment.commune_wilayaId,
              livraisonDomicile: shipment.shipment_livraisonDomicile,
              livraisonStopDesck: shipment.shipment_livraisonStopDesck,
              service: shipment.service_nom
            });
          } else {
            cost = 0;
          }
          montant += cost;
        } else {
          const tarifLivraison =
            await this.shipmentService.calculTarifslivraison(
              shipment.shipment_tracking,
            );
          if (shipment.shipment_livraisonGratuite) {
            cost += shipment.shipment_prixVente;
            montant += cost;
          } else {
            cost += tarifLivraison + shipment.shipment_prixVente;
            montant += cost;
          }
        }
        console.log(
          '🚀 ~ file: recoltes.service.ts ~ line 284 ~ RecoltesService ~ forawait ~ shipment',
          shipment,
        );
        if (shipment.shipment_lastStatus == StatusShipmentEnum.pasPres) {
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
          // await this.statusService.create({
          //   shipment: await this.shipmentService.findOne(shipment.shipment_id),
          //   user: user,
          //   libelle: StatusShipmentEnum.recolte,
          //   createdAt: this.addToDate(dateRecolte),
          //   userAffect: null,
          //   createdOn: employeInfo.employe.agence.id,
          // });
          //
        }
      }
      await this.recolteRepository.update(recolteSave.id, {
        montant: montant,
      });
      return await this.printRecolteManifest(recolteSave.id, resp);
    } else {
      throw new NotFoundException();
    }
  }

  async createRecolteCs(user: User, resp) {
    const employeInfo = await this.userService.findInformationsEmploye(user.id);

    const shipments = await this.shipmentService.findShipmentCreatedInDesk(
      employeInfo,
    );

    let montant = 0;
    for await (const shipment of shipments) {
      let tarifLivraison = 0;
      if (shipment.cashOnDelivery == true) {
        tarifLivraison = 0;
      } else {
        tarifLivraison = await this.serviceClientService.getEstimateTarif(
          user,
          {
            communeId: shipment.commune.id,
            poids: shipment.poids,
            longueur: shipment.longueur,
            largeur: shipment.largeur,
            hauteur: shipment.hauteur,
            wilayaId: shipment.commune.wilaya.id,
            livraisonDomicile: shipment.livraisonDomicile,
            livraisonStopDesck: shipment.livraisonStopDesck,
            service: shipment.service.nom,
          },
        );
      }
      montant += tarifLivraison;
    }

    if (shipments.length > 0) {
      const recolteSc = this.recolteRepository.create({
        shipmentCs: shipments,
        createdBy: employeInfo,
        createdOn: employeInfo.employe.agence,
        recolteCS: employeInfo,
        montant: montant,
        typeRtc: 'cs',
      });

      const recolteScSave = await this.recolteRepository.save(recolteSc);
      const tracking = 'rec-' + (await this.generateTracking(recolteScSave.id));
      await this.recolteRepository.update(recolteScSave.id, {
        tracking: tracking,
      });

      this.logger.error('recolteScSave');
      return await this.printRecolteCs(recolteScSave.id, resp);
    }
  }

  addToDate(objDate) {
    const numberOfMlSeconds = objDate.getTime();
    const addMlSeconds = 1000;
    const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
  }
  async getRecoltePresRecolte() {
    console.log('88888888888888888888888888888888888888');
    const listRctTrackings = [];
    const recoltes = await this.recolteRepository.find({
      where: {
        receivedBy: null,
      },
      select: ['tracking', 'montant'],
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
    console.log('4444444444444444444444444');
    const listRctTrackings = [];
    const userStation = await this.userService.findInformationsEmploye(user.id);
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 393 ~ RecoltesService ~ getRecolteAgencePresRecolte ~ userStation',
      userStation,
    );
    const recoltes = await this.recolteRepository.find({
      relations: ['createdOn', 'createdOn.commune', 'createdOn.commune.wilaya'],
      where: {
        receivedBy: null,
        createdOn: userStation.employe.agence,
      },
      select: ['tracking'],
    });
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 402 ~ RecoltesService ~ getRecolteAgencePresRecolte ~ recoltes',
      recoltes,
    );
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
    let fraisRetour = 0;
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
        .leftJoinAndSelect('shipment.service', 'service')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.recolte}'`,
        )
        .andWhere(`agence.id=${userStation.employe.agence.id}`)
        .getMany();
      this.logger.error(
        '/////////////---------------------------///////////////////////////////',
      );
    } else if (userStation.typeUser === TypeUserEnum.caissierRegional) {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('recolte.createdOn', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('shipment.service', 'service')
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
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('shipment.status', 'status')
        .where(
          `recolte.receivedBy is not null and status.libelle = '${StatusShipmentEnum.recolte}'`,
        )
        .getMany();
    }

    for await (const recolte of recoltes) {
      for await (const shipment of recolte.shipment) {
        if (shipment.service.nom.toLowerCase() != 'classique divers' && shipment.service.nom.toLowerCase() != 'soumission' && shipment.service.nom.toLowerCase() != 'cahier de charge' ) {
          const statusShipment = await this.statusService.getShipmentStatusById(
            shipment.id,
          );
          if (
            statusShipment[statusShipment.length - 1].libelle ===
            StatusShipmentEnum.recolte
          ) {
            let tarifsBordereau = 0;
            const tarifLivraison =
              await this.shipmentService.calculTarifslivraison(
                shipment.tracking,
              );

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
            let totalFraiCOD = 0;
            console.log(
              'hhhhhhhhhhhhhhhhhhhhhhhhhhh',
              shipment.prixVente,
              clientInfo.client_c_o_d_ApartirDe,
            );
            if (shipment.prixEstimer > clientInfo.client_c_o_d_ApartirDe) {
              totalFraiCOD +=
                (clientInfo.client_tauxCOD / 100) * shipment.prixEstimer;
            }
            netClient += tarifsBordereau - tarifLivraison - totalFraiCOD;
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
    }
    for await (const client of listClients) {
      const monatantRetour =
        await this.shipmentService.getInfoFraiRetourOfClient(client.id);
      fraisRetour += monatantRetour.fraieRetoure;
    }
    listInformations['listDateRecolte'] = listDateRecolte;
    listInformations['listRecolte'] = listRecolte;
    listInformations['listClients'] = listClients;
    listInformations['nbrColis'] = nbrColis;
    listInformations['totalRamasse'] = totalRamasse;
    listInformations['netClient'] = netClient - fraisRetour;
    // listInformations['gain'] = gain;

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
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('recolte.receivedOn', 'agence')
        .leftJoinAndSelect('shipment.service', 'service')
        .where(
          `recolte.receivedBy is not null and shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}'`,
        )
        .andWhere(`agence.id=${userStation.employe.agence.id}`)
        .getMany();
    } else if (userStation.typeUser === TypeUserEnum.caissierRegional) {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('recolte.createdOn', 'agence')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .where(
          `recolte.receivedBy is not null and shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}'`,
        )
        .andWhere(`wilaya.caisseRegional=${userStation.employe.agence.id}`)
        .getMany();
    } else {
      recoltes = await this.recolteRepository
        .createQueryBuilder('recolte')
        .leftJoinAndSelect('recolte.shipment', 'shipment')
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .where(
          `recolte.receivedBy is not null and shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}'`,
        )
        .getMany();
      console.log(
        '🚀 ~ file: recoltes.service.ts ~ line 573 ~ RecoltesService ~ getSoldeAgence ~ recoltes',
        recoltes,
      );
    }

    for await (const recolte of recoltes) {
      for await (const shipment of recolte.shipment) {
        if (
          shipment.lastStatus === StatusShipmentEnum.pretAPayer &&
          shipment.service.nom.toLowerCase() != 'classique divers' && shipment.service.nom.toLowerCase() != 'soumission' && shipment.service.nom.toLowerCase() != 'cahier de charge'
        ) {
          let tarifsBordereau = 0;
          const tarifLivraison =
            await this.shipmentService.calculTarifslivraison(shipment.tracking);

          console.log("🚀 ~ file: recoltes.service.ts ~ line 714 ~ RecoltesService ~ forawait ~ tarifLivraison", tarifLivraison)

          const clientInfo = await this.clientService.findOne(
            shipment.createdBy.id,
          );
          console.log("🚀 ~ file: recoltes.service.ts ~ line 720 ~ RecoltesService ~ forawait ~ clientInfo", clientInfo)

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
          let totalFraiCOD = 0;
          if (shipment.prixEstimer > clientInfo.client_c_o_d_ApartirDe) {
            totalFraiCOD +=
              (clientInfo.client_tauxCOD / 100) * shipment.prixEstimer;
          }

          netClient += tarifsBordereau - tarifLivraison - totalFraiCOD;
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
    console.log("🚀 ~ file: recoltes.service.ts ~ line 780 ~ RecoltesService ~ forawait ~ listClients", listClients)

    for await (const client of listClients) {
      const retoure = await this.shipmentService.getInfoFraiRetourOfClient(
        client.id,
      );
      fraiRetoure += retoure.fraieRetoure;
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
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `recolte.tracking = '${tracking.toLowerCase()}' and  recolte.receivedBy is not null and status.libelle = '${
          StatusShipmentEnum.recolte
        }'`,
      )
      .getOne();
    console.log(
      '🚀 ~ file: recoltes.service.ts ~ line 713 ~ RecoltesService ~ libererParIdRecolte ~ recolte',
      recolte,
    );
    for await (const shipment of recolte.shipment) {
      if (shipment.service.nom.toLowerCase() != 'classique divers' && shipment.service.nom.toLowerCase() != 'soumission' && shipment.service.nom.toLowerCase() != 'cahier de charge') {
        const statusShipment = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.recolte
        ) {
          console.log(
            '--------------',
            statusShipment[statusShipment.length - 1].userAffect,
          );
          delete shipment.status;
          await this.statusService.create({
            shipment: shipment,
            user: user.id,
            libelle: StatusShipmentEnum.pretAPayer,
            userAffect: statusShipment[statusShipment.length - 1].userAffect
              ? statusShipment[statusShipment.length - 1].userAffect.id
              : null,
          });

          await this.shipmentService.update_v2(shipment.id, {
            libererAt: new Date(),
            libererBy: userAgence,
            libererOn: userAgence.employe.agence,
          });
        }
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
      .leftJoinAndSelect('shipment.service', 'service')
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
        if (shipment.service.nom.toLowerCase() != 'classique divers' && shipment.service.nom.toLowerCase() != 'soumission' && shipment.service.nom.toLowerCase() != 'cahier de charge') {
          const statusShipment = await this.statusService.getShipmentStatusById(
            shipment.id,
          );
          if (
            statusShipment[statusShipment.length - 1].libelle ===
            StatusShipmentEnum.recolte
          ) {
            delete shipment.status;
            await this.statusService.create({
              // shipment: await this.shipmentService.findOne(shipment.id),
              shipment: shipment,
              user: user.id,
              libelle: StatusShipmentEnum.pretAPayer,
              userAffect: statusShipment[statusShipment.length - 1].userAffect
                ? statusShipment[statusShipment.length - 1].userAffect.id
                : null,
            });

            await this.shipmentService.updateLibererPaiementParDate(
              shipment.id,
              {
                libererAt: new Date(),
                libererBy: userAgence,
                libererOn: userAgence.employe.agence,
              },
            );
          }
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
  async generateTracking(id) {
    let code = id.toString();
    while (code.length < 8) code = '0' + code;
    return code.toLowerCase();
  }
  //
  async getRecolteDetail(tracking) {
    const listColis = [];
    const recolte = await this.recolteRepository.findOne({
      relations: [
        'recolteCoursier',
        'createdBy',
        'createdBy.employe',
        'shipment',
        'shipmentCs',
      ],
      where: {
        tracking: tracking,
      },
    });
    this.logger.error(
      '*-----------------------*-----------------------*-----------------------------*',
    );
    console.log('shipment --->', recolte.shipment.length);
    console.log('shipmentCs --->', recolte.shipmentCs.length);
    if (recolte) {
      for await (const shipment of recolte.shipment) {
        console.log(
          '🚀 ~ file: recoltes.service.ts ~ line 945 ~ RecoltesService ~ forawait ~ shipment',
          shipment.tracking,
        );
        let cost = 0;
        const tarifLivraison = await this.shipmentService.calculTarifslivraison(
          shipment.tracking,
        );
        console.log(
          '🚀 ~ file: recoltes.service.ts ~ line 950 ~ RecoltesService ~ forawait ~ tarifLivraison',
          tarifLivraison,
        );
        if (shipment.livraisonGratuite) {
          cost += shipment.prixVente;
        } else {
          cost += tarifLivraison + shipment.prixVente;
        }

        shipment['recouvrement'] = cost;
        listColis.push(shipment);
      }
      console.log(listColis);
      return [recolte, listColis];
    } else {
      throw new EntityNotFoundError(Recolte, tracking);
    }
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
        userInfo = await this.employeService.findOneByUserId(
          recolte.createdBy.id,
        );
      } else {
        userInfo = await this.coursierService.findInformationOfCoursierByUserId(
          recolte.recolteCoursier.id,
        );
      }
      for await (const shipment of listShipmentOfRecolte) {
        let cost = 0;
        let tarifLivraison = 0;
        if (shipment.service.nom.toLowerCase() == 'classique divers' || shipment.service.nom.toLowerCase() == 'soumission' || shipment.service.nom.toLowerCase() == 'cahier de charge') {
          if (shipment.cashOnDelivery) {
            cost = await this.serviceClientService.getEstimateTarif(
              shipment.createdBy,
              {
                communeId: shipment.commune.id,
                poids: shipment.poids,
                longueur: shipment.longueur,
                largeur: shipment.largeur,
                hauteur: shipment.hauteur,
                wilayaId: shipment.commune.wilaya.id,
                livraisonDomicile: shipment.livraisonDomicile,
                livraisonStopDesck: shipment.livraisonStopDesck,
                service: shipment.service.nom
              },
            );
          } else {
            cost = 0;
          }
          montant += cost;
        } else {
          tarifLivraison = await this.shipmentService.calculTarifslivraison(
            shipment.tracking,
          );
          if (shipment.livraisonGratuite) {
            cost += shipment.prixVente;
            montant += cost;
          } else {
            cost += tarifLivraison + shipment.prixVente;
            montant += cost;
          }
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
  async printRecolteCs(recolteId: number, res) {
    const listTracking = [];
    let montant = 0;
    const recolte = await this.recolteRepository.findOne({
      relations: [
        'recolteCS',
        'createdBy',
        'createdBy.employe',
        'createdBy.employe.agence',
        'createdBy.employe.agence.commune',
        'createdBy.employe.agence.commune.wilaya',
        'shipmentCs',
        'shipmentCs.createdBy',
        'shipmentCs.commune',
        'shipmentCs.service',
        'shipmentCs.commune.wilaya',
      ],
      where: {
        id: recolteId,
      },
    });

    for await (const shipment of recolte.shipmentCs) {
      let tarifLivraison = 0;
      this.logger.error(shipment.service.nom)
      if (shipment.cashOnDelivery) {
        tarifLivraison = 0;
      } else {
        tarifLivraison = await this.serviceClientService.getEstimateTarif(
          shipment.createdBy,
          {
            communeId: shipment.commune.id,
            poids: shipment.poids,
            longueur: shipment.longueur,
            largeur: shipment.largeur,
            hauteur: shipment.hauteur,
            wilayaId: shipment.commune.wilaya.id,
            livraisonDomicile: shipment.livraisonDomicile,
            livraisonStopDesck: shipment.livraisonStopDesck,
            service: shipment.service.nom,
          },
        );
      }
      listTracking.push([shipment.tracking] + ' ' + tarifLivraison);
      montant += tarifLivraison;
    }

    const buffer = await this.pdfService.printRecolteCsManifest(
      recolte,
      listTracking,
      recolte.createdBy,
      montant,
    );

    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  async createRecolteRegularisation(userId, montant, pmts) {
    let listPmts = [];
    const userStation = await this.userService.findInformationsEmploye(userId);
    const recolte = this.recolteRepository.create();
    const recolteSave = await this.recolteRepository.save({
      typeRtc: 'régularisation',
      montant: montant,
      createdBy: userStation,
      createdOn: userStation.employe.agence,
      pmts: pmts,
    });
    const tracking = 'rec-' + (await this.generateTracking(recolteSave.id));
    recolte.tracking = tracking;
    const recolteToUpdate = this.recolteRepository.update(
      recolteSave.id,
      recolte,
    );

    for await (const pmt of pmts) {
      listPmts.push(pmt.tracking);
    }

    const recolteToPrint = await this.recolteRepository.findOne(recolteSave.id);
    return await this.pdfService.printRecolteRegularisationOrFacture(
      recolteToPrint,
      listPmts,
      userStation.employe,
      montant,
    );
  }

  async createRecolteFacture(userId, montant, factures) {
    let listFacture = [];
    const userStation = await this.userService.findInformationsEmploye(userId);
    const recolte = this.recolteRepository.create();
    const recolteSave = await this.recolteRepository.save({
      typeRtc: 'facture',
      montant: montant,
      createdBy: userStation,
      createdOn: userStation.employe.agence,
      factures: factures,
    });
    const tracking = 'rec-' + (await this.generateTracking(recolteSave.id));
    recolte.tracking = tracking;
    const recolteToUpdate = this.recolteRepository.update(
      recolteSave.id,
      recolte,
    );

    for await (const facture of factures) {
      listFacture.push(facture.numFacture);
    }

    const recolteToPrint = await this.recolteRepository.findOne(recolteSave.id);
    return await this.pdfService.printRecolteRegularisationOrFacture(
      recolteToPrint,
      listFacture,
      userStation.employe,
      montant,
    );
  }

  async getRecolteRegularisationOrfactureByUserId(userId,type) {
    const recoltes = await this.recolteRepository.find({
      where: { typeRtc: type ,createdBy: { id: userId } },
      relations: ['createdBy', 'receivedBy'],
      order:{id:"DESC"}
    });
    if (recoltes) {
      return recoltes;
    } else {
      throw new EntityNotFoundError(Recolte, 'pas de récoltes');
    }
  }

  async printRecolteRegularisationOrFacture(recolteId) {
    const recolte = await this.recolteRepository.findOne({
      relations: ['createdBy', 'pmts','factures'],
      where: {
        id: recolteId,
      },
    });
    if (recolte) {
    if (recolte.typeRtc=='régularisation') {
    const listPmts = [];
      const userStation  = await this.userService.findInformationsEmploye(recolte.createdBy.id);
      const montant = recolte.montant;
      for await (const pmt of recolte.pmts) {
        listPmts.push(pmt.tracking);
      }
    return await this.pdfService.printRecolteRegularisationOrFacture(recolte,listPmts,userStation.employe,montant);
    } else if(recolte.typeRtc=='facture') {
      const listFacture = [];
      const userStation  = await this.userService.findInformationsEmploye(recolte.createdBy.id);
      const montant = recolte.montant;
      for await (const facture of recolte.factures) {
        listFacture.push(facture.numFacture);
      }
    return await this.pdfService.printRecolteRegularisationOrFacture(recolte,listFacture,userStation.employe,montant);
    }
   
    }
      throw new EntityNotFoundError(Recolte, 'pas de récolte');
    
    
  }
}
