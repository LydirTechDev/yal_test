import {
  ConsoleLogger,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdfService } from 'src/core/templates/pdf.service';
import { AgencesTypesEnum } from 'src/enums/agencesTypesEnum';
import { SacTypeEnum } from 'src/enums/sacTypeEnum';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AgencesService } from '../agences/agences.service';
import { ClientsService } from '../clients/clients.service';
import { EmployesService } from '../employes/employes.service';
import { CreateSacShipmentDto } from '../sac-shipments/dto/create-sac-shipment.dto';
import { SacShipment } from '../sac-shipments/entities/sac-shipment.entity';
import { SacShipmentsService } from '../sac-shipments/sac-shipments.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { CreateSacDto } from './dto/create-sac.dto';
import { UpdateSacDto } from './dto/update-sac.dto';
import { Sac } from './entities/sac.entity';

/**
 *
 */
@Injectable()
export class SacService {
  logger = new Logger(SacService.name);
  constructor(
    @InjectRepository(Sac)
    private sacRepository: Repository<Sac>,
    @InjectRepository(SacShipment)
    private sacShipmentRepository: Repository<SacShipment>,
    private statusService: StatusService,
    @Inject(forwardRef(() => SacShipmentsService))
    private sacShipmentsService: SacShipmentsService,
    private shipmentService: ShipmentsService,
    private agenceService: AgencesService,
    private userService: UsersService,
    private wilayaService: WilayasService,
    private employesService: EmployesService,
    private clientService: ClientsService,
    // private sacShipmentService: SacShipmentsService,
    private pdfService: PdfService,
  ) {}

  //######################################  begin SacShipmentService ######################################
  async createSacShipment(createSacShipmentDto: CreateSacShipmentDto) {
    const createdSacShipment = this.sacShipmentRepository.create();
    createdSacShipment.shipment = await this.shipmentService.findOneById(
      createSacShipmentDto.shipmentId,
    );
    createdSacShipment.sac = await this.findOneById(createSacShipmentDto.sacId);
    return await this.sacShipmentRepository.save(createdSacShipment);
  }

