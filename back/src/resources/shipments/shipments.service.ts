import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import JSZip = require('jszip');
import { InjectRepository } from '@nestjs/typeorm';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CommunesService } from '../communes/communes.service';
import { ServicesService } from '../services/services.service';
import { Status } from '../status/entities/status.entity';
import { StatusService } from '../status/status.service';
import { UsersService } from '../users/users.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { Shipment } from './entities/shipment.entity';
import { ClientsService } from '../clients/clients.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { ZonesService } from '../zones/zones.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { PoidsService } from '../poids/poids.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { EmployesService } from '../employes/employes.service';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Recolte } from 'src/resources/recoltes/entities/recolte.entity';
import { CoursierService } from 'src/resources/coursier/coursier.service';
import { User } from '../users/entities/user.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { AgencesTypesEnum } from 'src/enums/agencesTypesEnum';
import { SacTypeEnum } from 'src/enums/sacTypeEnum';
import { AgencesService } from '../agences/agences.service';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { FactureService } from '../facture/facture.service';
import { CreateShipmentFromAgenceDto } from './dto/create-shipment-from-agence.dto';
import { RotationsService } from '../rotations/rotations.service';
import { CreateAspirationShipmentDto } from './dto/createAspirationShipmentDto';
import { Facture } from '../facture/entities/facture.entity';
import { ServiceClientService } from '../service-client/service-client.service';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';

/**
 *
 */
@Injectable()
export class ShipmentsService {
  logger = new Logger(ShipmentsService.name);

  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    private communeService: CommunesService,
    private userService: UsersService,
    private servicesService: ServicesService,
    @Inject(forwardRef(() => StatusService))
    private statusService: StatusService,
    private clientService: ClientsService,
    private clientTarifService: ClientsTarifsService,
    private zoneService: ZonesService,
    private codeTarifsZonesService: CodeTarifsZonesService,
    private employeService: EmployesService,
    private poidsService: PoidsService,
    private coursierService: CoursierService,
    private wilayaService: WilayasService,
    private pdfService: PdfService,
    private agenceService: AgencesService,
    private excelService: ExcelService,
    private pmtCoursierService: PmtCoursierService,
    private factureService: FactureService,
    private rotationService: RotationsService,
    private serviceClientService: ServiceClientService,
  ) {}

  /**
   *
   * @param createShipmentDto
   * @param user
   * @returns
   */
  async create(createShipmentDto: CreateShipmentDto[], user: any) {
    // const userClient = await this.userService.findOne(user.id);
    for await (const shipment of createShipmentDto) {
      shipment.createdBy = user;
      const newShipment = this.shipmentRepository.create(shipment);
      const service = await this.servicesService.findOne(shipment.serviceId);
      const commune = await this.communeService.findOne(shipment.communeId);
      newShipment.service = service;
      newShipment.commune = commune;
      if (shipment.prixVente < 1000) {
        shipment.prixEstimer = 1000;
      } else {
        shipment.prixEstimer = shipment.prixVente;
      }
      const saveShipment = await this.shipmentRepository.save(newShipment);
      const saveStatus = await this.statusService.create({
        shipment: saveShipment,
        user: user,
        libelle: StatusShipmentEnum.enPreparation,
      });
      if (shipment.echange) {
        shipment.createdBy = user;
        const newShipmentechange = this.shipmentRepository.create(shipment);
        const service = await this.servicesService.findOne(shipment.serviceId);
        const commune = await this.communeService.findOne(shipment.communeId);
        newShipmentechange.service = service;
        newShipmentechange.commune = commune;
        newShipmentechange.echange = false;
        newShipmentechange.objetRecuperer = null;
        newShipmentechange.shipmentRelation = saveShipment;

        const saveShipmentEchange = await this.shipmentRepository.save(
          newShipmentechange,
        );
        const saveStatusEchange = await this.statusService.create({
          shipment: saveShipmentEchange,
          user: user,
          libelle: StatusShipmentEnum.enAttenteDeChangement,
        });
        saveShipment.shipmentRelation = saveShipmentEchange;
        await this.shipmentRepository.save(saveShipment);
      }
    }
    return true;
  }
  async createShipmentByFile(
    user,
    serviceSelected,
    shipmentAdded: CreateAspirationShipmentDto[],
  ) {
    const countEchec = [];
    const listServiceClient = await this.servicesService.findServicesOfUser(
      user,
    );

    if (
      listServiceClient.some(
        (service) => service.service_id === serviceSelected,
      )
    ) {
      const clientInfo = await this.clientService.infoClientByUserId(user.id);
      for await (const shipment of shipmentAdded) {
        shipment.createdBy = user;
        const newShipment = this.shipmentRepository.create();
        const service = await this.servicesService.findOne(serviceSelected);
        const communeDestination = await this.communeService.findOneByNomLatin(
          shipment.commune,
        );
        const volume =
          shipment.longueur * shipment.largeur * shipment.hauteur * 200;

        if (
          shipment.poids <= 150 &&
          volume <= 150 &&
          shipment.raisonSociale.length < 50 &&
          shipment.nom.length < 50 &&
          shipment.prenom.length < 50 &&
          shipment.nom.length >= 3 &&
          shipment.prenom.length >= 3 &&
          shipment.adresse.length < 50 &&
          (shipment.telephone.length == 10 || shipment.telephone.length == 9) &&
          shipment.numCommande.length < 15 &&
          shipment.designationProduit.length >= 3 &&
          shipment.designationProduit.length < 50 &&
          shipment.commune.length >= 3 &&
          shipment.longueur >= 0 &&
          shipment.largeur >= 0 &&
          shipment.hauteur >= 0 &&
          shipment.poids >= 0 &&
          shipment.objetRecuperer.length <= 50
        ) {
          if (communeDestination) {
            const findRotation =
              await this.rotationService.findOneRotationByDepartId_DestinationId(
                clientInfo.communeDepart.wilaya.id,
                communeDestination.wilaya.id,
              );
            if (findRotation) {
              if (shipment.prixVente < 1000) {
                shipment.prixEstimer = 1000;
              } else {
                shipment.prixEstimer = shipment.prixVente;
              }
              newShipment.tracking = null;
              newShipment.service = service;
              newShipment.createdBy = user;
              newShipment.raisonSociale = shipment.raisonSociale;
              newShipment.nom = shipment.nom;
              newShipment.prenom = shipment.prenom;
              newShipment.telephone = shipment.telephone;
              newShipment.numCommande = shipment.numCommande;
              newShipment.designationProduit = shipment.designationProduit;
              newShipment.livraisonStopDesck = shipment.livraisonStopDesck;
              newShipment.livraisonDomicile = !shipment.livraisonStopDesck;
              newShipment.commune = communeDestination;
              newShipment.adresse = shipment.adresse;
              newShipment.prixVente = shipment.prixVente;
              newShipment.prixEstimer = shipment.prixEstimer;
              newShipment.livraisonGratuite = shipment.livraisonGratuite;
              newShipment.poids = shipment.poids;
              newShipment.largeur = shipment.largeur;
              newShipment.longueur = shipment.longueur;
              newShipment.hauteur = shipment.hauteur;
              newShipment.echange =
                shipment.echange != null ? shipment.echange : false;
              newShipment.ouvrireColis = false;
              newShipment.objetRecuperer = shipment.objetRecuperer;
              const saveShipment = await this.shipmentRepository.save(
                newShipment,
              );
              const saveStatus = await this.statusService.create({
                shipment: saveShipment,
                user: user,
                libelle: StatusShipmentEnum.enPreparation,
              });
              if (shipment.echange) {
                shipment.createdBy = user;
                const newShipmentechange = this.shipmentRepository.create();
                const service = await this.servicesService.findOne(
                  shipment.serviceId,
                );
                const commune = await this.communeService.findOne(
                  communeDestination.id,
                );
                newShipmentechange.createdBy = user;
                newShipmentechange.raisonSociale = shipment.raisonSociale;
                newShipmentechange.nom = shipment.nom;
                newShipmentechange.prenom = shipment.prenom;
                newShipmentechange.telephone = shipment.telephone;
                newShipmentechange.numCommande = shipment.numCommande;
                newShipmentechange.designationProduit =
                  shipment.designationProduit;
                newShipmentechange.livraisonStopDesck =
                  shipment.livraisonStopDesck;
                newShipmentechange.livraisonDomicile =
                  !shipment.livraisonStopDesck;
                newShipmentechange.commune = communeDestination;
                newShipmentechange.adresse = shipment.adresse;
                newShipmentechange.prixVente = shipment.prixVente;
                newShipmentechange.prixEstimer = shipment.prixEstimer;
                newShipmentechange.livraisonGratuite =
                  shipment.livraisonGratuite;
                newShipmentechange.poids = shipment.poids;
                newShipmentechange.largeur = shipment.largeur;
                newShipmentechange.longueur = shipment.longueur;
                newShipmentechange.hauteur = shipment.hauteur;
                newShipmentechange.service = service;
                newShipmentechange.commune = commune;
                newShipmentechange.echange = false;
                newShipmentechange.objetRecuperer = null;
                newShipmentechange.shipmentRelation = saveShipment;

                const saveShipmentEchange = await this.shipmentRepository.save(
                  newShipmentechange,
                );
                const saveStatusEchange = await this.statusService.create({
                  shipment: saveShipmentEchange,
                  user: user,
                  libelle: StatusShipmentEnum.enAttenteDeChangement,
                });
                saveShipment.shipmentRelation = saveShipmentEchange;
                await this.shipmentRepository.save(saveShipment);
              }
            } else {
              countEchec.push({ shipment: shipment.idRaw });
            }
          } else {
            countEchec.push({ shipment: shipment.idRaw });
          }
        } else {
          countEchec.push({ shipment: shipment.idRaw });
        }
      }
    }
    console.log('echec', countEchec);
    if (countEchec.length == 0) {
      return true;
    } else {
      return countEchec;
    }
  }
  timertoTentativeEchouee: any;
  async toTentativeEchouee(shipment: Shipment, user: User, msg: string) {
    let userInfo;
    if (user.typeUser == TypeUserEnum.coursier) {
      userInfo = await this.coursierService.findInformationOfCoursierByUserId(
        user.id,
      );
    } else {
      userInfo = await this.employeService.findOneByUserId(user.id);
    }
    this.timertoTentativeEchouee = setTimeout(async () => {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        statusShipment[statusShipment.length - 1].libelle ==
        StatusShipmentEnum.enAlerte
      ) {
        const clientUserId = statusShipment[0].user.id;
        const nbrTentavieClient = await this.clientService.findOne(
          clientUserId,
        );

        let count = 0;
        for await (const stat of statusShipment) {
          if (stat.libelle === StatusShipmentEnum.enAlerte) {
            count += 1;
          }
        }
        console.log(
          '******************',
          count,
          nbrTentavieClient.client_nbTentative,
        );

        if (count < nbrTentavieClient.client_nbTentative) {
          await this.statusService.create({
            shipment: shipment,
            user: user,
            userAffect: user,
            libelle: StatusShipmentEnum.tentativeEchoue,
            comment: msg,
            createdOn: userInfo.agence.id,
          });
        } else {
          console.log('ho1');
          await this.statusService.create({
            shipment: shipment,
            user: user,
            userAffect: user,
            libelle: StatusShipmentEnum.echecLivraison,
            comment: msg,
            createdOn: userInfo.agence.id,
          });
        }
      }
    }, 20000); // 2 minute
  }

  async setShipmentEnAlert(user, tracking, msg) {
    const dateDuJour = new Date();
    let userInfo;
    if (user.typeUser == TypeUserEnum.coursier) {
      userInfo = await this.coursierService.findInformationOfCoursierByUserId(
        user.id,
      );
    } else {
      userInfo = await this.employeService.findOneByUserId(user.id);
    }
    const shipment = await this.findOneShipmnetByTraking(tracking);
    const shipmentStatus = await this.statusService.getShipmentStatusById(
      shipment.id,
    );
    const dateLastStatus = shipmentStatus[shipmentStatus.length - 1].createdAt;

    if (
      ((shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.enAttenteDuClient ||
        shipmentStatus[shipmentStatus.length - 1].libelle ==
          StatusShipmentEnum.tentativeEchoue) &&
        dateDuJour.getDate() !== dateLastStatus.getDate()) ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.sortiEnLivraison ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.recueAgence ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.recueWilaya ||
      (shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.expidie &&
        shipment.commune.wilaya.id == userInfo.agence.commune.wilaya.id)
    ) {
      const newStatus = await this.statusService.create({
        shipment: shipment,
        user: user,
        userAffect: user,
        libelle: StatusShipmentEnum.enAlerte,
        comment: msg,
        createdOn: userInfo.agence.id,
      });
      this.toTentativeEchouee(shipment, user, msg);
      return shipment;
    }
  }

  async setShipmentStatusEchecLivraison(user, tracking, msg) {
    const dateDuJour = new Date();
    let userInfo;
    if (user.typeUser == TypeUserEnum.coursier) {
      userInfo = await this.coursierService.findInformationOfCoursierByUserId(
        user.id,
      );
    } else {
      userInfo = await this.employeService.findOneByUserId(user.id);
    }
    const shipment = await this.findOneShipmnetByTraking(tracking);
    const shipmentStatus = await this.statusService.getShipmentStatusById(
      shipment.id,
    );
    const dateLastStatus = shipmentStatus[shipmentStatus.length - 1].createdAt;
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 169 ~ ShipmentsService ~ setShipmentStatusEchecLivraison ~ dateLastStatus',
      dateLastStatus,
    );

    if (
      (shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.expidie &&
        shipment.commune.wilaya.id == userInfo.agence.commune.wilaya.id) ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.sortiEnLivraison ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.enAttenteDuClient ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.tentativeEchoue ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.enAlerte ||
      ((shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.recueAgence ||
        shipmentStatus[shipmentStatus.length - 1].libelle ==
          StatusShipmentEnum.recueWilaya) &&
        shipment.livraisonStopDesck == true &&
        shipment.livraisonDomicile == false)
    ) {
      const newStatus = await this.statusService.create({
        shipment: shipment,
        user: user,
        userAffect: user,
        libelle: StatusShipmentEnum.echecLivraison,
        comment: msg,
        createdAt: dateDuJour,
        createdOn: userInfo.agence.id,
      });
      return shipment;
    }
  }

  async setShipmentLivre(user, tracking) {
    const dateLivraison = new Date();
    clearTimeout(this.timertoTentativeEchouee);
    const shipment = await this.findOneShipmnetByTraking(tracking);
    const shipmentStatus = await this.statusService.getShipmentStatusById(
      shipment.id,
    );
    let userInfo;
    if (user.typeUser == TypeUserEnum.coursier) {
      userInfo = await this.coursierService.findInformationOfCoursierByUserId(
        user.id,
      );
    } else {
      userInfo = await this.employeService.findOneByUserId(user.id);
    }
    if (
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.sortiEnLivraison ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.enAttenteDuClient ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.tentativeEchoue ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.enAlerte ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.recueAgence ||
      shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.recueWilaya ||
      (shipmentStatus[shipmentStatus.length - 1].libelle ==
        StatusShipmentEnum.expidie &&
        shipment.commune.wilaya.id == userInfo.agence.commune.wilaya.id)
    ) {
      await this.statusService.create({
        shipment: shipment,
        user: user,
        userAffect: user,
        libelle: StatusShipmentEnum.livre,
        createdAt: dateLivraison,
        createdOn: userInfo.agence.id,
      });
      //
      await this.statusService.create({
        shipment: shipment,
        user: user,
        userAffect: user,
        libelle: StatusShipmentEnum.pasPres,
        createdAt: this.addToDate(dateLivraison),
        createdOn: userInfo.agence.id,
      });
      if (shipment.echange == true) {
        const shipmentEchange = await this.findOne(
          shipment.shipmentRelation.id,
        );
        console.log(
          '🚀 ~ file: shipments.service.ts ~ line 320 ~ ShipmentsService ~ setShipmentLivre ~ shipmentEchange',
          shipmentEchange,
        );
        if (
          shipmentEchange.lastStatus == StatusShipmentEnum.enAttenteDeChangement
        ) {
          console.log('its okay');
          await this.statusService.create({
            shipment: shipmentEchange,
            user: user,
            userAffect: user,
            libelle: StatusShipmentEnum.echange,
            createdAt: this.addToDate(dateLivraison),
            createdOn: userInfo.agence.id,
          });
        }
      }
      //
    }
    return shipment;
  }

  async shipmentOfCoursierAlivrer(user: User) {
    const listShipmnetsOfCoursier: Shipment[] = [];
    const shipmnets = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `status.libelle = '${StatusShipmentEnum.affectedToCoursier}' and
      status.userAffectId = ${user.id} and
      shipment.recolteId is null`,
      )
      .getMany();

    for await (const shipment of shipmnets) {
      const shipmnetStatus =
        await this.statusService.getShipmentStatusByShipmentUserAffected(
          shipment,
          user,
        );
      if (
        (shipmnetStatus[shipmnetStatus.length - 1].libelle ==
          StatusShipmentEnum.sortiEnLivraison ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.enAlerte ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.tentativeEchoue ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.enAttenteDuClient) &&
        // || shipmnetStatus[shipmnetStatus.length - 1].libelle ==
        //   StatusShipmentEnum.echecLivraison ||

        !listShipmnetsOfCoursier.includes(shipment)
      ) {
        listShipmnetsOfCoursier.push(shipment);
      }
    }
    return listShipmnetsOfCoursier;
  }
  async shimentStopDeskALivrer(user) {
    const listShipments: Shipment[] = [];
    const employeInfo = await this.employeService.findOneByUserId(user.id);

    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `status.libelle = '${StatusShipmentEnum.expidie}' and
      shipment.recolteId is null and shipment.livraisonStopDesck is true and shipment.livraisonDomicile is false
      and wilaya.id = ${employeInfo.agence.commune.wilaya.id}`,
      )
      .distinctOn(['shipment.id'])
      .getMany();

    for await (const shipment of shipments) {
      const shipmnetStatus = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        (shipmnetStatus[shipmnetStatus.length - 1].libelle ==
          StatusShipmentEnum.recueWilaya ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.recueAgence ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.enAlerte ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.tentativeEchoue ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.enAttenteDuClient ||
          (shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.expidie &&
            shipment.commune.wilaya.id ==
              employeInfo.agence.commune.wilaya.id)) &&
        // || shipmnetStatus[shipmnetStatus.length - 1].libelle ==
        //   StatusShipmentEnum.echecLivraison ||

        !listShipments.includes(shipment)
      ) {
        console.log('hakim');
        listShipments.push(shipment);
        // console.log(
        //   '🚀 ~ file: shipments.service.ts ~ line 334 ~ ShipmentsService ~ forawait ~ listShipments',
        //   listShipments,
        // );
      }
    }
    return listShipments;
  }
  async getTrackingCoursierReceive(user: User) {
    const listShipmentsReseive: string[] = [];
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `status.libelle = '${StatusShipmentEnum.affectedToCoursier}' and 
    status.userAffectId = ${user.id}`,
      )
      .distinct()
      .getMany();
    for await (const shipment of shipments) {
      const shipmentStatus =
        await this.statusService.getShipmentStatusByShipmentUserAffected(
          shipment,
          user,
        );
      if (
        shipment.service.nom.toLowerCase() == 'classique divers' ||
        shipment.service.nom.toLowerCase() == 'soumission' ||
        shipment.service.nom.toLowerCase() == 'cahier de charge'
      ) {
        console.log(
          '🚀 ~ file: shipments.service.ts ~ line 469 ~ ShipmentsService ~ forawait ~ shipment.service.nom',
          shipment.service.nom,
        );
        if (
          shipmentStatus[shipmentStatus.length - 1].libelle ==
            StatusShipmentEnum.affectedToCoursier &&
          shipmentStatus.length <= 3
        ) {
          listShipmentsReseive.push(shipment.tracking);
        }
      } else {
        const client = await this.clientService.findClientByShipment(shipment);
        console.log(
          '🚀 ~ file: shipments.service.ts ~ line 143 ~ ShipmentsService ~ forawait ~ client',
          client,
        );
        if (
          shipmentStatus[shipmentStatus.length - 1].libelle ==
            StatusShipmentEnum.affectedToCoursier &&
          shipmentStatus.length <= client.nbTentative
        ) {
          listShipmentsReseive.push(shipment.tracking);
        }
      }
    }
    return listShipmentsReseive;
  }

  async receiveShipmentCoursier(user: User, trackings: string[]) {
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    let nbTrackings = trackings.length;
    for await (const tracking of trackings) {
      const shipment = await this.findOneShipmnetByTraking(tracking);
      const statusShipment =
        await this.statusService.getShipmentStatusByShipmentUserAffected(
          shipment,
          user,
        );
      if (
        statusShipment[statusShipment.length - 1].libelle ==
        StatusShipmentEnum.affectedToCoursier
      ) {
        const saved = await this.statusService.create({
          shipment: shipment,
          user: user,
          libelle: StatusShipmentEnum.sortiEnLivraison,
          userAffect: user,
        });
        if (saved) {
          nbTrackings--;
        }
      }
    }
    if (nbTrackings == 0) {
      return true;
    } else {
      return false;
    }
  }

  async createInterneShipment(createInterneShipmentDto, user, res) {
    const destinataireInfo = await this.employeService.findOne(
      createInterneShipmentDto.userId,
    );
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    if (destinataireInfo != null) {
      // const id = await this.shipmentRepository.count();
      const shipment = {
        raisonSociale: 'YALIDINE EXPRESS',
        tracking: null,
        nom: destinataireInfo.nom,
        prenom: destinataireInfo.prenom,
        telephone: destinataireInfo.numTelephone,
        adresse: '',
        numCommande: '',
        designationProduit: createInterneShipmentDto.designation,
        objetRecuperer: '',
        serviceId: 1,
        communeId: destinataireInfo.agence.commune.id,
        prixVente: 0,
        poids: 0,
        longueur: 0,
        largeur: 0,
        hauteur: 0,
        livraisonGratuite: true,
        ouvrireColis: true,
        livraisonStopDesck: true,
        livraisonDomicile: false,
      };
      const newShipment = this.shipmentRepository.create(shipment);
      const service = await this.servicesService.findOne(shipment.serviceId);
      const commune = await this.communeService.findOne(shipment.communeId);
      console.log(
        '🚀 ~ file: shipments.service.ts ~ line 113 ~ ShipmentsService ~ createInterneShipment ~ commune',
        commune,
      );

      newShipment.service = service;
      newShipment.commune = commune;

      const saveShipment = await this.shipmentRepository.save(newShipment);
      const tracking = await this.generateYal(saveShipment.id);
      saveShipment.tracking = tracking;
      const updatedShipment = await this.shipmentRepository.update(
        saveShipment.id,
        saveShipment,
      );
      console.log(updatedShipment, user, employeInfo.agence.id);
      const saveStatusPresExpidie = await this.statusService.create({
        shipment: saveShipment,
        user: user,
        libelle: StatusShipmentEnum.presExpedition,
        createdOn: employeInfo.agence.id,
      });
      console.log(
        '🚀 ~ file: shipments.service.ts ~ line 126 ~ ShipmentsService ~ createInterneShipment ~ saveStatusPresExpidie',
        saveStatusPresExpidie,
      );
      this.logger.debug(this.createInterneShipment.name, 'befor buffer');
      const buffer = await this.printBordereau(newShipment.id, user);
      const buf = Buffer.from(buffer);
      res.send(buf);
      this.logger.debug(this.createInterneShipment.name, 'after buffer');
      return res;
    }
  }
  findAll() {
    return `This action returns all shipments`;
  }

  async findOne(id: number) {
    const shipment = await this.shipmentRepository.findOne(id, {
      relations: ['service', 'commune', 'commune.wilaya', 'shipmentRelation'],
    });
    if (shipment) {
      return shipment;
    } else {
      throw new EntityNotFoundError(Shipment, id);
    }
  }

  async remove(id: number, userId: number) {
    const shipment = await this.findOneById(id);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 732 ~ ShipmentsService ~ remove ~ shipment.tracking',
      shipment.id,
    );
    if (shipment) {
      console.log(1);
      if (await this.statusService.remove(shipment.id, userId)) {
        console.log(2);
        return await this.shipmentRepository.softRemove(shipment);
      }
      console.log(3);

      return await this.shipmentRepository.softRemove(shipment);
    }
  }

  async findOneById(id: number) {
    const shipment = await this.shipmentRepository.findOne({
      relations: ['commune', 'service', 'shipmentRelation'],
      where: { id: id },
    });
    if (shipment) {
      return shipment;
    } else {
      throw new EntityNotFoundError(Shipment, id);
    }
  }

  async findOneShipmnetByTraking(traking: string) {
    const shipment = await this.shipmentRepository.findOne({
      relations: ['commune', 'commune.wilaya', 'shipmentRelation'],
      where: {
        tracking: traking.toLowerCase(),
      },
    });
    if (!shipment) {
      throw new EntityNotFoundError(Shipment, traking);
    } else {
      return shipment;
    }
  }
  async setShipmentRamasser(user: any, trackings: any) {
    const coursierInfo =
      await this.userService.findInformationOfCoursierByUserId(user.id);
    if (trackings.length != null) {
      for (let tracking of trackings) {
        tracking = tracking.toLowerCase();
        const express_reg = new RegExp(/^\d{8}$/i);
        if (express_reg.test(tracking)) {
          const shipment = await this.findOneShipmnetByTraking(tracking);
          if (shipment != undefined) {
            const statusShipment =
              await this.statusService.getShipmentStatusById(shipment.id);
            if (
              statusShipment[statusShipment.length - 1].libelle ==
              StatusShipmentEnum.presExpedition
            ) {
              const createStautsShipment = await this.statusService.create({
                user: user,
                shipment: shipment,
                libelle: StatusShipmentEnum.ramasse,
              });
            }
          }
        }
      }
      return true;
    }
  }
  async setShipmentExpedier(user: any, trackings: any) {
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    if (trackings.length != null) {
      for (let tracking of trackings) {
        tracking = tracking.toLowerCase();
        const express_reg = new RegExp(/^\d{8}$/i);
        if (express_reg.test(tracking)) {
          const shipment = await this.findOneShipmnetByTraking(tracking);
          if (shipment != undefined) {
            const statusShipment =
              await this.statusService.getShipmentStatusById(shipment.id);
            if (
              statusShipment[statusShipment.length - 1].libelle ==
                StatusShipmentEnum.presExpedition ||
              statusShipment[statusShipment.length - 1].libelle ==
                StatusShipmentEnum.ramasse
            ) {
              const createStautsShipment = await this.statusService.create({
                user: user,
                shipment: shipment,
                libelle: StatusShipmentEnum.expidie,
                createdOn: employeInfo.agence.id,
              });
            }
          }
        }
      }
      return true;
    }
  }

  async setShipmentsPreExpedition(shipmentIds: number[], user: any, res: any) {
    const listshipmentPrinted = [];
    if (shipmentIds.length != null) {
      for await (const shipmentId of shipmentIds) {
        const status = await this.statusService.getShipmentStatusByUser(
          user.user.id,
          shipmentId,
        );
        if (
          status &&
          status[status.length - 1].libelle == StatusShipmentEnum.enPreparation
        ) {
          const shipmentInfo = await this.findOneById(shipmentId);

          const tracking = await this.generateYal(shipmentInfo.id);

          shipmentInfo.tracking = tracking;
          await this.shipmentRepository.save(shipmentInfo);
          console.log(
            '🚀 ~ file: shipments.service.ts ~ line 633 ~ ShipmentsService ~ forawait ~ shipmentInfo',
            shipmentInfo,
          );
          const saveShipmentStatus = await this.statusService.create({
            shipment: shipmentInfo,
            user: user.user.id,
            libelle: StatusShipmentEnum.presExpedition,
          });
          console.log(
            '🚀 ~ file: shipments.service.ts ~ line 862 ~ ShipmentsService ~ forawait ~ saveShipmentStatus',
            saveShipmentStatus,
          );
          if (shipmentInfo.echange == true) {
            const shipmentInfoEchange = await this.findOneById(
              shipmentInfo.shipmentRelation.id,
            );
            console.log(
              '🚀 ~ file: shipments.service.ts ~ line 640 ~ ShipmentsService ~ forawait ~ shipmentInfoEchange',
              shipmentInfoEchange,
            );
            const tracking2 = await this.generateYal(shipmentInfoEchange.id);
            console.log(
              '🚀 ~ file: shipments.service.ts ~ line 644 ~ ShipmentsService ~ forawait ~ tracking2',
              tracking2,
            );
            shipmentInfoEchange.tracking = tracking2;
            await this.shipmentRepository.save(shipmentInfoEchange);
          }
          const buffer = await this.printBordereau(shipmentId, user);

          listshipmentPrinted.push({
            buffer: buffer,
            tracking: shipmentInfo.tracking,
          });
        }
        // if (shipmentFind) {
      }
      if (listshipmentPrinted.length == 1) {
        const buf = Buffer.from(listshipmentPrinted[0].buffer);
        res.send(buf);
        return res;
      } else if (listshipmentPrinted.length > 1) {
        const zip = new JSZip();
        for await (const shipment of listshipmentPrinted) {
          console.log(shipment.tracking, shipment.buffer);
          zip.file(shipment.tracking + '.pdf', shipment.buffer);
        }
        const blob = await zip.generateAsync({
          type: 'nodebuffer',
        });
        res.attachment('Colis.zip');
        res.send(blob);
        return res;
      } else {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Objet n"existe pas',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }
  async printBordereau(shipmentId: number, userRequest) {
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 824 ~ ShipmentsService ~ printBordereau ~ shipmentId',
      shipmentId,
    );
    const shipmentsStatus = await this.statusService.getShipmentStatusById(
      shipmentId,
    );
    if (
      shipmentsStatus.some(
        (packageStat) =>
          packageStat.libelle === StatusShipmentEnum.presExpedition,
      )
    ) {
      const user = shipmentsStatus[0].user.id;
      const datePresExpedition = shipmentsStatus[0].createdAt;

      const shipmentInfo = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('status.user', 'user')
        .leftJoinAndSelect('shipment.shipmentRelation', 'shipmentRelation')
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .where(`user.id = ${user} and shipment.id = '${shipmentId}'`)
        .getRawOne();
      console.log(
        '🚀 ~ file: shipments.service.ts ~ line 847 ~ ShipmentsService ~ printBordereau ~ shipmentInfo',
        shipmentInfo,
      );

      //diferencier le colis interne par raport au autre
      if (shipmentInfo.service_id === 1) {
        const detinataireInfo = await this.employeService.findByNomPrenom(
          shipmentInfo.shipment_nom,
          shipmentInfo.shipment_prenom,
        );

        const employeInfo = await this.employeService.findOneByUserId(user);

        this.logger.debug(this.printBordereau.name, 'befor pdfService');
        const buffer = await this.pdfService.generateInterneShipment(
          shipmentInfo,
          employeInfo,
          detinataireInfo,
          datePresExpedition,
        );
        return buffer;
      } else {
        this.logger.debug(userRequest.user);
        if (userRequest.typeUser === 1976729) {
          shipmentInfo.andWhere(`${userRequest.id} = ${user}`);
        }
        if (shipmentInfo) {
          const clientInfo = await this.clientService.findOne(user);
          const tarifLivraison = await this.calculTarifslivraison(
            shipmentInfo.shipment_tracking,
          );
          const recouvrement = tarifLivraison + shipmentInfo.shipment_prixVente;

          const buffer = await this.pdfService.printBordereauModel(
            shipmentInfo,
            clientInfo,
            tarifLivraison,
            recouvrement,
            datePresExpedition,
          );
          return buffer;
        } else {
          throw new EntityNotFoundError(Shipment, 'Pas de Colis');
        }
      }
    }
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto) {
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 938 ~ ShipmentsService ~ update ~ updateShipmentDto',
      updateShipmentDto,
    );
    const shipment = await this.shipmentRepository.findOne(id, {
      relations: ['createdBy'],
    });
    const client = shipment.createdBy;
    const shipmentToUpdate = this.shipmentRepository.create(updateShipmentDto);
    const commune = await this.communeService.findOne(
      updateShipmentDto.communeId,
    );
    const service = await this.servicesService.findOne(
      updateShipmentDto.serviceId,
    );

    if (updateShipmentDto.prixVente < 1000) {
      updateShipmentDto.prixEstimer = 1000;
    } else {
      updateShipmentDto.prixEstimer = updateShipmentDto.prixVente;
    }

    shipmentToUpdate.createdBy = client;
    shipmentToUpdate.service = service;
    shipmentToUpdate.commune = commune;
    const responce = await this.shipmentRepository.update(id, shipmentToUpdate);
    return responce;
  }

  async updateShipmentRecolteId(id: number, recolte: Recolte) {
    const shipmentInfo = await this.shipmentRepository.findOneOrFail(id);
    shipmentInfo.recolte = recolte;
    return await this.shipmentRepository.update(id, shipmentInfo);
  }
  async updateStopDeskToDomicile(id: number, adresse: string) {
    const shipmentInfo = await this.shipmentRepository.findOneOrFail(id);
    shipmentInfo.adresse = adresse;
    shipmentInfo.livraisonStopDesck = false;
    shipmentInfo.livraisonDomicile = true;
    return await this.shipmentRepository.update(id, shipmentInfo);
  }
  async updateShipmentLastStatus(
    shipment,
    user,
    lastStatus: StatusShipmentEnum,
  ) {
    shipment.lastStatus = lastStatus;
    shipment.userLastStatus = user;
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 659 ~ ShipmentsService ~ setShipmentsPreExpedition ~ shipment',
      shipment,
    );
    const up = await this.shipmentRepository.update(shipment.id, shipment);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 659 ~ ShipmentsService ~ setShipmentsPreExpedition ~ up',
      up,
    );
    return up;
  }
  async updateLibererPaiementParDate(id: number, updateShipmentDto) {
    return await this.shipmentRepository.update(id, updateShipmentDto);
  }
  async generateYal(id) {
    let tracking = id.toString();
    while (tracking.length < 8) tracking = '0' + tracking;
    return tracking.toLowerCase();
  }

  async createFromAgence(
    shipment: CreateShipmentFromAgenceDto,
    createdBy: User,
    tarifLivraison: number,
    res: any,
  ) {
    const newShipment = this.shipmentRepository.create(shipment);

    const saveShipment = await this.shipmentRepository.save(newShipment);
    console.log(`-----------> SERVICE ::::>>>> ${saveShipment.service.nom}`);
    const saveStatus = await this.statusService.create({
      shipment: saveShipment,
      user: createdBy,
      libelle: StatusShipmentEnum.enPreparation,
      createdOn: createdBy.employe.agence.id,
    });

    saveShipment.tracking = await this.generateYal(saveShipment.id);
    const setPreExpidier = await this.statusService.create({
      shipment: saveShipment,
      user: createdBy,
      libelle: StatusShipmentEnum.presExpedition,
      createdOn: createdBy.employe.agence.id,
    });

    saveShipment.lastStatus = StatusShipmentEnum.presExpedition;
    await this.shipmentRepository.save(saveShipment);

    let accShipment: Shipment;
    let page_2;
    if (shipment.switched != null) {
      this.logger.error(
        '//**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*/--0',
      );
      this.logger.error(shipment.switched);
      switch (saveShipment.service.nom.toLowerCase()) {
        case 'cahier de charge':
          accShipment = this.shipmentRepository.create({
            nom: saveShipment.expiditeurPublic.nomExp,
            prenom: saveShipment.expiditeurPublic.prenomExp,
            telephone: saveShipment.expiditeurPublic.telephoneExp,
            raisonSociale: saveShipment.expiditeurPublic.raisonSocialeExp,
            adresse: saveShipment.expiditeurPublic.adresseExp,
            service: saveShipment.service,
            prixEstimer: shipment.prixEstimer,
            poids: 0,
            longueur: 0,
            largeur: 0,
            hauteur: 0,
            createdBy: createdBy,
            livraisonDomicile: true,
            livraisonStopDesck: false,
            expiditeurPublic: shipment.switched,
            designationProduit: 'acuser de ' + saveShipment.designationProduit,
            cashOnDelivery: false,
            commune: createdBy.employe.agence.commune,
            parentShipment: saveShipment,
          });

          this.logger.error(
            '//**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*/--1',
          );
          const savedAcc = await this.shipmentRepository.save(accShipment);
          const saveStatus = await this.statusService.create({
            shipment: savedAcc,
            user: createdBy,
            libelle: StatusShipmentEnum.enPreparation,
            createdOn: createdBy.employe.agence.id,
          });
          this.logger.error(
            '//**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*/--2',
          );

          savedAcc.tracking = await this.generateYal(savedAcc.id);
          await this.shipmentRepository.save(savedAcc);
          const setPreExpidier = await this.statusService.create({
            shipment: savedAcc,
            user: createdBy,
            libelle: StatusShipmentEnum.enAttenteDeLiveraison,
            createdOn: createdBy.employe.agence.id,
          });
          saveShipment.accShipment = [accShipment];
          await this.shipmentRepository.save(saveShipment);
          this.logger.error(
            '//**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*///**/*/*/*/*/*/--3',
          );
          break;

        default:
          break;
      }
    }

    return this.pdfService.generateShipmentAgenceAccuser(
      saveShipment,
      tarifLivraison,
    );
    // return await this.pdfService.generateShipmentAgence(
    //   saveShipment,
    //   tarifLivraison,
    // );
  }
  async calculTarifslivraison(ShipmentTraking) {
    const shipment = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .where(
        `shipment.tracking = '${ShipmentTraking}' and  status.libelle =
          '${StatusShipmentEnum.presExpedition}' `,
      )
      .select(['shipment', 'client'])
      .getRawOne();

    const codeTarif = await this.clientTarifService.getCodeTarif(
      shipment.shipment_serviceId,
      shipment.client_id,
    );

    const wilayaDepart = await this.communeService.getWilayaOfCommune(
      shipment.client_communeDepartId,
    );

    const wilayaDestination = await this.communeService.getWilayaOfCommune(
      shipment.shipment_communeId,
    );

    const zone = await this.zoneService.findZoneByRotation(
      wilayaDepart.wilaya.id,
      wilayaDestination.wilaya.id,
    );
    // surpoids
    const poids = shipment.shipment_poids;

    const volume =
      shipment.shipment_longueur *
      shipment.shipment_largeur *
      shipment.shipment_hauteur *
      200;

    const chekSurpoids = await this.poidsService.chekSurpoids(poids, volume);
    //find tarifs
    const codeTarifZone = await this.codeTarifsZonesService.findCodeTarifZone(
      zone.zone_id,
      codeTarif.codeTarif_id,
      chekSurpoids.id,
    );
    const codeTarifZoneConv =
      await this.codeTarifsZonesService.findCodeTarifZone(
        zone.zone_id,
        codeTarif.codeTarif_id,
        2,
      );
    /**
     * codetarifZoneQurpoids id changed
     */

    const costSurpoids = await this.calculeSurpoids(
      poids,
      volume,
      codeTarifZone.codeTarifZone_tarifPoidsParKg,
      shipment.client_poidsBase,
    );
    let tarifsLivraison;

    if (shipment.shipment_livraisonDomicile) {
      tarifsLivraison =
        costSurpoids + codeTarifZone.codeTarifZone_tarifDomicile;
    } else {
      if (shipment.client_poidsBase <= 30) {
        tarifsLivraison =
          costSurpoids + codeTarifZone.codeTarifZone_tarifStopDesk;
      } else {
        const surpoidsConventionne = await this.calculeSurpoidsConvention(
          shipment.client_poidsBase,
          shipment.client_poidsBase,
          codeTarifZoneConv.codeTarifZone_tarifPoidsParKg,
        );
        console.log(
          '🚀 ~ file: shipments.service.ts ~ line 1166 ~ ShipmentsService ~ calculTarifslivraison ~ surpoidsConventionne',
          surpoidsConventionne,
        );
        tarifsLivraison =
          costSurpoids +
          (codeTarifZone.codeTarifZone_tarifStopDesk + surpoidsConventionne) -
          (shipment.client_poidsBase *
            codeTarifZoneConv.codeTarifZone_tarifPoidsParKg) /
            5;
      }
    }
    return tarifsLivraison;
  }

  async calculeSurpoids(
    poids: number,
    volume: number,
    poidsKG: number,
    poidsBase: number,
  ) {
    const costPoids = poids * poidsKG - poidsBase * poidsKG;
    const costVolume = volume * poidsKG - poidsBase * poidsKG;

    if (costPoids > costVolume && costPoids >= 0) {
      return costPoids;
    } else if (costPoids <= costVolume && costVolume >= 0) {
      return costVolume;
    }
    return 0;
  }
  async calculeSurpoidsConvention(
    poids: number,
    volume: number,
    poidsKG: number,
  ) {
    const costPoids = poids * poidsKG - 5 * poidsKG;
    const costVolume = volume * poidsKG - 5 * poidsKG;

    if (costPoids > costVolume && costPoids >= 0) {
      return costPoids;
    } else if (costPoids <= costVolume && costVolume >= 0) {
      return costVolume;
    }
    return 0;
  }
  async findAllShipments() {
    const shipments = await this.shipmentRepository.find();
    if (!shipments) {
      throw new EntityNotFoundError(Status, 'Not Found');
    } else {
      return shipments;
    }
  }

  async getTrackingPresExp(user) {
    const infoEmploye = await this.employeService.findOneByUserId(user);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1155 ~ ShipmentsService ~ getTrackingPresExp ~ infoEmploye',
      infoEmploye,
    );
    const listTracking: string[] = [];
    const shipments = await this.shipmentRepository.find({
      relations: ['commune', 'commune.wilaya', 'createdBy', 'service'],
      where: [
        {
          lastStatus: StatusShipmentEnum.presExpedition,
        },
        {
          lastStatus: StatusShipmentEnum.ramasse,
        },
      ],
    });
    for await (const shipment of shipments) {
      if (
        shipment.service.nom.toLowerCase() != 'classique divers' &&
        shipment.service.nom.toLowerCase() != 'soumission' &&
        shipment.service.nom.toLowerCase() != 'cahier de charge'
      ) {
        const inforClient = await this.clientService.infoClientByUserId(
          shipment.createdBy.id,
        );

        if (
          !listTracking.includes(shipment.tracking) &&
          infoEmploye.agence.commune.wilaya.id ===
            inforClient.communeDepart.wilaya.id
        ) {
          listTracking.push(shipment.tracking);
        }
      } else {
        const infoExp = await this.employeService.findOneByUserId(
          shipment.createdBy.id,
        );

        if (
          !listTracking.includes(shipment.tracking) &&
          infoEmploye.agence.commune.wilaya.id ===
            infoExp.agence.commune.wilaya.id
        ) {
          listTracking.push(shipment.tracking);
        }
      }
    }
    console.log(listTracking);
    return listTracking;
  }

  async oneShipmentOfCoursierAlivrer(tracking: string, user: User) {
    const listShipmnetsOfCoursier: Shipment[] = [];
    const shipmnets = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.createdBy', 'user')
      .leftJoinAndSelect('user.client', 'client')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `status.libelle = '${StatusShipmentEnum.affectedToCoursier}' and
      status.userAffectId = ${user.id} and
      shipment.recolteId is null and shipment.tracking = '${tracking}'`,
      )
      .getMany();

    let alertedAt = new Date();
    for await (const shipment of shipmnets) {
      const shipmnetStatus =
        await this.statusService.getShipmentStatusByShipmentUserAffected(
          shipment,
          user,
        );
      if (
        (shipmnetStatus[shipmnetStatus.length - 1].libelle ==
          StatusShipmentEnum.sortiEnLivraison ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.enAlerte ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.tentativeEchoue ||
          shipmnetStatus[shipmnetStatus.length - 1].libelle ==
            StatusShipmentEnum.enAttenteDuClient) &&
        !listShipmnetsOfCoursier.includes(shipment)
      ) {
        listShipmnetsOfCoursier.push(shipment);
      }
      if (
        shipmnetStatus[shipmnetStatus.length - 1].libelle ==
        StatusShipmentEnum.enAlerte
      ) {
        alertedAt = shipment.updatedAt;
      }
    }
    const tarif = await this.calculTarifslivraison(tracking);

    const shipment = {
      id: listShipmnetsOfCoursier[0].id,
      tracking: listShipmnetsOfCoursier[0].tracking,
      tarif: tarif.toString(),
      alertedAt: alertedAt,
      nom_dest: shipmnets[0].nom,
      prom_dest: shipmnets[0].prenom,
      telephone_dest: shipmnets[0].telephone,
      address_dest: shipmnets[0].adresse,
      nom_exp: shipmnets[0].createdBy.client.nomCommercial,
      prom_exp: shipmnets[0].createdBy.client.prenomGerant,
      telephone_exp: shipmnets[0].createdBy.client.telephone,
      address_exp: shipmnets[0].createdBy.client.adresse,
    };

    this.logger.debug('***********************************');
    this.logger.debug('***********************************');
    this.logger.debug('***********************************');
    console.log(shipment);
    return shipment;
  }

  async getTrackingPresExpPickup(user: User) {
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1055 ~ ShipmentsService ~ getTrackingPresExpPickup ~ user',
      user.id,
    );
    const listTracking: string[] = [];
    const coursierInfo =
      await this.userService.findInformationOfCoursierByUserId(user.id);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1059 ~ ShipmentsService ~ getTrackingPresExpPickup ~ coursierInfo',
      coursierInfo,
    );
    const shipments = await this.shipmentRepository.find({
      where: {
        lastStatus: StatusShipmentEnum.presExpedition,
      },
    });

    for await (const shipment of shipments) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.presExpedition &&
        !listTracking.includes(shipment.tracking)
      ) {
        listTracking.push(shipment.tracking);
      }
    }
    console.log(listTracking);
    return listTracking;
  }
  async getShipmentsPresTransfert(user: any) {
    const listshipmentPresTransfert: string[] = [];

    const currentStation = await this.employeService.findOneByUserId(user);

    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(`status.libelle = '${StatusShipmentEnum.expidie}'`)
      .getRawMany();

    for await (const shipment of shipments) {
      const statusShipments = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );

      if (
        statusShipments[statusShipments.length - 1].libelle ==
          StatusShipmentEnum.expidie ||
        statusShipments[statusShipments.length - 1].libelle ==
          StatusShipmentEnum.centre ||
        statusShipments[statusShipments.length - 1].libelle ==
          StatusShipmentEnum.recueWilaya
      ) {
        const stationsLastStatus =
          await this.agenceService.getStationByLastStatus(statusShipments);
        if (currentStation.agence.id == stationsLastStatus.agence_id) {
          listshipmentPresTransfert.push(shipment.shipment_tracking);
        }
      }
    }
    return listshipmentPresTransfert;
  }

  async getTrackingPresVersWilaya(wilayaId, user) {
    const listshipmentPresVersWilaya: string[] = [];
    const currentUserStation =
      await this.employeService.getEmployeStationByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('shipment.userLastStatus', 'userLastStatus')
      .where(`wilaya.id = ${wilayaId.id}`)
      .andWhere(
        `
        shipment.userLastStatusId = ${user.id} and  (shipment.lastStatus = '${StatusShipmentEnum.expidie}' or 
        shipment.lastStatus = '${StatusShipmentEnum.centre}') `,
      )
      .getRawMany();
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1008 ~ ShipmentsService ~ getTrackingPresVersWilaya ~ shipments',
      shipments,
    );

    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 995 ~ ShipmentsService ~ getTrackingPresVersWilaya ~ currentUserStation',
      currentUserStation.agence_id,
    );

    for await (const shipment of shipments) {
      const statusShipments = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );
      if (
        statusShipments[statusShipments.length - 1].libelle ==
          StatusShipmentEnum.expidie ||
        statusShipments[statusShipments.length - 1].libelle ==
          StatusShipmentEnum.centre
      ) {
        const lastStatus = statusShipments[statusShipments.length - 1];
        const userLastStatusStation =
          await this.statusService.getEmployeByStatus(lastStatus);

        if (
          userLastStatusStation.employe_agenceId == currentUserStation.agence_id
        ) {
          listshipmentPresVersWilaya.push(shipment.shipment_tracking);
        }
      }
    }
    return listshipmentPresVersWilaya;
  }

  async getRecoltesOfCoursier(coursierId) {
    this.logger.debug(this.getRecoltesOfCoursier.name, coursierId);
    let montant = 0;
    const listColisOfCoursier = [];
    const userCoursierInfo =
      await this.userService.findInformationUserOfCoursier(coursierId);

    const shipmentsCoursier = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `status.libelle = '${StatusShipmentEnum.pasPres}' and 
        status.userAffectId = ${userCoursierInfo.id} and 
        shipment.recolteId is null`,
      )
      .getRawMany();
    console.log(shipmentsCoursier);
    for (const shipment of shipmentsCoursier) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );
      if (
        statusShipment[statusShipment.length - 1].libelle ===
        StatusShipmentEnum.pasPres
      ) {
        let cost = 0;
        let tarifLivraison = 0;
        if (
          shipment.service_nom.toLowerCase() == 'classique divers' ||
          shipment.service_nom.toLowerCase() == 'soumission' ||
          shipment.service_nom.toLowerCase() == 'cahier de charge'
        ) {
          if (shipment.shipment_cashOnDelivery) {
            const createdCs = await this.userService.findOne(
              shipment.shipment_createdById,
            );
            tarifLivraison = await this.serviceClientService.getEstimateTarif(
              createdCs,
              {
                communeId: shipment.commune_id,
                poids: shipment.shipment_poids,
                longueur: shipment.shipment_longueur,
                largeur: shipment.shipment_largeur,
                hauteur: shipment.shipment_hauteur,
                wilayaId: shipment.commune_wilayaId,
                livraisonDomicile: shipment.shipment_livraisonDomicile,
                livraisonStopDesck: shipment.shipment_livraisonStopDesck,
                service: shipment.service_nom,
              },
            );
          } else {
            tarifLivraison = 0;
          }
          cost = tarifLivraison;
          montant += cost;
        } else {
          tarifLivraison = await this.calculTarifslivraison(
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
        listColisOfCoursier.push({
          tracking: shipment.shipment_tracking,
          service: shipment.service_nom,
          wilaya: shipment.wilaya_nomLatin,
          dateLivraison: statusShipment[statusShipment.length - 1].createdAt,
          cost: cost,
        });
      }
    }
    return { montant, listColisOfCoursier };
  }
  async getRecoltesDeskInformation(user) {
    let montant = 0;
    const listColisDeskLivre = [];
    const shipments = await this.findShipmentLivreDesk(user);
    console.log('*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/');
    for await (const shipment of shipments) {
      let cost = 0;

      if (
        shipment.service_nom.toLowerCase() == 'classique divers' ||
        shipment.service_nom.toLowerCase() == 'soumission' ||
        shipment.service_nom.toLowerCase() == 'cahier de charge'
      ) {
        if (shipment.shipment_cashOnDelivery) {
          console.log('*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/*/');
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
            service: shipment.service_nom,
          });
        } else {
          cost = 0;
        }
        montant += cost;
        this.logger.warn(`montant------------------> : ${montant}`);
      } else {
        const tarifLivraison = await this.calculTarifslivraison(
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
      listColisDeskLivre.push({
        tracking: shipment.shipment_tracking,
        service: shipment.service_nom,
        wilaya: shipment.wilaya_nomLatin,
        dateLivraison: shipment.shipment_updatedAt,
        cost: cost,
      });
    }
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1056 ~ ShipmentsService ~ forawait ~ listColisDeskLivre',
      montant,
      listColisDeskLivre,
    );

    return { montant, listColisDeskLivre };
  }
  async findShipmentLivreOfCoursier(coursierUserId) {
    const shipmentsCoursier = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('shipment.recolte', 'recolte')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `status.libelle = '${StatusShipmentEnum.pasPres}' and 
        status.userAffectId = ${coursierUserId} `,
      )
      .andWhere(`shipment.recolteId is null`)
      .getMany();

    if (!shipmentsCoursier) {
      throw new EntityNotFoundError(Shipment, coursierUserId);
    } else {
      return shipmentsCoursier;
    }
  }
  async findShipmentLivreDesk(user) {
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('status.createdOn', 'agence')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .distinctOn(['shipment.id'])
      .where(`status.libelle = '${StatusShipmentEnum.pasPres}'`)
      .andWhere(
        `shipment.lastStatus = '${StatusShipmentEnum.pasPres}' and 
        shipment.recolteId is null and shipment.livraisonStopDesck is true and shipment.livraisonDomicile is false
        and agence.id = ${employeInfo.agence.id} `,
      )
      .getRawMany();
    return shipments;
  }
  async findShipmentCreatedInDesk(user: User) {
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('status.createdOn', 'agence')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .distinctOn(['shipment.id'])
      .where(`status.libelle = '${StatusShipmentEnum.presExpedition}'`)
      // shipment.lastStatus = '${StatusShipmentEnum.pasPres}' and
      .andWhere(
        `shipment.recolteCsId is null
        and agence.id = ${employeInfo.agence.id} `,
      )
      .andWhere(`service.id != 1`)
      .getMany();
    return shipments;
  }
  async getShipmentsOfRecolte(id: number) {
    const listShipmentOfRecolte = await this.shipmentRepository.find({
      relations: [
        'createdBy',
        'recolte',
        'service',
        'commune',
        'commune.wilaya',
      ],
      where: {
        recolte: {
          id: id,
        },
      },
    });
    if (!listShipmentOfRecolte) {
      throw new EntityNotFoundError(Shipment, id);
    } else {
      return listShipmentOfRecolte;
    }
  }
  async getPaginatedShipmentsEnpreparation(
    user,
    options: IPaginationOptions,
    searchColisTerm?: string,
  ): Promise<Pagination<any>> {
    let shipments;
    if (searchColisTerm && Number(searchColisTerm) != NaN) {
      searchColisTerm = searchColisTerm.toString().toLowerCase();
      shipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .distinctOn(['shipment.id'])
        .orderBy('shipment.id', 'DESC')
        .where(
          `
           (shipment.nom  ILike '%${searchColisTerm}%' or
            shipment.prenom  ILike '%${searchColisTerm}%' or
            shipment.designationProduit ILike '%${searchColisTerm}%' or
            shipment.telephone ILike '%${searchColisTerm}%' or
            commune.nomLatin ILike '%${searchColisTerm}%' or
            wilaya.nomLatin ILike '%${searchColisTerm}%' or
            service.nom ILike '%${searchColisTerm}%') and shipment.createdBy = '${user.id}' and 
            shipment.lastStatus = '${StatusShipmentEnum.enPreparation}'
            `,
        );
    } else {
      shipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .distinctOn(['shipment.id'])
        .orderBy('shipment.id', 'DESC')
        .where(
          `shipment.createdBy = '${user.id}' and shipment.lastStatus = '${StatusShipmentEnum.enPreparation}'`,
        );
    }
    return await paginate<any>(shipments, {
      page: options.page,
      limit: options.limit,
      route:
        'http://localhost:3000/shipments/getPaginatedShipmentsEnpreparation',
    });
  }
  async findPaginateColisInterneOfUser(
    user,
    options: IPaginationOptions,
    searchColisTerm?: string,
  ): Promise<Pagination<any>> {
    let listShipmentsInterne;

    if (searchColisTerm && Number(searchColisTerm) != NaN) {
      listShipmentsInterne = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoin('shipment.status', 'status')
        .leftJoin('status.user', 'user')
        .leftJoin('shipment.service', 'service')
        .distinctOn(['shipment.id'])
        .where(
          `shipment.tracking  ILike '%${searchColisTerm}%' or
           shipment.nom  ILike '%${searchColisTerm}%' or
            shipment.prenom  ILike '%${searchColisTerm}%' or
            shipment.designationProduit ILike '%${searchColisTerm}%'`,
        )
        .andWhere(
          `service.id = ${3} and user.id = ${
            user.id
          } and shipment.raisonSociale = 'YALIDINE EXPRESS'`,
        );
    } else {
      listShipmentsInterne = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoin('shipment.status', 'status')
        .leftJoin('status.user', 'user')
        .leftJoin('shipment.service', 'service')
        .distinctOn(['shipment.id'])
        .where(
          `service.id = ${1} and user.id = ${
            user.id
          } and shipment.raisonSociale = 'YALIDINE EXPRESS'`,
        );
    }
    return await paginate<any>(listShipmentsInterne, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/shipments/paginateColisInterneOfUser',
    });
  }
  async findpaginateColisCoursierEchecs(
    user,
    options: IPaginationOptions,
    searchColisTerm?: string,
  ): Promise<Pagination<any>> {
    let listShipmentsEchecs;

    if (searchColisTerm && Number(searchColisTerm) != NaN) {
      searchColisTerm = searchColisTerm.toString().toLowerCase();
      listShipmentsEchecs = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoin('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .where(`status.userAffectId = ${user.id}`)
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.echecLivraison}'`,
        )
        .andWhere(`shipment.livraisonStopDesck is false`)
        .andWhere(`shipment.tracking  ILike '%${searchColisTerm}%' or
           shipment.nom  ILike '%${searchColisTerm}%' or
            shipment.prenom  ILike '%${searchColisTerm}%' or
            shipment.designationProduit ILike '%${searchColisTerm}%'or
            service.nom ILike '%${searchColisTerm}%'
            or
            shipment.telephone ILike '%${searchColisTerm}%'`);
    } else {
      listShipmentsEchecs = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoin('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .where(`status.userAffectId = ${user.id}`)
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.echecLivraison}'`,
        )
        .andWhere(`shipment.livraisonStopDesck is false`);
    }
    return await paginate<any>(listShipmentsEchecs, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/shipments/findpaginateColisCoursierEchecs',
    });
  }
  async paginateColisStopDeskEchecs(
    user,
    options: IPaginationOptions,
    searchColisTerm?: string,
  ): Promise<Pagination<any>> {
    let listShipmentsEchecs;
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    if (searchColisTerm && Number(searchColisTerm) != NaN) {
      searchColisTerm = searchColisTerm.toString().toLowerCase();
      listShipmentsEchecs = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoin('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .where(`shipment.lastStatus = '${StatusShipmentEnum.echecLivraison}'`)
        .andWhere(`status.createdOn = ${employeInfo.agence.id}`)
        .andWhere(`shipment.livraisonStopDesck is true`)
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.echecLivraison}'`,
        ).andWhere(`shipment.tracking  ILike '%${searchColisTerm}%' or
           shipment.nom  ILike '%${searchColisTerm}%' or
            shipment.prenom  ILike '%${searchColisTerm}%' or
            shipment.designationProduit ILike '%${searchColisTerm}%'or
            service.nom ILike '%${searchColisTerm}%'
            or
            shipment.telephone ILike '%${searchColisTerm}%'`);
    } else {
      listShipmentsEchecs = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoin('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .where(`status.libelle = '${StatusShipmentEnum.echecLivraison}'`)
        .andWhere(`status.createdOn = ${employeInfo.agence.id}`)
        .andWhere(`shipment.livraisonStopDesck is true`)
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.echecLivraison}'`,
        );
    }
    //
    return await paginate<any>(listShipmentsEchecs, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/shipments/paginateColisStopDeskEchecs',
    });
  }
  async getShipmentsPresLivraison(user: any) {
    this.logger.debug(this.getShipmentsPresLivraison.name, user);
    const listShipmentsPresLivraison: string[] = [];
    const infoEmploye = await this.employeService.getEmployeStationByUserId(
      user.id,
    );

    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `shipment.livraisonStopDesck is false and wilaya.id = ${infoEmploye.wilaya_id}`,
      )
      .andWhere(
        `status.libelle = '${StatusShipmentEnum.recueWilaya}' or 
        status.libelle = '${StatusShipmentEnum.recueAgence}' or (status.libelle = '${StatusShipmentEnum.expidie}' and
        wilaya.id = ${infoEmploye.wilaya_id})`,
      )
      .getMany();

    for await (const shipment of shipments) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        (statusShipment[statusShipment.length - 1].libelle ==
          StatusShipmentEnum.recueWilaya ||
          statusShipment[statusShipment.length - 1].libelle ==
            StatusShipmentEnum.recueAgence ||
          (statusShipment[statusShipment.length - 1].libelle ==
            StatusShipmentEnum.expidie &&
            shipment.commune.wilaya.id == infoEmploye.wilaya_id)) &&
        shipment.livraisonStopDesck == false
      ) {
        const stationLastStatus =
          await this.agenceService.getStationByLastStatus(statusShipment);
        if (infoEmploye.agence_id == stationLastStatus.agence_id) {
          listShipmentsPresLivraison.push(shipment.tracking);
        }

        this.logger.debug(
          this.getShipmentsPresLivraison.name,
          listShipmentsPresLivraison,
        );
      }
    }
    return listShipmentsPresLivraison;
  }
  async getShipmentsPresARetire(user, idClient: number) {
    const listColisARetire: string[] = [];
    const clientInfo = await this.clientService.findOneByIdClient(idClient);
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(
        `status.libelle = '${StatusShipmentEnum.retourRecuAgence}' or 
        status.libelle = '${StatusShipmentEnum.retourRecuWilaya}'`,
      )
      .distinct()
      .getMany();
    for await (const shipment of shipments) {
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        (status[status.length - 1].libelle ==
          StatusShipmentEnum.retourRecuAgence ||
          status[status.length - 1].libelle ==
            StatusShipmentEnum.retourRecuWilaya) &&
        status[0].user.id === clientInfo.user_id
      ) {
        console.log('test', employeInfo.agence.id, clientInfo.agenceRetour_id);
        console.log(employeInfo.agence.id, clientInfo.agenceRetour_id);
        const stationLastStatus =
          await this.agenceService.getStationByLastStatus(status);
        console.log(stationLastStatus);

        if (
          employeInfo.agence.id === clientInfo.agenceRetour_id &&
          employeInfo.agence.id == stationLastStatus.agence_id
        ) {
          listColisARetire.push(shipment.tracking);
        }
      }
    }
    return listColisARetire;
  }

  async assignToCourier(trackings: string[], coursier: number, user) {
    const findUserId = await this.coursierService.getOneCoursierById(coursier);
    const employeInfo = await this.employeService.findOneByUserId(user.id);

    for await (const tracking of trackings) {
      const shipment = await this.findOneShipmnetByTraking(tracking);
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        statusShipment[statusShipment.length - 1].libelle ==
          StatusShipmentEnum.recueWilaya ||
        statusShipment[statusShipment.length - 1].libelle ==
          StatusShipmentEnum.recueAgence ||
        (statusShipment[statusShipment.length - 1].libelle ==
          StatusShipmentEnum.expidie &&
          shipment.commune.wilaya.id == employeInfo.agence.commune.wilaya.id)
      ) {
        const newStatusInsert = this.statusService.create({
          shipment: shipment,
          user: user,
          userAffect: findUserId.user.id,
          libelle: StatusShipmentEnum.affectedToCoursier,
          createdOn: employeInfo.agence.id,
        });
      } else {
        return false;
      }
    }
    return true;
  }
  async getColisReturnStation(user, coursierId: number) {
    const listeShipmentsToReturn = [];
    const listeShipmentsEchec = [];
    const listeShipmentsTentative = [];
    const userCoursier = await this.coursierService.findOne(coursierId);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1505 ~ ShipmentsService ~ getColisReturnStation ~ userCoursier',
      userCoursier,
    );
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .leftJoinAndSelect('shipment.shipmentRelation', 'shipmentRelation')
      .where(`libelle = '${StatusShipmentEnum.affectedToCoursier}'`)
      .andWhere(`status.userAffectId = ${userCoursier.user.id}`)
      .getRawMany();
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1512 ~ ShipmentsService ~ getColisReturnStation ~ shipments',
      shipments,
    );
    const employe = await this.employeService.findOneByUserId(user.id);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1515 ~ ShipmentsService ~ getColisReturnStation ~ employe',
      employe,
    );

    for (const shipment of shipments) {
      const agenceShipment = await this.employeService.findOneByUserId(
        shipment.user_id,
      );
      const status = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );
      //
      if (
        employe.agence.id === agenceShipment.agence.id &&
        status[status.length - 1].libelle === StatusShipmentEnum.echecLivraison
      ) {
        listeShipmentsToReturn.push(shipment.shipment_tracking);
        listeShipmentsEchec.push(shipment.shipment_tracking);
      } else if (
        employe.agence.id === userCoursier.agence.id &&
        shipment.shipment_livraisonDomicile == true &&
        shipment.shipment_echange == true &&
        shipment.shipment_shipmentRelationId
      ) {
        //changement ici
        listeShipmentsToReturn.push(shipment.shipmentRelation_tracking);
      } else if (
        employe.agence.id === agenceShipment.agence.id &&
        status[status.length - 1].libelle === StatusShipmentEnum.tentativeEchoue
      ) {
        listeShipmentsToReturn.push(shipment.tracking);
        listeShipmentsTentative.push(shipment.tracking);
      } else if (
        employe.agence.id === agenceShipment.agence.id &&
        status[status.length - 1].libelle ===
          StatusShipmentEnum.affectedToCoursier
      ) {
        listeShipmentsToReturn.push(shipment.shipment_tracking);
      }
    }
    const result = {
      listeShipmentsToReturn: listeShipmentsToReturn,
      listeShipmentsEchec: listeShipmentsEchec,
      listeShipmentsTentative: listeShipmentsTentative,
    };
    return result;
  }
  async setReturnStation(user, trackings: string[]) {
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentRepository.findOne({
        where: { tracking: tracking.toLowerCase() },
      });
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      console.log(
        'hh',
        statusShipment[statusShipment.length - 1].libelle,
        shipment,
      );
      if (
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.echecLivraison ||
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.tentativeEchoue ||
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.affectedToCoursier ||
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.echange
      ) {
        console.log(
          shipment,
          user,
          statusShipment[statusShipment.length - 1].userAffect.id,
        );
        const newStatusInsert = {
          shipment: shipment,
          user: user,
          libelle: StatusShipmentEnum.retourneAgence,
          userAffect: statusShipment[statusShipment.length - 1].userAffect.id,
          createdOn: employeInfo.agence.id,
        };
        //
        await this.statusService.create(newStatusInsert);
      }
    }
    return true;
  }
  async getTrackingPresTranfsertRetour(user, stationId) {
    const trackingsPresRetourTransfert: string[] = [];
    const employe = await this.employeService.findOneByUserId(user.id);
    const wilayasRetour = await this.wilayaService.findByAgenceRetourId(
      stationId,
    );
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('shipment.shipmentRelation', 'shipmentRelation')
      .where(
        `libelle = '${StatusShipmentEnum.echecLivraison}' or
         (libelle = '${StatusShipmentEnum.pasPres}' and shipment.echange is true )`,
      )
      .getMany();
    for (const shipment of shipments) {
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      // else if (
      // shipment.livraisonStopDesck == true &&
      //   shipment.echange == true &&
      //   shipment.shipmentRelationId;
      // ) {
      //   //changement ici
      //   listeShipmentsToReturn.push(shipment.shipmentRelation_tracking);
      // }
      console.log('hhhhhhhhh');

      if (
        status[status.length - 1].libelle ===
          StatusShipmentEnum.retourneAgence ||
        (status[status.length - 1].libelle ===
          StatusShipmentEnum.echecLivraison &&
          shipment.livraisonStopDesck == true &&
          shipment.livraisonDomicile == false) ||
        (shipment.livraisonStopDesck == true &&
          shipment.echange == true &&
          shipment.shipmentRelation.lastStatus == StatusShipmentEnum.echange)
      ) {
        const stationLastStatus =
          await this.agenceService.getStationByLastStatus(status);
        const clientInfo =
          await this.clientService.getClientInformationsByShipmentAndUser(
            shipment.id,
            status[0].user.id,
          );
        if (
          employe.agence.id == stationLastStatus.agence_id &&
          wilayasRetour.some(
            (wilayasRetour) => wilayasRetour.id == clientInfo.wilaya_id,
          )
        ) {
          if (
            shipment.livraisonStopDesck == true &&
            shipment.echange == true &&
            shipment.shipmentRelation.lastStatus == StatusShipmentEnum.echange
          ) {
            trackingsPresRetourTransfert.push(
              shipment.shipmentRelation.tracking,
            );
          } else {
            trackingsPresRetourTransfert.push(shipment.tracking);
          }
        }
      }

      //
    }
    return trackingsPresRetourTransfert;
  }
  async getTrackingPresRetourVersWilaya(user, idWilaya) {
    const listColisPresRetourVersWilaya = [];
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    if (employeInfo.agence.type === AgencesTypesEnum.centreRetour) {
      const shipments = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('shipment.status', 'status')
        .where(`libelle = '${StatusShipmentEnum.centreRetour}'`)
        .getRawMany();
      for await (const shipment of shipments) {
        const status = await this.statusService.getShipmentStatusById(
          shipment.shipment_id,
        );
        if (
          status[status.length - 1].libelle === StatusShipmentEnum.centreRetour
        ) {
          const stationLastStatus =
            await this.agenceService.getStationByLastStatus(status);
          const userClient = status[0].user.id;
          const clientInfo = await this.clientService.findOne(userClient);
          console.log(
            idWilaya,
            clientInfo.wilayaRetour_id,
            employeInfo.agence.id,
            stationLastStatus.agence_id,
          );
          if (
            idWilaya == clientInfo.wilayaRetour_id &&
            employeInfo.agence.id == stationLastStatus.agence_id
          ) {
            listColisPresRetourVersWilaya.push(shipment.shipment_tracking);
          }
        }
      }
    }
    return listColisPresRetourVersWilaya;
  }
  async getColisPresReturnVersAgence(user, idAgence) {
    const listColisPresRetourVersAgence = [];
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(
        `status.libelle = '${StatusShipmentEnum.retourRecuWilaya}' or
         status.libelle = '${StatusShipmentEnum.centreRetour}'`,
      )
      .getRawMany();
    for await (const shipment of shipments) {
      const status = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );
      if (
        (status[status.length - 1].libelle ===
          StatusShipmentEnum.retourRecuWilaya ||
          status[status.length - 1].libelle ===
            StatusShipmentEnum.centreRetour) &&
        !listColisPresRetourVersAgence.includes(shipment.shipment_tracking)
      ) {
        const stationLastStatus =
          await this.agenceService.getStationByLastStatus(status);
        const userClient = status[0].user.id;
        const clientInfo = await this.clientService.findOne(userClient);
        if (
          idAgence === clientInfo.agenceRetour_id &&
          employeInfo.agence.id == stationLastStatus.agence_id
        ) {
          listColisPresRetourVersAgence.push(shipment.shipment_tracking);
        }
      }
    }
    console.log(listColisPresRetourVersAgence);
    return listColisPresRetourVersAgence;
  }
  async getSacsClientInformation(user, idClient) {
    const listOfInformation = [];
    const listSacTracking: string[] = [];
    let nbrColis = 0;
    const clientUserIdSelected = await this.clientService.findUserOfClient(
      idClient,
    );
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.sacShipments', 'sacShipment')
      .leftJoinAndSelect('sacShipment.sac', 'sac')
      .where(
        `status.libelle = '${StatusShipmentEnum.ARetirer}' and
         sac.typeSac = '${SacTypeEnum.retourVersVendeur}'`,
      )
      .distinctOn(['sac.id'])
      .getRawMany();
    for await (const shipment of shipments) {
      const status = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );
      if (
        status[status.length - 1].libelle === StatusShipmentEnum.ARetirer &&
        status[0].user.id === clientUserIdSelected.user.id
      ) {
        const clientInfoStatus = await this.clientService.findOne(
          status[0].user.id,
        );
        if (employeInfo.agence.id === clientInfoStatus.agenceRetour_id) {
          nbrColis += 1;
          if (!listSacTracking.includes(shipment.shipment_tracking)) {
            listSacTracking.push(shipment.sac_tracking);
          }
        }
      }
    }
    listOfInformation.push(listSacTracking, nbrColis);
    return listOfInformation;
  }
  async getColisOfSac(id: number) {
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.sacShipments', 'sacShipments')
      .leftJoinAndSelect('sacShipments.sac', 'sac')
      .andWhere(`sac.id = ${id}`)
      .getMany();
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1519 ~ ShipmentsService ~ getColisOfSac ~ Shipments',
      shipments,
    );
    return shipments;
  }
  async getShipmentVersWilaya() {
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(
        `libelle = '${StatusShipmentEnum.versWilaya}' OR libelle = '${StatusShipmentEnum.retourneCentre}'`,
      )
      .distinctOn(['shipment.id'])
      .getMany();
    return shipments;
  }
  //
  async getStatistiqueShipmentOfCoursierSelected(idCoursier: number) {
    const coursierUser = await this.coursierService.getOneCoursierById(
      idCoursier,
    );

    return await this.getStatistiqueShipmentCoursier({
      id: coursierUser.user.id,
    });
  }
  //
  async getStatistiqueShipmentCoursier(user) {
    const statistique = {
      total: 0,
      echec: 0,
      livre: 0,
      echange: 0,
      enAttente: 0,
      ramasse: 0,
      montant: 0,
      gain: 0,
    };
    const shipmentsOfCoursier = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.shipmentRelation', 'shipmentRelation')
      .where(
        `
    (  status.libelle = '${StatusShipmentEnum.affectedToCoursier}' and 
          status.userAffectId = ${user.id}) or (status.libelle = '${StatusShipmentEnum.ramasse}' and 
          status.user.id = ${user.id})`,
      )
      .getMany();
    const freelanceInfo =
      await this.coursierService.findInformationOfCoursierByUserId(user.id);
    for await (const shipment of shipmentsOfCoursier) {
      console.log(statistique);
      switch (shipment.lastStatus) {
        case StatusShipmentEnum.affectedToCoursier:
          // statistique.total += 1;
          statistique.enAttente += 1;
          //
          break;
        case StatusShipmentEnum.ramasse:
          statistique.total += 1;
          statistique.ramasse += 1;
          //
          break;
        case StatusShipmentEnum.sortiEnLivraison:
          statistique.total += 1;
          //
          break;
        case StatusShipmentEnum.echecLivraison:
          statistique.total += 1;
          statistique.echec += 1;
          //
          break;
        case StatusShipmentEnum.pasPres:
          // statistique.total += 1;
          statistique.livre += 1;
          if (
            shipment.shipmentRelation &&
            shipment.shipmentRelation.lastStatus == StatusShipmentEnum.echange
          ) {
            statistique.echange += 1;
            statistique.total += 1;
          }
          console.log(
            'gh###########################################################################################',
            shipment,
          );

          if (
            shipment.service.nom == 'classique divers' ||
            shipment.service.nom == 'soumission' ||
            shipment.service.nom == 'cahier de charge'
          ) {
            console.log('hakim');
          } else {
            console.log(
              'gh###########################################################################################',
            );
            const tarifLivraison = await this.calculTarifslivraison(
              shipment.tracking,
            );

            if (shipment.livraisonGratuite) {
              const cost = shipment.prixVente;
              statistique.montant += cost;
            } else {
              const cost = tarifLivraison + shipment.prixVente;
              statistique.montant += cost;
            }
          }
          //
          break;
        case StatusShipmentEnum.preRecolte:
          if (!shipment.payer) {
            statistique.gain += freelanceInfo.montantLivraison;
          }
          break;
        //
        case StatusShipmentEnum.tentativeEchoue:
          statistique.total += 1;
          //
          break;
        case StatusShipmentEnum.enAlerte:
          statistique.total += 1;
          //
          break;
        case StatusShipmentEnum.enAttenteDuClient:
          statistique.total += 1;
          //
          break;
      }
    }
    return statistique;
  }
  //
  async getRecoltesCsInformation(user) {
    let montant = 0;
    const listColisCs = [];
    const shipments = await this.findShipmentCreatedInDesk(user);
    for await (const shipment of shipments) {
      let tarifLivraison = 0;

      if (shipment.cashOnDelivery) {
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
      listColisCs.push({
        tracking: shipment.tracking,
        service: shipment.service.nom,
        wilaya: shipment.commune.wilaya.nomLatin,
        dateCreation: shipment.createdAt,
        cost: tarifLivraison,
      });
    }
    console.log('getRecoltesCsInformation', montant, listColisCs);
    return { montant, listColisCs };
  }

  async getStatistiqueClient(user) {
    const statusAller = [
      StatusShipmentEnum.enPreparation,
      StatusShipmentEnum.presExpedition,
      StatusShipmentEnum.ramasse,
      StatusShipmentEnum.expidie,
      StatusShipmentEnum.versWilaya,
      StatusShipmentEnum.versAgence,
      StatusShipmentEnum.recueAgence,
      StatusShipmentEnum.transfert,
      StatusShipmentEnum.recueWilaya,
      StatusShipmentEnum.centre,
      StatusShipmentEnum.sortiEnLivraison,
    ];
    const statusRetour = [
      StatusShipmentEnum.retourneAgence,
      StatusShipmentEnum.retourneCentre,
      StatusShipmentEnum.centreRetour,
      StatusShipmentEnum.returnVersWilaya,
      StatusShipmentEnum.retourVersAgence,
      StatusShipmentEnum.retourRecuWilaya,
      StatusShipmentEnum.retourRecuAgence,
      StatusShipmentEnum.ARetirer,
    ];
    const statistique = {
      paiement: 0,
      enRoute: 0,
      presExpidie: 0,
      tentativeEchoue: 0,
      Retour: 0,
      colisAretire: 0,
    };
    const shipmentsOfClient = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(
        `
      shipment.lastStatus != '${StatusShipmentEnum.retirer}'
      and shipment.createdBy = ${user.id} and 
      status.libelle = '${StatusShipmentEnum.presExpedition}'`,
      )
      .getMany();
    for await (const shipment of shipmentsOfClient) {
      if (shipment.lastStatus === StatusShipmentEnum.tentativeEchoue) {
        statistique.tentativeEchoue += 1;
      } else if (shipment.lastStatus === StatusShipmentEnum.presExpedition) {
        statistique.presExpidie += 1;
      } else if (shipment.lastStatus === StatusShipmentEnum.ARetirer) {
        statistique.colisAretire += 1;
      } else if (statusRetour.includes(shipment.lastStatus)) {
        statistique.Retour += 1;
      } else if (statusAller.includes(shipment.lastStatus)) {
        statistique.enRoute += 1;
      }
    }
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1970 ~ ShipmentsService ~ getStatistiqueClient ~ statistique',
      statistique,
    );

    statistique.paiement = await this.getNetClient(user.id);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1971 ~ ShipmentsService ~ getStatistiqueClient ~ statistique',
      statistique,
    );

    return statistique;
  }
  //

  //
  async getPaginateColisTracabiliteOfClient(
    user,
    options: IPaginationOptions,
    searchColisTerm?: string,
  ): Promise<Pagination<Shipment>> {
    let listShipments;
    if (searchColisTerm && Number(searchColisTerm) != NaN) {
      searchColisTerm = searchColisTerm.toString();
      console.log(
        '🚀 ~ file: shipments.service.ts ~ line 1628 ~ ShipmentsService ~ setShipmentsPreExpedition ~ searchColisTerm',
        searchColisTerm,
      );
      listShipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoin('shipment.status', 'status')
        .leftJoin('status.user', 'user')
        .leftJoin('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .distinctOn(['shipment.id'])
        .where(
          `(shipment.tracking ILike '%${searchColisTerm}%' or
           shipment.nom ILike '%${searchColisTerm}%' or
            shipment.prenom ILike '%${searchColisTerm}%' or
            shipment.designationProduit ILike '%${searchColisTerm}%' or
            shipment.telephone ILike '%${searchColisTerm}%' or
            commune.nomLatin ILike '%${searchColisTerm}%' or
            CAST(shipment.lastStatus as text) ILike '%${searchColisTerm}%' or

            wilaya.nomLatin ILike '%${searchColisTerm}%')and 
             shipment.lastStatus != '${StatusShipmentEnum.enPreparation}' and user.id = ${user.id} and (shipment.shipmentRelation is null or
            shipment.echange is true)`,
        )
        .orderBy('shipment.id', 'DESC');
    } else {
      listShipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.status', 'status')
        .leftJoinAndSelect('status.user', 'user')
        .leftJoinAndSelect('shipment.service', 'service')
        .leftJoinAndSelect('shipment.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .distinctOn(['shipment.id'])
        .where(
          ` shipment.lastStatus != '${StatusShipmentEnum.enPreparation}' and user.id = ${user.id} and (shipment.shipmentRelation is null or 
            shipment.echange is true)`,
        )
        .orderBy('shipment.id', 'DESC');
    }
    return paginate<any>(listShipments, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/shipments/paginateColisTracabiliteOfClient',
    });
  }
  async getShipmentsPresVersAgence(user, idAgence) {
    const listColisPresVersAgence = [];
    const employe = await this.employeService.findOneByUserId(user.id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('shipment.status', 'status')
      .where(
        `status.libelle = '${StatusShipmentEnum.recueWilaya}' or
      status.libelle = '${StatusShipmentEnum.centre}'`,
      )
      .getRawMany();
    for await (const shipment of shipments) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );

      if (
        (statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.recueWilaya ||
          statusShipment[statusShipment.length - 1].libelle ===
            StatusShipmentEnum.centre) &&
        !listColisPresVersAgence.includes(shipment.shipment_tracking)
      ) {
        const stationLastStatus =
          await this.agenceService.getStationByLastStatus(statusShipment);

        if (employe.agence.commune.wilaya.id === stationLastStatus.wilaya_id) {
          listColisPresVersAgence.push(shipment.shipment_tracking);
        }
      }
    }
    return listColisPresVersAgence;
  }
  //
  async getShipmentsByCoursierId(id: number): Promise<any> {
    let montantTotal = 0;
    const coursierInfo = await this.coursierService.findOne(id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .innerJoin('shipment.commune', 'commune')
      .innerJoinAndSelect('commune.wilaya', 'wilaya')
      .innerJoinAndSelect('shipment.service', 'service')
      .innerJoinAndSelect('shipment.status', 'status')
      .where(
        `(shipment.payer = false and status.userAffectId = ${coursierInfo.user.id} and status.libelle = '${StatusShipmentEnum.preRecolte}') or 
         (shipment.payer = false and status.userId = ${coursierInfo.user.id} and status.libelle= '${StatusShipmentEnum.ramasse}') `,
      )
      .getRawMany();
    console.log(shipments.length);

    for await (const shipment of shipments) {
      if (
        shipment.status_userAffectId == coursierInfo.user.id &&
        shipment.status_libelle == StatusShipmentEnum.preRecolte
      ) {
 
        let prixLivraisons = 0;
        if (
          coursierInfo.agence.communeZoneOne.some(
            (commune) => commune === shipment.shipment_communeId,
          )
        ) {

          prixLivraisons =
            coursierInfo.agence.prixLivraisonZoneOne +
            coursierInfo.montantLivraison;


        } else {
          prixLivraisons =
            coursierInfo.agence.prixLivraisonZoneTwo +
            coursierInfo.montantLivraison;
        }
        montantTotal += prixLivraisons;
        shipment['tarifsLivraison'] = prixLivraisons;
      }
      if (
        shipment.status_userId == coursierInfo.user.id &&
        shipment.status_libelle == StatusShipmentEnum.ramasse
      ) {
        console.log('ghiles')
        let prixLivraison = 0;
        if (
          coursierInfo.agence.communeZoneOne.some(
            (commune) => commune === shipment.shipment_communeId,
          )
        ) {
          prixLivraison =
            coursierInfo.agence.prixRamassageZoneOne +
            coursierInfo.montantRamassage;
        } else {
          prixLivraison =
            coursierInfo.agence.prixRamassageZoneTwo +
            coursierInfo.montantRamassage;
        }
        montantTotal += prixLivraison;
        shipment['tarifsLivraison'] = prixLivraison;
      }
    }
    return [shipments, { montantTotal: montantTotal }];
  }
  async payerCoursier(coursierId: number, req: any) {

    const shipment = await this.getShipmentsByCoursierId(coursierId);
    if (shipment[0].length) {

      const createPmtCoursierDto = {
        coursierId: coursierId,
        employeId: req.user.id,
        nbrColis: shipment[0].length,
        montantTotal: shipment[1].montantTotal,
      };
      const pmtCoursierToSave = await this.pmtCoursierService.create(
        createPmtCoursierDto,
      );
      const pmtCoursier = await this.pmtCoursierService.findOne(
        pmtCoursierToSave.id,
      );
      for await (const colis of shipment[0]) {
        const shipmentPayer = await this.findOne(colis.shipment_id);
        console.log("🚀 ~ file: shipments.service.ts ~ line 2850 ~ ShipmentsService ~ forawait ~ shipmentPayer", shipmentPayer)
        if (shipmentPayer) {
          // const shipmentToSetPayer = this.shipmentRepository.create();
          shipmentPayer.payer = true;
          shipmentPayer.pmtCoursier = pmtCoursier;
          await this.shipmentRepository.update(
            colis.shipment_id,
            shipmentPayer,
          );
        }
      }
      return await this.pmtCoursierService.printPmtCoursier(
        pmtCoursierToSave.id,
      );
      // return pmtCoursier;
    } else {
    throw new NotFoundException(Shipment, 'pas de colis à payer');
    }
  }
  //
  async searchTrackingByEmploye(tracking: string) {
    const resultSearch: any[] = [];
    const arrayStatus: any[] = [];
    console.log(tracking);

    const shipment = await this.shipmentRepository.findOne({
      relations: ['service', 'commune', 'commune.wilaya'],
      where: {
        tracking: tracking.toLowerCase(),
      },
    });
    if (shipment) {
      const statusInformation =
        await this.statusService.getShipmentStatusInformationsSearch(
          shipment.id,
        );

      for await (const status of statusInformation) {
        arrayStatus.push({
          tracking: status.shipment_tracking,
          status: status.status_libelle,
          user: status.employe_nom
            ? status.employe_nom + ' ' + status.employe_prenom
            : status.client_nomCommercial
            ? status.client_nomCommercial
            : status.coursier_nom + ' ' + status.coursier_prenom,
          station: status.createdOn_nom ? status.createdOn_nom : '',
          adress: status.createdOn_nom
            ? status.commune_nomLatin + '/' + status.wilaya_nomLatin
            : status.client_adresse,
          date: status.status_createdAt,
        });
      }

      const tarifsLivraison = await this.calculTarifslivraison(tracking);
      console.log("🚀 ~ file: shipments.service.ts ~ line 2904 ~ ShipmentsService ~ searchTrackingByEmploye ~ tarifsLivraison", tarifsLivraison)
      resultSearch.push(shipment);
      resultSearch.push(arrayStatus);
      resultSearch.push(tarifsLivraison);
      return resultSearch;
    }
    return null;
  }

  //
  async searchTrackingPublic(tracking: string) {
    const statusSurnom = {
      'PRÉS A EXPIDIÉ': "Crée par l'expéditeur",
      EXPIDIÉ: 'Reçu par YALIDINE EXPRESS',
      'VERS WILAYA': 'Colis en route',
      'REÇUE WILAYA': 'Reçu à la wilaya',
      'VERS AGENCE': 'Colis vers agence ',
      'REÇUE AGENCE': 'Reçu en agence',
      'SORTI EN LIVRASON': 'Sorti en livraison',
      'ÉCHEC LIVRAISON': 'Échec de la livraison',
      LIVRÉ: 'Colis Livré',
    };
    const resultSearch: any[] = [];
    const arrayStatus: any[] = [];
    const shipment = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .distinctOn(['shipment.id'])
      .where(
        `
      status.libelle = '${StatusShipmentEnum.presExpedition}'
       and shipment.tracking ='${tracking}'`,
      )
      .getOne();
    if (shipment) {
      const statusInformation =
        await this.statusService.getShipmentStatusInformationsSearch(
          shipment.id,
        );

      for await (const status of statusInformation) {
        if (
          status.status_libelle === StatusShipmentEnum.presExpedition ||
          status.status_libelle === StatusShipmentEnum.expidie ||
          status.status_libelle === StatusShipmentEnum.versWilaya ||
          status.status_libelle === StatusShipmentEnum.recueWilaya ||
          status.status_libelle === StatusShipmentEnum.versAgence ||
          status.status_libelle === StatusShipmentEnum.recueAgence ||
          status.status_libelle === StatusShipmentEnum.sortiEnLivraison ||
          status.status_libelle === StatusShipmentEnum.livre ||
          status.status_libelle === StatusShipmentEnum.echecLivraison
        ) {
          arrayStatus.push({
            tracking: status.shipment_tracking,
            status: statusSurnom[status.status_libelle],
            station: '',
            adress: status.createdOn_nom
              ? status.commune_nomLatin + '/' + status.wilaya_nomLatin
              : status.client_adresse,
            date: status.status_createdAt,
          });
        }
      }
      const tarifsLivraison = null;
      resultSearch.push(shipment);
      resultSearch.push(arrayStatus);
      resultSearch.push(tarifsLivraison);
      return resultSearch;
    }
  }
  async searchTrackingByClient(tracking: string, user) {
    const resultSearch: any[] = [];
    const arrayStatus: any[] = [];
    console.log(tracking, user.id);
    // const shipment = await this.shipmentRepository.findOne({
    //   relations: ['status', 'service', 'commune', 'commune.wilaya'],
    //   where: {
    //     tracking: tracking.toLowerCase(),
    //     status: {
    //       user: { id: user.id },
    //     },
    //   },
    // });
    const shipment = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .distinctOn(['shipment.id'])
      .where(
        `
      status.libelle = '${StatusShipmentEnum.presExpedition}' and user.id = ${user.id}
       and shipment.tracking ='${tracking}'`,
      )
      .getOne();
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 1660 ~ ShipmentsService ~ searchTrackingByClient ~ shipment',
      shipment,
    );

    if (shipment) {
      const statusInformation =
        await this.statusService.getShipmentStatusInformationsSearch(
          shipment.id,
        );

      for await (const status of statusInformation) {
        arrayStatus.push({
          tracking: status.shipment_tracking,
          status: status.status_libelle,
          station: status.createdOn_nom ? status.createdOn_nom : '',
          adress: status.createdOn_nom
            ? status.commune_nomLatin + '/' + status.wilaya_nomLatin
            : status.client_adresse,
          date: status.status_createdAt,
        });
      }
      const tarifsLivraison = await this.calculTarifslivraison(tracking);
      resultSearch.push(shipment);
      resultSearch.push(arrayStatus);
      resultSearch.push(tarifsLivraison);
      return resultSearch;
    }
    return null;
  }
  async getInfoFraiRetourOfClient(clientId: number) {
    let fraieRetoure = 0;
    const shipmentsRetoure: Shipment[] = [];
    const userClient = await this.clientService.findUserOfClient(clientId);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .where('shipment.shipmentRelation is null and status.libelle= :libelle', {
        libelle: StatusShipmentEnum.retirer,
      })
      .andWhere('createdBy.id = :id', { id: userClient.user.id })
      .getMany();
    //
    for await (const shipment of shipments) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      // console.log('#################################', shipment)

      if (
        statusShipment[statusShipment.length - 1].libelle ===
        StatusShipmentEnum.retirer
      ) {
        console.log(
          '🚀 ~ file: shipments.service.ts ~ line 2226 ~ ShipmentsService ~ forawait ~ fraieRetoure',
        );
        shipmentsRetoure.push(shipment);
        fraieRetoure += userClient.tarifRetour;
        console.log(
          '🚀 ~ file: shipments.service.ts ~ line 2226 ~ ShipmentsService ~ forawait ~ fraieRetoure',
          fraieRetoure,
        );
      }
    }
    return {
      fraieRetoure: fraieRetoure,
      shipments: shipmentsRetoure,
    };
  }
  async getNetClient(clientId: number) {
    let totalTarifLivraisonDomicile = 0;
    let totalTarifLivraisonStopDesk = 0;
    let prixVenteShipment = 0;
    let totalFraiCOD = 0;
    let fraiRetoure = 0;
    const clientInfo = await this.clientService.infoClientByUserId(clientId);
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 2259 ~ ShipmentsService ~ getNetClient ~ clientInfo',
      clientInfo,
    );
    const shipmentsPretAPayer = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('shipment.pmt', 'pmt')
      .where('pmt is null')
      .andWhere(
        `shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}' and createdBy.id = ${clientId}`,
      )
      .getMany();
    console.log(
      '🚀 ~ file: shipments.service.ts ~ line 2268 ~ ShipmentsService ~ getNetClient ~ shipmentsPretAPayer',
      shipmentsPretAPayer,
    );
    for await (const shipment of shipmentsPretAPayer) {
      if (shipment.livraisonGratuite) {
        if (shipment.livraisonDomicile) {
          const tarifLivraisonDomicile = await this.calculTarifslivraison(
            shipment.tracking,
          );
          totalTarifLivraisonDomicile += tarifLivraisonDomicile;
        }
        if (shipment.livraisonStopDesck) {
          const tarifLivraisonStopDesk = await this.calculTarifslivraison(
            shipment.tracking,
          );
          totalTarifLivraisonStopDesk += tarifLivraisonStopDesk;
        }
        if (shipment.prixEstimer > clientInfo.c_o_d_ApartirDe) {
          totalFraiCOD += (clientInfo.tauxCOD / 100) * shipment.prixEstimer;
        }
        prixVenteShipment +=
          shipment.prixVente -
          totalTarifLivraisonDomicile -
          totalTarifLivraisonStopDesk -
          totalFraiCOD;
      } else {
        if (shipment.livraisonDomicile) {
          const tarifLivraisonDomicile = await this.calculTarifslivraison(
            shipment.tracking,
          );
          totalTarifLivraisonDomicile += tarifLivraisonDomicile;
        }
        if (shipment.livraisonStopDesck) {
          const tarifLivraisonStopDesk = await this.calculTarifslivraison(
            shipment.tracking,
          );
          totalTarifLivraisonStopDesk += tarifLivraisonStopDesk;
        }
        if (shipment.prixEstimer > clientInfo.c_o_d_ApartirDe) {
          totalFraiCOD += (clientInfo.tauxCOD / 100) * shipment.prixEstimer;
        }
        prixVenteShipment += shipment.prixVente - totalFraiCOD;
      }
    }
    const retoure = await this.getInfoFraiRetourOfClient(clientInfo.id);
    fraiRetoure += retoure.fraieRetoure;
    const netClient = prixVenteShipment - fraiRetoure;
    return netClient;
  }
  async getSoldeClient(reqestedUser: User, clientId: any) {
    let nbShipmentDomicile = 0;
    let nbShipmentStopDesk = 0;
    let totalTarifLivraisonDomicile = 0;
    let totalTarifLivraisonStopDesk = 0;
    let totalFraiCOD = 0;
    let fraiRetoure = 0;
    let shipments: Shipment[];
    let recolter = 0;
    let netClient = 0;

    const clientInfo = await this.clientService.infoClient(clientId.id);
    const userStation = await this.userService.findInformationsEmploye(
      reqestedUser.id,
    );

    let shipmentsLibrerNonPayer = [];
    if (userStation.typeUser === TypeUserEnum.caissierAgence) {
      shipmentsLibrerNonPayer = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('shipment.pmt', 'pmt')
        .leftJoinAndSelect('shipment.libererOn', 'agence')
        .where('pmt is null')
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}' and createdBy.id = ${clientInfo.user.id}`,
        )
        .andWhere(`agence.id=${userStation.employe.agence.id}`)
        .getMany();

      shipments = shipmentsLibrerNonPayer;
    } else if (userStation.typeUser === TypeUserEnum.caissierRegional) {
      shipmentsLibrerNonPayer = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.libererOn', 'agence')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('shipment.pmt', 'pmt')
        .leftJoinAndSelect('agence.commune', 'commune')
        .leftJoinAndSelect('commune.wilaya', 'wilaya')
        .leftJoinAndSelect('wilaya.caisseRegional', 'caisseRegional')
        .where('pmt is null')
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}' and createdBy.id = ${clientInfo.user.id}`,
        )
        .andWhere(`caisseRegional.id = ${userStation.employe.agence.id}`)
        .getMany();

      shipments = shipmentsLibrerNonPayer;
    } else {
      shipmentsLibrerNonPayer = await this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.libererOn', 'libererOn')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('shipment.pmt', 'pmt')
        .where('libererOn.id is not null and pmt is null')
        .andWhere(
          `shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}' and createdBy.id = ${clientInfo.user.id}`,
        )
        .getMany();

      shipments = shipmentsLibrerNonPayer;
    }

    for await (const shipment of shipmentsLibrerNonPayer) {
      netClient += shipment.prixVente;

      if (shipment.livraisonGratuite) {
        if (shipment.prixEstimer > clientInfo.c_o_d_ApartirDe) {
          totalFraiCOD += (clientInfo.tauxCOD / 100) * shipment.prixEstimer;
        }
        if (shipment.livraisonDomicile) {
          const tarifLivraisonDomicile = await this.calculTarifslivraison(
            shipment.tracking,
          );
          nbShipmentDomicile += 1;
          totalTarifLivraisonDomicile += tarifLivraisonDomicile;
          netClient -= tarifLivraisonDomicile;
          recolter += shipment.prixVente;
        }
        if (shipment.livraisonStopDesck) {
          const tarifLivraisonStopDesk = await this.calculTarifslivraison(
            shipment.tracking,
          );
          totalTarifLivraisonStopDesk += tarifLivraisonStopDesk;
          nbShipmentStopDesk += 1;
          netClient -= tarifLivraisonStopDesk;
          recolter += shipment.prixVente;
        }
      } else {
        if (shipment.prixEstimer > clientInfo.c_o_d_ApartirDe) {
          totalFraiCOD += (clientInfo.tauxCOD / 100) * shipment.prixEstimer;
        }
        if (shipment.livraisonDomicile) {
          const tarifLivraisonDomicile = await this.calculTarifslivraison(
            shipment.tracking,
          );
          nbShipmentDomicile += 1;
          totalTarifLivraisonDomicile += tarifLivraisonDomicile;
          // netClient -= tarifLivraisonDomicile
          recolter += shipment.prixVente + tarifLivraisonDomicile;
        }
        if (shipment.livraisonStopDesck) {
          const tarifLivraisonStopDesk = await this.calculTarifslivraison(
            shipment.tracking,
          );
          totalTarifLivraisonStopDesk += tarifLivraisonStopDesk;
          nbShipmentStopDesk += 1;
          // netClient -= tarifLivraisonStopDesk;
          recolter += shipment.prixVente + tarifLivraisonStopDesk;
        }
      }
    }

    const retoure = await this.getInfoFraiRetourOfClient(clientId.id);
    fraiRetoure = retoure.fraieRetoure;
    return {
      shipments,
      userStation,
      nbShipmentDomicile,
      nbShipmentStopDesk,
      totalShipmentLivrer: nbShipmentDomicile + nbShipmentStopDesk,
      recolter: recolter,
      netPayerClient: netClient - fraiRetoure - totalFraiCOD,
      totalTarifLivraisonDomicile,
      totalTarifLivraisonStopDesk,
      fraiRetoure,
      totalFraiCOD,
      clientInfo,
      retoureShipments: retoure.shipments,
    };
  }

  async setShipmentsOfRecolteStatusRecolte(user, recolteId: number) {
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `status.libelle = '${StatusShipmentEnum.preRecolte}' and shipment.recolteId = ${recolteId}`,
      )
      .getMany();
    for await (const shipment of shipments) {
      // if (
      //   shipment.service.nom.toLowerCase() != 'classique divers' &&
      //   shipment.service.nom.toLowerCase() != 'soumission' &&
      //   shipment.service.nom.toLowerCase() != 'cahier de charge'
      // ) {
      const lastStatus = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      console.log(
        '🚀 ~ file: shipments.service.ts ~ line 400 ~ ShipmentsService ~ forawait ~ lastStatus',
        lastStatus[lastStatus.length - 1].libelle,
      );
      if (
        lastStatus[lastStatus.length - 1].libelle ===
        StatusShipmentEnum.preRecolte
      ) {
        delete shipment.status;
        await this.statusService.create({
          shipment: shipment,
          user: user,
          libelle: StatusShipmentEnum.recolte,
          userAffect: lastStatus[lastStatus.length - 1].userAffect,
        });
      }
    }
    // }
  }
  async update_v2(id: number, updateShipmentDto: any) {
    return await this.shipmentRepository.update(id, updateShipmentDto);
  }
  async libererShipmentsOfClientRecolte(userAgence: User, userId: number) {
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('status.user', 'user')
      .where(
        `status.libelle = '${StatusShipmentEnum.presExpedition}' and 
        status.userId = ${userId}`,
      )
      .getMany();

    for await (const shipment of shipments) {
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        statusShipment[statusShipment.length - 1].libelle ===
        StatusShipmentEnum.recolte
      ) {
        delete shipment.status;
        await this.statusService.create({
          shipment: shipment,
          user: userAgence,
          libelle: StatusShipmentEnum.pretAPayer,
          userAffect: statusShipment[statusShipment.length - 1].userAffect
            ? statusShipment[statusShipment.length - 1].userAffect.id
            : null,
        });
        await this.shipmentRepository.update(shipment.id, {
          libererAt: new Date(),
          libererBy: userAgence,
          libererOn: userAgence.employe.agence,
        });
      }
    }
    return true;
  }
  addToDate(objDate) {
    const numberOfMlSeconds = objDate.getTime();
    const addMlSeconds = 1000;
    const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj;
  }
  async findPaginateAllShipments(
    options: IPaginationOptions,
    searchShipmentTerm: string,
  ): Promise<Pagination<Shipment>> {
    let listShipments;
    if (searchShipmentTerm && Number(searchShipmentTerm) != NaN) {
      listShipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoin('shipment.status', 'status')
        .leftJoin('status.user', 'user')
        .leftJoin('user.client', 'client')
        .distinctOn(['shipment.id'])
        .where(` status.libelle= '${StatusShipmentEnum.presExpedition}'and( 
        shipment.tracking ilike  '%${searchShipmentTerm}%' or
        CAST(shipment.lastStatus as text) ilike '%${searchShipmentTerm}%' or
        client.nomGerant ilike '%${searchShipmentTerm}%' or
        client.prenomGerant ilike '%${searchShipmentTerm}%' or
        client.telephone ilike '%${searchShipmentTerm}%' )
        `);
    } else {
      listShipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoin('shipment.status', 'status')
        .leftJoin('status.user', 'user')
        .leftJoin('user.client', 'client')
        .distinctOn(['shipment.id'])
        .where(`status.libelle= '${StatusShipmentEnum.presExpedition}'`);
    }
    return await paginate<any>(listShipments, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/shipments/paginateShipments',
    });
  }
  async findPaginateAllShipmentsCs(
    requestedUser: User,
    options: IPaginationOptions,
    searchShipmentTerm: string,
  ): Promise<Pagination<Shipment>> {
    let listShipments;
    if (searchShipmentTerm && Number(searchShipmentTerm) != NaN) {
      listShipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoin('shipment.status', 'status')
        .leftJoin('status.user', 'user')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoin('shipment.expiditeurPublic', 'expiditeurPublic')
        .distinctOn(['shipment.id'])
        .where(` createdBy.id = ${requestedUser.id} and expiditeurPublic.id is not null and( 
        shipment.tracking ilike  '%${searchShipmentTerm}%' or
        CAST(shipment.lastStatus as text) ilike '%${searchShipmentTerm}%' or
        expiditeurPublic.nomExp ilike '%${searchShipmentTerm}%' or
        expiditeurPublic.prenomExp ilike '%${searchShipmentTerm}%' or
        expiditeurPublic.telephoneExp ilike '%${searchShipmentTerm}%' )
        `);
    } else {
      this.logger.error(requestedUser)
      listShipments = this.shipmentRepository
        .createQueryBuilder('shipment')
        .leftJoinAndSelect('shipment.createdBy', 'createdBy')
        .leftJoinAndSelect('shipment.expiditeurPublic', 'expiditeurPublic')
        .where(`createdBy.id = ${requestedUser.id} and expiditeurPublic.id is not null`)
    }
    return await paginate<any>(listShipments, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/shipments/paginateShipmentsCs',
    });
  }
  async getShipmentsToExportBySearch(term: string) {
    return await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoin('shipment.status', 'status')
      .leftJoin('shipment.createdBy', 'createdBy')
      .leftJoin('status.user', 'user')
      .leftJoin('user.client', 'client')
      .select('shipment')
      .addSelect('client')
      .distinctOn(['shipment.id'])
      .where(
        `shipment.tracking ilike '%${term}%' or
        CAST(shipment.lastStatus as text) ilike '%${term}%' or
        client.nomGerant ilike '%${term}%' or
        client.prenomGerant ilike '%${term}%' or
        client.telephone ilike '%${term}%' 
        `,
      )
      .getRawMany();
  }

  async export(res: any, term: string) {
    const data = await this.getShipmentsToExportBySearch(term);
    this.excelService.exportToExcel(res, term, data);
  }
  //
  async getStatistiquesStatusOPS(StationId, dateDebut, dateFin) {
    return await this.statusService.getStatistiquesStatusOPS(
      StationId,
      dateDebut,
      dateFin,
    );
  }
  //
  async getStatistiquesStatusFinance(StationId, dateDebut, dateFin) {
    return await this.statusService.getStatistiquesStatusFinance(
      StationId,
      dateDebut,
      dateFin,
    );
  }
  //

  async getShipmentClassicWithIntervalOfClient(
    id: number,
    dateDebut,
    dateFin,
    espece,
  ): Promise<any> {
    let montantHT = 0;
    let montantTimbre;
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    const userClient = await this.clientService.findUserOfClient(id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.client', 'client')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `(service.nom='Classique Entreprise' or service.nom ='classique divers')
    and shipment.createdBy = ${userClient.user.id}`,
      )
      .andWhere(
        `status.libelle = '${StatusShipmentEnum.pasPres}' and shipment.facture IsNull`,
      )
      .andWhere('status.createdAt >= :dateDebut', { dateDebut: `${dateDebut}` })
      .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
      .distinctOn(['shipment.id'])
      .getRawMany();

    for await (const shipment of shipments) {
      if (
        shipment.shipment_poids >
        shipment.shipment_longueur *
          shipment.shipment_largeur *
          shipment.shipment_hauteur *
          200
      ) {
        shipment.poids = shipment.shipment_poids;
      } else {
        shipment.poids =
          shipment.shipment_longueur *
          shipment.shipment_largeur *
          shipment.shipment_hauteur *
          200;
      }
      const tarifs = await this.calculTarifslivraison(
        shipment.shipment_tracking,
      );
      shipment.tarifLivraison = tarifs;
      montantHT = montantHT + tarifs;
    }
    const montantTva = (montantHT * 19) / 100;
    const montantTtc = montantHT + montantTva;
    if (espece == 'oui') {
      montantTimbre = (montantTtc * 1) / 100;
      if (montantTimbre < 5) {
        montantTimbre = 5;
      } else if (montantTimbre > 2500) {
        montantTimbre = 2500;
      }
    } else if (espece == 'non') {
      montantTimbre = 0;
    }
    const montantTotal = montantTtc + montantTimbre;

    return [
      shipments,
      {
        montantHT: montantHT,
        montantTva: montantTva,
        montantTtc: montantTtc,
        montantTimbre: montantTimbre,
        montantTotal: montantTotal,
      },
    ];
  }
  async facturerShipmentsClassique(
    req: any,
    clientId: number,
    dateDebut,
    dateFin,
    espesse,
  ) {
    const shipment = await this.getShipmentClassicWithIntervalOfClient(
      clientId,
      dateDebut,
      dateFin,
      espesse,
    );

    let espece: boolean;
    let montantTotal = shipment[1].montantTotal;
    let montantTva = shipment[1].montantTva;
    let montantTtc = shipment[1].montantTtc;
    let montantTimbre = shipment[1].montantTimbre;
    let montantHoreTaxe = shipment[1].montantHT;
    if (espesse == 'oui') {
      espece = true;
    } else if (espesse == 'non') {
      espece = false;
    }

    if (shipment[0].length) {
      const createFacturerDto = {
        clientId: clientId,
        employeId: req.user.id,
        nbrColis: shipment[0].length,
        montantTotal: montantTotal,
        montantTva: montantTva,
        montantTtc: montantTtc,
        montantTimbre: montantTimbre,
        montantHoreTaxe: montantHoreTaxe,
        espece: espece,
        payer: false,
        typeFacture: 'classique',
      };
      const factureToSave = await this.factureService.create(createFacturerDto);
      const facture = await this.factureService.findOne(factureToSave.id);
      const user = await this.userService.findOne(req.user.id);
      const agence = user.employe.agence;
      for await (const colis of shipment[0]) {
        const shipmentPayer = await this.findOne(colis.shipment_id);
        if (shipmentPayer) {
          const shipmentToSetPayer =
            this.shipmentRepository.create(shipmentPayer);
          shipmentToSetPayer.facture = facture;
          await this.shipmentRepository.update(
            colis.shipment_id,
            shipmentToSetPayer,
          );
          const createStautsShipment = await this.statusService.create({
            user: user,
            shipment: shipmentPayer,
            libelle: StatusShipmentEnum.facturer,
            createdOn: agence,
          });
        }
      }
      console.log(
        '🚀 ~ file: shipments.service.ts ~ line 2803 ~ ShipmentsService ~ facturerShipments ~ factureToSave.id',
        factureToSave.id,
      );

      return this.factureService.prinFactureClassique(factureToSave.id);
    }
    throw new EntityNotFoundError(Facture, 'id');
  }

  async getShipmentEcommerceWithIntervalOfClient(
    id: number,
    dateDebut,
    dateFin,
    espece,
  ): Promise<any> {
    let montantHT = 0;
    let montantTimbre;
    let montantTotalColis = 0;
    let tarifLivraison = 0;
    let tarifRetour = 0;
    let prixCod = 0;
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    const userClient = await this.clientService.findUserOfClient(id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.client', 'client')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `(service.nom='E-Commerce Express Divers' or service.nom ='E-Commerce Economy Entreprise'
         or service.nom='E-Commerce Express Entreprise'
         or service.nom='E-Commerce Economy Divers') and (shipment.prixVente != 0 or shipment.livraisonGratuite=false)    and shipment.createdBy = ${userClient.user.id}`,
      )
      .andWhere(
        `(status.libelle = '${StatusShipmentEnum.livre}' or  status.libelle = '${StatusShipmentEnum.retirer}' ) and shipment.facture IsNull`,
      )
      .andWhere(
        `shipment.lastStatus = '${StatusShipmentEnum.payer}' or  shipment.lastStatus = '${StatusShipmentEnum.retourPayer}'`,
      )
      .andWhere('status.createdAt >= :dateDebut', { dateDebut: `${dateDebut}` })
      .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
      .distinctOn(['shipment.id'])
      .getRawMany();

    for await (const shipment of shipments) {
      if (
        shipment.shipment_poids >
        shipment.shipment_longueur *
          shipment.shipment_largeur *
          shipment.shipment_hauteur *
          200
      ) {
        shipment.poids = shipment.shipment_poids;
      } else {
        shipment.poids =
          shipment.shipment_longueur *
          shipment.shipment_largeur *
          shipment.shipment_hauteur *
          200;
      }
      if (shipment.status_libelle == StatusShipmentEnum.livre) {
        const tarifs = await this.calculTarifslivraison(
          shipment.shipment_tracking,
        );
        tarifLivraison = tarifs;
        shipment.tarifLivraison = tarifLivraison;
        tarifRetour = 0;
        shipment.tarifRetour = tarifRetour;
        if (shipment.prixEstimer > shipment.client_c_o_d_ApartirDe) {
          prixCod =
            (shipment.shipments_prixEstimer * shipment.client_tauxCOD) / 100;
        }
      } else if (shipment.status_libelle == StatusShipmentEnum.retirer) {
        tarifLivraison = 0;
        shipment.tarifLivraison = tarifLivraison;
        tarifRetour = shipment.client_tarifRetour;
        shipment.tarifRetour = tarifRetour;
        prixCod = 0;
      }

      shipment.montantCOD = prixCod;
      montantTotalColis = prixCod + tarifLivraison + tarifRetour;
      shipment.montantTotalColis = montantTotalColis;
      montantHT = montantHT + montantTotalColis;
    }

    const montantTva = (montantHT * 19) / 100;
    const montantTtc = montantHT + montantTva;
    if (espece == 'oui') {
      montantTimbre = (montantTtc * 1) / 100;
      if (montantTimbre < 5) {
        montantTimbre = 5;
      } else if (montantTimbre > 2500) {
        montantTimbre = 2500;
      }
    } else if (espece == 'non') {
      montantTimbre = 0;
    }
    const montantTotal = montantTtc + montantTimbre;

    return [
      shipments,
      {
        montantHT: montantHT,
        montantTva: montantTva,
        montantTtc: montantTtc,
        montantTimbre: montantTimbre,
        montantTotal: montantTotal,
      },
    ];
  }

  async facturerShipmentnsEcommerce(
    req: any,
    clientId: number,
    dateDebut,
    dateFin,
    espesse,
    type,
  ) {
    const datePaiement = new Date();
    const shipment = await this.getShipmentEcommerceWithIntervalOfClient(
      clientId,
      dateDebut,
      dateFin,
      espesse,
    );

    let espece: boolean;
    const montantTotal = shipment[1].montantTotal;
    const montantTva = shipment[1].montantTva;
    const montantTtc = shipment[1].montantTtc;
    const montantTimbre = shipment[1].montantTimbre;
    const montantHoreTaxe = shipment[1].montantHT;
    if (espesse == 'oui') {
      espece = true;
    } else if (espesse == 'non') {
      espece = false;
    }

    if (shipment[0].length) {
      const createFacturerDto = {
        clientId: clientId,
        employeId: req.user.id,
        nbrColis: shipment[0].length,
        montantTotal: montantTotal,
        montantTva: montantTva,
        montantTtc: montantTtc,
        montantTimbre: montantTimbre,
        montantHoreTaxe: montantHoreTaxe,
        espece: espece,
        payer: true,
        datePaiement: datePaiement,
        typeFacture: 'ecommerce',
      };
      const factureToSave = await this.factureService.create(createFacturerDto);
      const facture = await this.factureService.findOne(factureToSave.id);
      const user = await this.userService.findOne(req.user.id);
      const agence = user.employe.agence;
      for await (const colis of shipment[0]) {
        const shipmentPayer = await this.findOne(colis.shipment_id);
        if (shipmentPayer) {
          const shipmentToSetPayer =
            this.shipmentRepository.create(shipmentPayer);
          shipmentToSetPayer.facture = facture;
          await this.shipmentRepository.update(
            colis.shipment_id,
            shipmentToSetPayer,
          );
          // const createStautsShipment = await this.statusService.create({
          //   user: user,
          //   shipment: shipmentPayer,
          //   libelle: StatusShipmentEnum.facturer,
          //   createdOn: agence,
          // });
        }
      }
      if (type == 'detail') {
        return this.factureService.prinFactureEcommerceDetail(factureToSave.id);
      } else if (type == 'simple') {
        return this.factureService.prinFactureEcommerceSimplifie(
          factureToSave.id,
        );
      }
    }
    throw new EntityNotFoundError(Facture, 'id');
  }
  async getShipmentEcommerceZeroWithIntervalOfClient(
    id: number,
    dateDebut,
    dateFin,
    espece,
  ): Promise<any> {
    let montantHT = 0;
    let montantTimbre;
    let montantTotalColis = 0;
    let tarifLivraison = 0;
    let tarifRetour = 0;
    let prixCod = 0;
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    const userClient = await this.clientService.findUserOfClient(id);
    const shipments = await this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.client', 'client')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `(service.nom='E-Commerce Express Divers' or service.nom ='E-Commerce Economy Entreprise'
         or service.nom='E-Commerce Express Entreprise'
         or service.nom='E-Commerce Economy Divers')    and shipment.createdBy = ${userClient.user.id} and shipment.prixVente=0 and shipment.livraisonGratuite=true`,
      )
      .andWhere(
        `(status.libelle = '${StatusShipmentEnum.livre}' or  status.libelle = '${StatusShipmentEnum.retirer}' ) and shipment.facture IsNull`,
      )
      .andWhere('status.createdAt >= :dateDebut', { dateDebut: `${dateDebut}` })
      .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
      .distinctOn(['shipment.id'])
      .getRawMany();

    for await (const shipment of shipments) {
      if (
        shipment.shipment_poids >
        shipment.shipment_longueur *
          shipment.shipment_largeur *
          shipment.shipment_hauteur *
          200
      ) {
        shipment.poids = shipment.shipment_poids;
      } else {
        shipment.poids =
          shipment.shipment_longueur *
          shipment.shipment_largeur *
          shipment.shipment_hauteur *
          200;
      }
      if (shipment.status_libelle == StatusShipmentEnum.livre) {
        const tarifs = await this.calculTarifslivraison(
          shipment.shipment_tracking,
        );
        tarifLivraison = tarifs;
        shipment.tarifLivraison = tarifLivraison;
        tarifRetour = 0;
        shipment.tarifRetour = tarifRetour;
        prixCod =
          (shipment.shipment_prixEstimer * shipment.client_tauxCOD) / 100;
      } else if (shipment.status_libelle == StatusShipmentEnum.retirer) {
        tarifLivraison = 0;
        shipment.tarifLivraison = tarifLivraison;
        tarifRetour = shipment.client_tarifRetour;
        shipment.tarifRetour = tarifRetour;
        prixCod = 0;
      }

      shipment.montantCOD = prixCod;
      montantTotalColis = prixCod + tarifLivraison + tarifRetour;
      shipment.montantTotalColis = montantTotalColis;
      montantHT = montantHT + montantTotalColis;
    }
    const montantTva = (montantHT * 19) / 100;
    const montantTtc = montantHT + montantTva;
    if (espece == 'oui') {
      montantTimbre = (montantTtc * 1) / 100;
      if (montantTimbre < 5) {
        montantTimbre = 5;
      } else if (montantTimbre > 2500) {
        montantTimbre = 2500;
      }
    } else if (espece == 'non') {
      montantTimbre = 0;
    }
    const montantTotal = montantTtc + montantTimbre;

    return [
      shipments,
      {
        montantHT: montantHT,
        montantTva: montantTva,
        montantTtc: montantTtc,
        montantTimbre: montantTimbre,
        montantTotal: montantTotal,
      },
    ];
  }

  async facturerShipmentnsEcommerceZero(
    req: any,
    clientId: number,
    dateDebut,
    dateFin,
    espesse,
    type,
  ) {
    const datePaiement = new Date();
    const shipment = await this.getShipmentEcommerceZeroWithIntervalOfClient(
      clientId,
      dateDebut,
      dateFin,
      espesse,
    );

    let espece: boolean;
    let montantTotal = shipment[1].montantTotal;
    let montantTva = shipment[1].montantTva;
    let montantTtc = shipment[1].montantTtc;
    let montantTimbre = shipment[1].montantTimbre;
    let montantHoreTaxe = shipment[1].montantHT;
    if (espesse == 'oui') {
      espece = true;
    } else if (espesse == 'non') {
      espece = false;
    }

    if (shipment[0].length) {
      const createFacturerDto = {
        clientId: clientId,
        employeId: req.user.id,
        nbrColis: shipment[0].length,
        montantTotal: montantTotal,
        montantTva: montantTva,
        montantTtc: montantTtc,
        montantTimbre: montantTimbre,
        montantHoreTaxe: montantHoreTaxe,
        espece: espece,
        payer: false,
        datePaiement: datePaiement,
        typeFacture: 'ecommerceZero',
      };
      const factureToSave = await this.factureService.create(createFacturerDto);
      const facture = await this.factureService.findOne(factureToSave.id);
      const user = await this.userService.findOne(req.user.id);
      const agence = user.employe.agence;
      for await (const colis of shipment[0]) {
        const shipmentPayer = await this.findOne(colis.shipment_id);
        if (shipmentPayer) {
          const shipmentToSetPayer =
            this.shipmentRepository.create(shipmentPayer);
          shipmentToSetPayer.facture = facture;
          await this.shipmentRepository.update(
            colis.shipment_id,
            shipmentToSetPayer,
          );
          // const createStautsShipment = await this.statusService.create({
          //   user: user,
          //   shipment: shipmentPayer,
          //   libelle: StatusShipmentEnum.facturer,
          //   createdOn: agence,
          // });
        }
      }
      if (type == 'detail') {
        return this.factureService.prinFactureEcommerceDetail(factureToSave.id);
      } else if (type == 'simple') {
        return this.factureService.prinFactureEcommerceSimplifie(
          factureToSave.id,
        );
      }
    }
    throw new EntityNotFoundError(Facture, 'id');
  }
}