  async getShipmentsBytracking(tracking: any) {
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 52 ~ SacService ~ getShipmentsBytracking ~ tracking',
      tracking,
    );
    const shipments = await this.sacShipmentRepository
      .createQueryBuilder('sacShipment')
      .leftJoinAndSelect('sacShipment.sac', 'sac')
      .leftJoinAndSelect('sacShipment.shipment', 'shipment')
      .where(`sac.tracking = '${tracking}'`)
      .getRawMany();
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 54 ~ SacService ~ getShipmentsBytracking ~ shipment',
      shipments,
    );
    if (shipments) {
      return shipments;
    } else {
      throw new EntityNotFoundError(SacShipment, tracking);
    }
  }
  async getShipmentsByTrackingAndWilaya(tracking: string, wilayaId: number) {
    const shipments = await this.sacShipmentRepository
      .createQueryBuilder('SacShipment')
      .leftJoinAndSelect('SacShipment.sac', 'sac')
      .leftJoinAndSelect('SacShipment.shipment', 'shipment')
      .leftJoinAndSelect('sac.user', 'user')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(`wilaya.id = ${wilayaId}`)
      .andWhere(`sac.tracking = '${tracking}'`)
      .getRawMany();
    if (shipments) {
      return shipments;
    } else {
      throw new EntityNotFoundError(SacShipment, { tracking, wilayaId });
    }
  }
  //######################################  end SacShipmentService  ######################################

  async createTransfertSac(
    user: any,
    trackings: any,
    agenceSelected: any,
    res: any,
  ) {
    const listPackageSlipToSac: string[] = [];
    const dateTransfert = new Date();
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    let trackingSac = await this.generateYal();
    const wilayaStationSelected = await this.agenceService.getWilayaFromeAgence(
      agenceSelected,
    );
    const checkTrackingExist = await this.findOneByTracking(trackingSac);
    while (checkTrackingExist) {
      trackingSac = await this.generateYal();
    }
    const saveSac = await this.create({
      tracking: trackingSac,
      typeSac: SacTypeEnum.transfert,
      userId: user,
      agenceDestination: agenceSelected,
      wilayaDestination: wilayaStationSelected.wilaya_id, // j'ai changer la wilaya_id par commune.wilaya.id
    });

    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking,
      );
      console.log(
        '🚀 ~ file: sac.service.ts ~ line 132 ~ SacService ~ forawait ~ shipment',
        shipment,
      );
      const newStatus = await this.statusService.create({
        user: user,
        shipment: shipment,
        libelle: StatusShipmentEnum.transfert,
        createdOn: employeInfo.agence.id,
      });
      const sacColis = await this.createSacShipment({
        shipmentId: shipment.id,
        sacId: saveSac.id,
      });
    }

    const buffer = await this.printSac(trackingSac, res);
    // const buf = Buffer.from(buffer);
    // res.send(buf);
    // return res;
  }

  async createSacVersWilaya(
    user: any,
    trackings: any,
    whilayaDestinationId: any,
    res: any,
  ) {
    const listShipmentsToSac: string[] = [];
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    for await (const traking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        traking,
      );
      if (shipment.commune.wilaya.id == whilayaDestinationId) {
        listShipmentsToSac.push(traking.toLowerCase());
      }
    }

    if (listShipmentsToSac.length > 0) {
      let trakingSac = await this.generateYal();

      const checkIfTrackingExist = await this.findOneByTracking(trakingSac);

      while (checkIfTrackingExist) {
        trakingSac = await this.generateYal();
      }

      const createNewSac = await this.create({
        tracking: trakingSac,
        typeSac: SacTypeEnum.versWilaya,
        userId: user,
        wilayaDestination: whilayaDestinationId,
      });

      for await (const tracking of listShipmentsToSac) {
        const shipment = await this.shipmentService.findOneShipmnetByTraking(
          tracking,
        );

        const createStatus = await this.statusService.create({
          user: user,
          shipment: shipment,
          libelle: StatusShipmentEnum.versWilaya,
          createdOn: employeInfo.agence.id,
        });

        const sacShipment = await this.createSacShipment({
          shipmentId: shipment.id,
          sacId: createNewSac.id,
        });
      }

      const buffer = await this.printSac(trakingSac, res);
    }
  }
  async generateYal() {
    const x1 = 'sac-';
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
    return (x1 + x2 + x3).toLowerCase();
  }

  async printSac(trackingSac, res) {
    const infoSac = await this.sacRepository
      .createQueryBuilder('sac')
      .leftJoinAndSelect('sac.sacShipment', 'sacShipment')
      .leftJoinAndSelect('sacShipment.shipment', 'shipment')
      .leftJoinAndSelect('sac.wilayaDestination', 'wilaya')
      .leftJoinAndSelect('sac.agenceDestination', 'stationDestination')
      .leftJoinAndSelect('stationDestination.commune', 'communeDestination')
      .leftJoinAndSelect('sac.user', 'user')
      .leftJoinAndSelect('user.employe', 'employe')
      .leftJoinAndSelect('employe.agence', 'agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya_depart')
      .where(`sac.tracking = '${trackingSac}'`)
      .getRawMany();
    const listTracking = [];
    for (const shipment of infoSac) {
      listTracking.push(shipment.shipment_tracking);
    }
    const buffer = await this.pdfService.printSac(infoSac[0], listTracking);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  async create(createSacDto: CreateSacDto) {
    const newSacCreate = this.sacRepository.create();
    newSacCreate.tracking = createSacDto.tracking;
    newSacCreate.typeSac = createSacDto.typeSac;
    newSacCreate.user = await this.userService.findOne(createSacDto.userId);
    newSacCreate.wilayaDestination = await this.wilayaService.findOne(
      createSacDto.wilayaDestination,
    );
    newSacCreate.agenceDestination = await this.agenceService.findOneAgenceById(
      createSacDto.agenceDestination,
    );
    return await this.sacRepository.save(newSacCreate);
  }

  async viderSacTransfert(user, trackings) {
    const ship: any[] = [];
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking,
      );
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        statusShipment[statusShipment.length - 1].libelle ==
        StatusShipmentEnum.transfert
      ) {
        const createStatusShipment = await this.statusService.create({
          user: user,
          shipment: shipment,
          libelle: StatusShipmentEnum.centre,
          createdOn: employeInfo.agence.id,
        });
        ship.push(createStatusShipment);
      }
    }
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 289 ~ SacService ~ forawait ~ ship',
      ship,
    );
    return ship;
  }
  findAll() {
    return `This action returns all sac`;
  }

  async findOneByTracking(tracking: string) {
    const sac = await this.sacRepository.findOne({
      relations: ['agenceDestination'],
      where: {
        tracking: tracking,
      },
    });
    // if (sac) {
    return sac;
    // } else {
    // throw new EntityNotFoundError(Sac, tracking);
    // }
  }

  async getTrackingEnTransfert(tracking, user) {
    const listShipmnetsEnTransfert: string[] = [];
    /**
     * wilaya du user
     */
    const station = await this.employesService.getEmployeStationByUserId(
      user.id,
    );
    /**
     * sac ByTraking
     */
    const sac = await this.findOneByTracking(tracking);
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 357 ~ SacService ~ getTrackingEnTransfert ~ sac',
      sac.agenceDestination.id,
      station.agence_id,
    );

    if (sac.agenceDestination.id === station.agence_id) {
      const shipments = await this.getShipmentsBytracking(tracking);
      console.log(
        '🚀 ~ file: sac.service.ts ~ line 306 ~ SacService ~ getTrackingEnTransfert ~ shipments',
        shipments,
      );
      for await (const shipment of shipments) {
        const statusShipment = await this.statusService.getShipmentStatusById(
          shipment.shipment_id,
        );
        console.log(
          '🚀 ~ file: sac.service.ts ~ line 308 ~ SacService ~ forawait ~ statusShipment',
          statusShipment,
        );
        if (
          statusShipment[statusShipment.length - 1].libelle ==
          StatusShipmentEnum.transfert
        ) {
          console.log('hakim');
          listShipmnetsEnTransfert.push(shipment.shipment_tracking);
        }
      }
      console.log(
        '🚀 ~ file: sac.service.ts ~ line 312 ~ SacService ~ getTrackingEnTransfert ~ ttt',
        listShipmnetsEnTransfert,
      );
      return listShipmnetsEnTransfert;
    }
  }

  async getTrackingVersWilaya(tracking: any, user: any) {
    const listeShipmentsVersWilaya: string[] = [];
    const wilaya = await this.employesService.getwilayaByUserId(user.id);
    const shipments = await this.getShipmentsByTrackingAndWilaya(
      tracking,
      wilaya.wilaya_id,
    );

    for await (const shipment of shipments) {
      const statusShipmnet = await this.statusService.getShipmentStatusById(
        shipment.shipment_id,
      );
      if (
        statusShipmnet[statusShipmnet.length - 1].libelle ==
        StatusShipmentEnum.versWilaya
      ) {
        listeShipmentsVersWilaya.push(shipment.shipment_tracking);
      }
    }
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 391 ~ SacService ~ forawait ~ listeShipmentsVersWilaya',
      listeShipmentsVersWilaya,
    );

    return listeShipmentsVersWilaya;
  }

  async viderSacWilaya(user, trackings) {
    const employe = await this.employesService.findOneByUserId(user.id);

    for await (const tracking of trackings) {
      const shipmnet = await this.shipmentService.findOneShipmnetByTraking(
        tracking,
      );
      console.log(
        '🚀 ~ file: sac.service.ts ~ line 402 ~ SacService ~ forawait ~ shipmnet',
        shipmnet,
      );

      if (shipmnet.commune.wilaya.id == employe.agence.commune.wilaya.id) {
        const statusShipmnet = await this.statusService.getShipmentStatusById(
          shipmnet.id,
        );
        console.log(
          '🚀 ~ file: sac.service.ts ~ line 406 ~ SacService ~ forawait ~ statusShipmnet',
          statusShipmnet,
        );
        if (
          statusShipmnet[statusShipmnet.length - 1].libelle ==
          StatusShipmentEnum.versWilaya
        ) {
          console.log('testttttttt', employe.agence);
          const createStatus = await this.statusService.create({
            user: user,
            shipment: shipmnet,
            libelle: StatusShipmentEnum.recueWilaya,
            createdOn: employe.agence.id,
          });
        }
      }
    }
    return true;
  }
  async viderSacTransfertRetour(user, trackings) {
    const currentUserStation = await this.employesService.findOneByUserId(
      user.id,
    );
    if (currentUserStation.agence.type === AgencesTypesEnum.centreRetour) {
      for await (const tracking of trackings) {
        const shipment = await this.shipmentService.findOneShipmnetByTraking(
          tracking,
        );
        const status = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          status[status.length - 1].libelle ===
          StatusShipmentEnum.retourneCentre
        ) {
          const newStatus = await this.statusService.create({
            user: user,
            shipment: shipment,
            libelle: StatusShipmentEnum.centreRetour,
            userAffect: status[status.length - 1].userAffect.id,
            createdOn: currentUserStation.agence,
          });
        }
      }
    }
    return true;
  }
  async viderSacRetourWilaya(user, trackings) {
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 472 ~ SacService ~ viderSacRetourWilaya ~ trackings',
      trackings,
    );
    const employe = await this.employesService.findOneByUserId(user.id);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking,
      );
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      if (
        status[status.length - 1].libelle ===
        StatusShipmentEnum.returnVersWilaya
      ) {
        console.log('teetetetet', employe.agence);
        const newStatus = await this.statusService.create({
          user: user,
          shipment: shipment,
          libelle: StatusShipmentEnum.retourRecuWilaya,
          userAffect: status[status.length - 1].userAffect.id,
          createdOn: employe.agence.id,
        });
      }
    }
    return true;
  }
  async viderSacRetourVersAgence(user, trackings) {
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 501 ~ SacService ~ viderSacRetourVersAgence ~ trackings',
      trackings,
    );
    const employe = await this.employesService.findOneByUserId(user.id);
    if (employe.agence.type === AgencesTypesEnum.bureau) {
      for await (const tracking of trackings) {
        const shipment = await this.shipmentService.findOneShipmnetByTraking(
          tracking,
        );
        const status = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          status[status.length - 1].libelle ===
          StatusShipmentEnum.retourVersAgence
        ) {
          const newStatus = await this.statusService.create({
            user: user,
            shipment: shipment,
            libelle: StatusShipmentEnum.retourRecuAgence,
            userAffect: status[status.length - 1].userAffect.id,
            createdOn: employe.agence.id,
          });
        }
      }
    }
    return true;
  }
  async getTrackingReturnTransfert(tracking, user) {
    const listTrackingsRetournTransfert: string[] = [];
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 450 ~ SacService ~ getTrackingReturnTransfert ~ employeInfo',
      employeInfo,
    );
    const checkDistinationSac = await this.sacRepository.findOne({
      relations: ['agenceDestination'],
      where: {
        tracking: tracking,
      },
    });
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 455 ~ SacService ~ getTrackingReturnTransfert ~ checkDistinationSac',
      checkDistinationSac,
    );
    console.log(
      checkDistinationSac.agenceDestination.id,
      employeInfo.agence.id,
    );

    if (checkDistinationSac.agenceDestination.id === employeInfo.agence.id) {
      const sacShipments = await this.sacShipmentRepository.find({
        relations: ['sac', 'shipment'],
        where: {
          sac: {
            tracking: tracking,
          },
        },
      });
      for await (const shipment of sacShipments) {
        const status = await this.statusService.getShipmentStatusById(
          shipment.shipment.id,
        );
        if (
          status[status.length - 1].libelle ===
          StatusShipmentEnum.retourneCentre
        ) {
          listTrackingsRetournTransfert.push(shipment.shipment.tracking);
        }
      }
    }
    return listTrackingsRetournTransfert;
  }
  async getTrackingReturnWilaya(user, tracking) {
    const listTrackingsRetourVersWilaya = [];
    const employeInfo = await this.employesService.getwilayaByUserId(user.id);
    const sacShipments = await this.sacShipmentRepository.find({
      relations: [
        'sac',
        'shipment',
        'shipment.commune',
        'shipment.commune.wilaya',
      ],
      where: {
        sac: {
          tracking: tracking.toLowerCase(),
        },
      },
    });
    console.log(sacShipments);
    for await (const shipment of sacShipments) {
      const status = await this.statusService.getShipmentStatusById(
        shipment.shipment.id,
      );
      if (
        status[status.length - 1].libelle ===
        StatusShipmentEnum.returnVersWilaya
      ) {
        listTrackingsRetourVersWilaya.push(shipment.shipment.tracking);
      }
    }
    return listTrackingsRetourVersWilaya;
  }
  //
  async getTrackingReturnVersAgence(user, tracking) {
    const listTrackingRetourVersAgence = [];
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    const checkDistinationSac = await this.sacRepository.findOne({
      relations: ['agenceDestination'],
      where: {
        tracking: tracking.toLowerCase(),
      },
    });
    console.log(checkDistinationSac);
    if (checkDistinationSac.agenceDestination.id === employeInfo.agence.id) {
      const sacShipments = await this.sacShipmentRepository.find({
        relations: ['sac', 'shipment'],
        where: {
          sac: {
            tracking: tracking.toLowerCase(),
          },
        },
      });
      for await (const shipment of sacShipments) {
        const status = await this.statusService.getShipmentStatusById(
          shipment.shipment.id,
        );
        if (
          status[status.length - 1].libelle ===
          StatusShipmentEnum.retourVersAgence
        ) {
          listTrackingRetourVersAgence.push(shipment.shipment.tracking);
        }
      }
    }
    return listTrackingRetourVersAgence;
  }
  //
  async createTransfertSacRetour(user, trackings, stationSelected, res) {
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    const wilayaStationSelected = await this.agenceService.findOneV2(
      stationSelected,
    );
    const wilayasRetour = await this.wilayaService.findByAgenceRetourId(
      stationSelected,
    );
    const trackingSac = await this.generateYal();
    const newSacCreate = this.sacRepository.create();
    newSacCreate.tracking = trackingSac;
    newSacCreate.typeSac = SacTypeEnum.transfertRetour;
    newSacCreate.user = user;
    newSacCreate.wilayaDestination = wilayaStationSelected.commune.wilaya;
    newSacCreate.agenceDestination = stationSelected;
    const saveSac = await this.sacRepository.save(newSacCreate);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking.toLowerCase(),
      );
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        status[status.length - 1].libelle ===
          StatusShipmentEnum.retourneAgence ||
        (status[status.length - 1].libelle ===
          StatusShipmentEnum.echecLivraison &&
          shipment.livraisonStopDesck == true) ||
        (shipment.livraisonStopDesck == true &&
          shipment.echange == false &&
          shipment.shipmentRelation && shipment.lastStatus == StatusShipmentEnum.echange)
      ) {
        const clientInfo =
          await this.clientService.getClientInformationsByShipmentAndUser(
            shipment.id,
            status[0].user.id,
          );
        if (
          wilayasRetour.some(
            (wilayasRetour) => wilayasRetour.id == clientInfo.wilaya_id,
          )
        ) {
          const newStatus = await this.statusService.create({
            user: user,
            shipment: shipment,
            libelle: StatusShipmentEnum.retourneCentre,
            userAffect: status[status.length - 1].userAffect.id,
            createdOn: employeInfo.agence.id,
          });
          const sacColis = await this.createSacShipment({
            shipmentId: shipment.id,
            sacId: saveSac.id,
          });
        }
      }
    }
    const buffer = await this.printSac(trackingSac, res);
  }
  async createSacRetourVersWilaya(user, res, trackings, wilayaSelected) {
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    const checkWilaya = await this.wilayaService.findOne(wilayaSelected);
    if (checkWilaya) {
      const trackingSac = await this.generateYal();
      const newSacCreate = this.sacRepository.create();
      newSacCreate.tracking = trackingSac;
      newSacCreate.typeSac = SacTypeEnum.retourVersWilaya;
      newSacCreate.user = user;
      newSacCreate.wilayaDestination = checkWilaya;

      const saveSac = await this.sacRepository.save(newSacCreate);
      for await (const tracking of trackings) {
        const shipment = await this.shipmentService.findOneShipmnetByTraking(
          tracking.toLowerCase(),
        );
        const status = await this.statusService.getShipmentStatusById(
          shipment.id,
        );

        if (
          status[status.length - 1].libelle === StatusShipmentEnum.centreRetour
        ) {
          const userClient = status[0].user.id;
          const clientInfo = await this.clientService.findOne(userClient);
          if (checkWilaya.id == clientInfo.wilayaRetour_id) {
            const newStatus = await this.statusService.create({
              user: user,
              shipment: shipment,
              libelle: StatusShipmentEnum.returnVersWilaya,
              userAffect: status[status.length - 1].userAffect.id,
              createdOn: employeInfo.agence.id,
            });
            const sacColis = await this.createSacShipment({
              shipmentId: shipment.id,
              sacId: saveSac.id,
            });
          }
        }
      }
      const buffer = await this.printSac(trackingSac, res);
    }
  }
  async createSacRetourAgence(user, res, trackings, stationSelected) {
    const checkStation = await this.agenceService.findOneAgenceById(
      stationSelected,
    );
    if (checkStation) {
      const employeInfo = await this.employesService.findOneByUserId(user.id);
      const trackingSac = await this.generateYal();
      const wilayaStationSelected = await this.agenceService.findOneV2(
        stationSelected,
      );
      const newSacCreate = this.sacRepository.create();
      newSacCreate.tracking = trackingSac;
      newSacCreate.typeSac = SacTypeEnum.retourVersAgence;
      newSacCreate.user = user;
      newSacCreate.wilayaDestination = wilayaStationSelected.commune.wilaya;
      newSacCreate.agenceDestination = checkStation;
      const saveSac = await this.sacRepository.save(newSacCreate);
      for await (const tracking of trackings) {
        const shipment = await this.shipmentService.findOneShipmnetByTraking(
          tracking.toLowerCase(),
        );
        const status = await this.statusService.getShipmentStatusById(
          shipment.id,
        );

        if (
          status[status.length - 1].libelle ===
            StatusShipmentEnum.retourRecuWilaya ||
          status[status.length - 1].libelle === StatusShipmentEnum.centreRetour
        ) {
          const stationLastStatus =
            await this.agenceService.getStationByLastStatus(status);
          const userClient = status[0].user.id;
          const clientInfo = await this.clientService.findOne(userClient);
          console.log(
            stationSelected,
            clientInfo.agenceRetour_id,
            employeInfo.agence.id,
            stationLastStatus.agence_id,
          );
          if (
            stationSelected === clientInfo.agenceRetour_id &&
            employeInfo.agence.id == stationLastStatus.agence_id
          ) {
            const newStatus = await this.statusService.create({
              user: user,
              shipment: shipment,
              libelle: StatusShipmentEnum.retourVersAgence,
              userAffect: status[status.length - 1].userAffect.id,
              createdOn: employeInfo.agence.id,
            });
            const sacColis = await this.createSacShipment({
              shipmentId: shipment.id,
              sacId: saveSac.id,
            });
          }
        }
      }
      const buffer = await this.printSac(trackingSac, res);
    }
  }
  async createSacRetourClient(user, res, trackings) {
    const trackingSac = await this.generateYal();
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    const newSacCreate = this.sacRepository.create();
    newSacCreate.tracking = trackingSac;
    newSacCreate.typeSac = SacTypeEnum.retourVersVendeur;
    newSacCreate.user = user;
    newSacCreate.wilayaDestination = employeInfo.agence.commune.wilaya;
    newSacCreate.agenceDestination = employeInfo.agence;

    const saveSac = await this.sacRepository.save(newSacCreate);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking.toLowerCase(),
      );
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      // eslint-disable-next-line prettier/prettier
      const stationLastStatus =
        await this.agenceService.getStationByLastStatus(status);
      console.log(
        '🚀 ~ file: sac.service.ts ~ line 816 ~ SacService ~ forawait ~ stationLastStatus',
        stationLastStatus,
      );

      console.log(employeInfo.agence.id, stationLastStatus.agence_id);
      if (
        (status[status.length - 1].libelle ===
          StatusShipmentEnum.retourRecuAgence ||
          status[status.length - 1].libelle ===
            StatusShipmentEnum.retourRecuWilaya) &&
        employeInfo.agence.id == stationLastStatus.agence_id
      ) {
        console.log('hakim');
        const newStatus = await this.statusService.create({
          user: user,
          shipment: shipment,
          libelle: StatusShipmentEnum.ARetirer,
          userAffect: status[status.length - 1].userAffect.id,
          createdOn: employeInfo.agence.id,
        });
        console.log(newStatus);
        const sacColis = await this.createSacShipment({
          shipmentId: shipment.id,
          sacId: saveSac.id,
        });
      }
    }
    const buffer = await this.printSacVersVendeur(trackingSac, res);
  }

  async findOneById(id: number) {
    const sac = await this.sacRepository.findOne(id);
    return sac;
  }

  update(id: number, updateSacDto: UpdateSacDto) {
    return `This action updates a #${id} sac`;
  }

  remove(id: number) {
    return `This action removes a #${id} sac`;
  }
  async printSacVersVendeur(trackingSac, res) {
    const infoSac = await this.sacRepository
      .createQueryBuilder('sac')
      .leftJoinAndSelect('sac.sacShipment', 'sacShipment')
      .leftJoinAndSelect('sacShipment.shipment', 'shipment')
      .leftJoinAndSelect('sac.wilayaDestination', 'wilaya')
      .leftJoinAndSelect('sac.agenceDestination', 'stationDestination')
      .leftJoinAndSelect('stationDestination.commune', 'communeDestination')
      .leftJoinAndSelect('sac.user', 'user')
      .leftJoinAndSelect('user.employe', 'employe')
      .leftJoinAndSelect('employe.agence', 'agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya_depart')
      .where(`sac.tracking = '${trackingSac}'`)
      .getRawMany();

    if (infoSac[0].sac_typeSac == SacTypeEnum.retourVersVendeur) {
      const status = await this.statusService.getShipmentStatusById(
        infoSac[0].shipment_id,
      );
      const clientInfo =
        await this.clientService.getClientInformationsByShipmentAndUser(
          infoSac[0].shipment_id,
          status[0].user.id,
        );
      const listTracking = [];
      for (const shipment of infoSac) {
        listTracking.push(shipment.shipment_tracking);
      }

      const buffer = await this.pdfService.printSacVersVendeur(
        infoSac[0],
        listTracking,
        clientInfo,
      );
      const buf = Buffer.from(buffer);
      res.send(buf);
      return res;
    }
  }
  async getTrackingOfSacVersVendeur(trackingSac) {
    const listTrackingOfSac: string[] = [];
    const sacInfo = await this.sacRepository.findOne({
      where: {
        tracking: trackingSac.toLowerCase(),
      },
    });
    if (sacInfo.typeSac === SacTypeEnum.retourVersVendeur) {
      const shipments = await this.shipmentService.getColisOfSac(sacInfo.id);
      for await (const shipment of shipments) {
        const status = await this.statusService.getShipmentStatusById(
          shipment.id,
        );

        if (status[status.length - 1].libelle === StatusShipmentEnum.ARetirer) {
          listTrackingOfSac.push(shipment.tracking);
        }
      }
    }
    return listTrackingOfSac;
  }
  async accReceptShipmentClient(
    user,
    trackings: string,
    sacTracking: string,
    idClient: number,
    res,
  ) {
    const listColisValide: string[] = [];
    const trackingAcc = await this.generateYalAcc();
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    const newSacCreate = this.sacRepository.create();
    newSacCreate.tracking = trackingAcc;
    newSacCreate.typeSac = SacTypeEnum.accuseDeReceptionRetourClient;
    newSacCreate.user = user;
    newSacCreate.wilayaDestination = employeInfo.agence.commune.wilaya;
    newSacCreate.agenceDestination = employeInfo.agence;
    const saveSac = await this.sacRepository.save(newSacCreate);
    const clientInfo = await this.clientService.findUserOfClient(idClient);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking.toLowerCase(),
      );
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );
      const stationLastStatus = await this.agenceService.getStationByLastStatus(
        status,
      );
      const checkSac = await this.sacRepository
        .createQueryBuilder('sac')
        .leftJoinAndSelect('sac.sacShipment', 'sacShipment')
        .leftJoinAndSelect('sacShipment.shipment', 'shipment')
        .where(`shipment.id = ${shipment.id}`)
        .andWhere(`sac.typeSac = '${SacTypeEnum.retourVersVendeur}'`)
        .getOne();
      console.log(
        status[status.length - 1].libelle,
        status[0].user.id,
        clientInfo.user.id,
        employeInfo.agence.id,
        stationLastStatus.agence_id,
        checkSac.tracking,
      );
      if (
        status[status.length - 1].libelle === StatusShipmentEnum.ARetirer &&
        status[0].user.id === clientInfo.user.id &&
        employeInfo.agence.id == stationLastStatus.agence_id &&
        checkSac.tracking == sacTracking
      ) {
        const newStatus = await this.statusService.create({
          user: user,
          shipment: shipment,
          libelle: StatusShipmentEnum.retirer,
          userAffect: status[status.length - 1].userAffect.id,
          createdOn: employeInfo.agence.id,
        });
        console.log(newStatus);
        const sacColis = await this.createSacShipment({
          shipmentId: shipment.id,
          sacId: saveSac.id,
        });
        listColisValide.push(tracking);
      }
    }
    const buffer = await this.printManifestRetourClient(trackingAcc, res);
  }
  async generateYalAcc() {
    const x1 = 'acc-';
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
    return (x1 + x2 + x3).toLowerCase();
  }
  async printManifestRetourClient(trackingSac, res) {
    console.log(
      '🚀 ~ file: sac.service.ts ~ line 394 ~ SacService ~ printManifestRetourClient ~ trackingSac',
      trackingSac,
    );
    const listTracking = [];
    const infoSac = await this.sacRepository
      .createQueryBuilder('sac')
      .leftJoinAndSelect('sac.sacShipment', 'sacShipment')
      .leftJoinAndSelect('sacShipment.shipment', 'shipment')
      .leftJoinAndSelect('sac.wilayaDestination', 'wilaya')
      .leftJoinAndSelect('sac.agenceDestination', 'stationDestination')
      .leftJoinAndSelect('stationDestination.commune', 'communeDestination')
      .leftJoinAndSelect('sac.user', 'user')
      .leftJoinAndSelect('user.employe', 'employe')
      .leftJoinAndSelect('employe.agence', 'agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya_depart')
      .where(`sac.tracking = '${trackingSac}'`)
      .getRawMany();

    if (infoSac[0].sac_typeSac == SacTypeEnum.accuseDeReceptionRetourClient) {
      const status = await this.statusService.getShipmentStatusById(
        infoSac[0].shipment_id,
      );
      const clientInfo =
        await this.clientService.getClientInformationsByShipmentAndUser(
          infoSac[0].shipment_id,
          status[0].user.id,
        );
      const listTracking = [];

      for await (const shipment of infoSac) {
        const status = await this.statusService.getShipmentStatusById(
          shipment.shipment_id,
        );
        if (status[status.length - 1].libelle == StatusShipmentEnum.retirer) {
          listTracking.push(shipment.shipment_tracking);
        }
      }
      if (listTracking.length > 0) {
        const buffer = await this.pdfService.printManifestRetourClient(
          infoSac[0],
          listTracking,
          clientInfo,
        );
        const buf = Buffer.from(buffer);
        res.send(buf);
        return res;
      } else throw new Error('Le sac est vide');
    }
  }
  async getSacPresTransit(user) {
    const listSacPresTransit: string[] = [];
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    const shipments = await this.shipmentService.getShipmentVersWilaya();
    for await (const shipment of shipments) {
      const status = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        status[status.length - 1].libelle === StatusShipmentEnum.versWilaya &&
        employeInfo.agence.commune.wilaya.id !== shipment.commune.wilaya.id &&
        employeInfo.agence.id !== status[status.length - 2].createdOn &&
        status[status.length - 2].libelle !== StatusShipmentEnum.transit
      ) {
        const sacWilaya = await this.sacRepository
          .createQueryBuilder('sac')
          .leftJoinAndSelect('sac.sacShipment', 'sacShipment')
          .where(`sacShipment.shipment = ${shipment.id}`)
          .andWhere(`sac.typeSac = '${SacTypeEnum.versWilaya}'`)
          .orderBy('sac.createdAt', 'DESC')
          .getOne();
        if (!listSacPresTransit.includes(sacWilaya.tracking)) {
          listSacPresTransit.push(sacWilaya.tracking);
        }
      } else if (
        status[status.length - 1].libelle ===
          StatusShipmentEnum.retourneCentre &&
        employeInfo.agence.commune.wilaya.id !== shipment.commune.wilaya.id &&
        employeInfo.agence.id !== status[status.length - 2].createdOn &&
        status[status.length - 2].libelle !== StatusShipmentEnum.transit
      ) {
        const sacTransfertRetour = await this.sacRepository
          .createQueryBuilder('sac')
          .leftJoinAndSelect('sac.sacShipment', 'sacShipment')
          .where(`sacShipment.shipment = ${shipment.id}`)
          .andWhere(`sac.typeSac = '${SacTypeEnum.transfertRetour}'`)
          .orderBy('sac.createdAt', 'DESC')
          .getOne();
        if (
          !listSacPresTransit.includes(sacTransfertRetour.tracking) &&
          sacTransfertRetour.agenceDestination !== employeInfo.agence
        ) {
          console.log('hakim');
          listSacPresTransit.push(sacTransfertRetour.tracking);
        }
      }
    }
    return listSacPresTransit;
  }
  async transiterSacs(user, trackings) {
    const newDate = new Date();
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    for await (const tracking of trackings) {
      const sacShipments = await this.sacShipmentRepository
        .createQueryBuilder('sacShipment')
        .leftJoinAndSelect('sacShipment.sac', 'sac')
        .leftJoinAndSelect('sacShipment.shipment', 'shipment')
        .where(`sac.tracking = '${tracking}'`)
        .getMany();
      for await (const sacShipment of sacShipments) {
        const shipment = await this.shipmentService.findOneById(
          sacShipment.shipment.id,
        );
        const status = await this.statusService.getShipmentStatusById(
          shipment.id,
        );
        if (
          (status[status.length - 1].libelle == StatusShipmentEnum.versWilaya ||
            status[status.length - 1].libelle ==
              StatusShipmentEnum.retourneCentre) &&
          status[status.length - 2].libelle !== StatusShipmentEnum.transit &&
          status[status.length - 2].createdOn !== employeInfo.agence.id
        ) {
          const newStatus = {
            user: user,
            shipment: shipment,
            libelle: StatusShipmentEnum.transit,
            userAffect: status[status.length - 1].userAffect,
            createdAt: newDate,
            createdOn: employeInfo.agence.id,
          };
          const currentStatus = {
            user: user,
            shipment: shipment,
            libelle: status[status.length - 1].libelle,
            userAffect: status[status.length - 1].userAffect,
            createdAt: this.addToDate(newDate),
            createdOn: employeInfo.agence.id,
          };
          await this.statusService.create(newStatus);
          await this.statusService.create(currentStatus);
        }
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
  async createSacVersAgence(user, res, trackings, stationSelected) {
    const date = new Date();
    const employe = await this.employesService.findOneByUserId(user.id);
    let trackingSac = await this.generateYal();
    const checkTrackingExist = await this.sacRepository.findOne({
      where: {
        tracking: trackingSac,
      },
    });
    while (checkTrackingExist) {
      trackingSac = await this.generateYal();
    }
    const wilayaStationSelected = await this.agenceService.getWilayaFromeAgence(
      stationSelected,
    );
    const newSacCreate = this.sacRepository.create();
    newSacCreate.tracking = trackingSac;
    newSacCreate.typeSac = SacTypeEnum.versAgence;
    newSacCreate.user = user.id;
    newSacCreate.wilayaDestination = wilayaStationSelected.wilaya_id;
    newSacCreate.agenceDestination = stationSelected;

    const saveSac = await this.sacRepository.save(newSacCreate);

    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking.toLowerCase(),
      );
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.centre ||
        statusShipment[statusShipment.length - 1].libelle ===
          StatusShipmentEnum.recueWilaya
      ) {
        const stationLastStatus =
          await this.agenceService.getStationByLastStatus(statusShipment);
        console.log('🚀 ~ thiiiiiiiiiiiiiiiiiiiissss', stationLastStatus);

        if (employe.agence.commune.wilaya.id === stationLastStatus.wilaya_id) {
          await this.statusService.create({
            shipment: shipment,
            user: user,
            libelle: StatusShipmentEnum.versAgence,
            createdOn: employe.agence.id,
          });
          await this.sacShipmentsService.create({
            shipmentId: shipment.id,
            sacId: saveSac.id,
          });
        }
      }
    }
    const buffer = await this.printSac(saveSac.tracking, res);
  }
  async getTrackingVersAgence(tracking: any, user: any) {
    const listeShipmentsVersAgence: string[] = [];
    const currentStation = await this.employesService.findOneByUserId(user);
    const shipments = await this.sacShipmentRepository
      .createQueryBuilder('SacShipment')
      .leftJoinAndSelect('SacShipment.sac', 'sac')
      .leftJoinAndSelect('SacShipment.shipment', 'shipment')
      .leftJoinAndSelect('sac.user', 'user')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(`sac.agenceDestination = ${currentStation.agence.id}`)
      .andWhere(`sac.tracking = '${tracking}'`)
      .getMany();
    for await (const shipment of shipments) {
      const statusShipmnet = await this.statusService.getShipmentStatusById(
        shipment.shipment.id,
      );
      if (
        statusShipmnet[statusShipmnet.length - 1].libelle ===
        StatusShipmentEnum.versAgence
      ) {
        listeShipmentsVersAgence.push(shipment.shipment.tracking);
      }
    }
    return listeShipmentsVersAgence;
  }
  async viderSacAgence(user, trackings) {
    const ship: any[] = [];
    const employeInfo = await this.employesService.findOneByUserId(user.id);
    for await (const tracking of trackings) {
      const shipment = await this.shipmentService.findOneShipmnetByTraking(
        tracking,
      );
      const statusShipment = await this.statusService.getShipmentStatusById(
        shipment.id,
      );

      if (
        statusShipment[statusShipment.length - 1].libelle ==
        StatusShipmentEnum.versAgence
      ) {
        const createStatusShipment = await this.statusService.create({
          user: user,
          shipment: shipment,
          libelle: StatusShipmentEnum.recueAgence,
          createdOn: employeInfo.agence.id,
        });
        ship.push(createStatusShipment);
      }
    }
    return ship;
  }
}
