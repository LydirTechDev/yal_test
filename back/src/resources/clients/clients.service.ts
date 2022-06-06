import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import {
  EntityNotFoundError,
  getConnection,
  getManager,
  ILike,
  Repository,
  UpdateResult,
} from 'typeorm';
import { AgencesService } from '../agences/agences.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { CreateClientsTarifDto } from '../clients-tarifs/dto/create-clients-tarif.dto';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CommunesService } from '../communes/communes.service';
import { EmployesService } from '../employes/employes.service';
import { Shipment } from '../shipments/entities/shipment.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { ZonesService } from '../zones/zones.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
/**
 *
 */
@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private employeService: EmployesService,
    private userService: UsersService,
    private communeService: CommunesService,
    private agenceService: AgencesService,
    @Inject(forwardRef(() => ClientsTarifsService))
    private clienttTarifService: ClientsTarifsService,
    private pdfService: PdfService,
    private excelService: ExcelService,
    private wilayaService: WilayasService,
    private zoneService: ZonesService,
    private codeTarifZone: CodeTarifsZonesService,
    @Inject(forwardRef(() => ShipmentsService))
    private shipmentService: ShipmentsService,
  ) {}

  // const clientInfo = await this.clientRepository
  // .createQueryBuilder('client')
  // .leftJoinAndSelect('client.user', 'user')
  // .leftJoinAndSelect('client.communeDepart', 'commune')
  // .leftJoinAndSelect('commune.wilaya', 'wilaya')
  // .where(`user.id = ${req.user.userId}`)
  // .getRawOne();

  async create(createClientDto: CreateClientDto) {
    const codPlage = [0.25, 0.5, 0.75, 1, 1.25, 1.5];
    const moyenPaiement = ['cheque', 'virement', 'espece'];
    let isActif: boolean;
    if (createClientDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    const createUserDto: CreateUserDto = {
      email: createClientDto.email,
      password: createClientDto.password,
      isActive: isActif,
      typeUser: TypeUserEnum.client,
    };

    const communeResidence = await this.communeService.findOne(
      createClientDto.communeResidenceId,
    );
    const communeDepart = await this.communeService.findOne(
      createClientDto.communeDepartId,
    );
    const agenceRetour = await this.agenceService.findOneAgenceById(
      createClientDto.agenceRetourId,
    );
    const caisseAgence = await this.agenceService.findOneAgenceById(
      createClientDto.caisseAgenceId,
    );
    const userSave = await this.userService.create(createUserDto);
    const user = await this.userService.findOne(userSave.id);
    const createClient = this.clientRepository.create(createClientDto);
    createClient.numClient =
      communeDepart.wilaya.codeWilaya +
      (await this.generateCodeClient(userSave.id));
    createClient.communeDepart = communeDepart;
    createClient.communeResidence = communeResidence;
    createClient.agenceRetour = agenceRetour;
    createClient.caisseAgence = caisseAgence;
    createClient.user = user;

    if (
      createClientDto.typeTarif.length > 0 &&
      codPlage.includes(createClientDto.tauxCOD) &&
      moyenPaiement.includes(createClientDto.moyenPayement)
    ) {
      const clientSave = await this.clientRepository.save(createClient);
      for (const typeTarif of createClientDto.typeTarif) {
        const createTarifclientDto: CreateClientsTarifDto = {
          clientId: clientSave.id,
          codeTarifId: typeTarif.codeTarifId,
        };
        await this.clienttTarifService.create(createTarifclientDto);
      }
      console.log('hakim', clientSave.id);
      return await this.printConvention(clientSave.id);
      //  return clientSave;
    }
    throw new NotFoundException(Client, 'Type Tarif est null');
  }
  async generateCodeClient(id) {
    let code = id.toString();
    while (code.length < 8) code = '0' + code;
    return code.toLowerCase();
  }
  async printConvention(idClient: number) {
    const infoClient = await this.findOneClientById(idClient);
    return await this.pdfService.printConvention(infoClient);
  }
  async printCarteClient(idClient: number) {
    const infoClient = await this.findOneClientById(idClient);
    return await this.pdfService.printCarteClient(infoClient);
  }
  async infoClient(id: number): Promise<Client> {
    return await this.clientRepository.findOneOrFail(id, {
      relations: ['user', 'communeDepart', 'communeDepart.wilaya'],
    });
  }
  async infoClientByUserId(id: number): Promise<Client> {
    return await this.clientRepository.findOneOrFail({
      relations: ['user', 'communeDepart', 'communeDepart.wilaya'],
      where: {
        user: {
          id: id,
        },
      },
    });
  }
  async findUserInformationsOfClient(idClient: number) {
    const clientUser = await this.clientRepository.findOne({
      relations: ['user'],
      where: {
        id: idClient,
      },
    });
    delete clientUser.user.password;
    if (clientUser) {
      return clientUser;
    } else {
      throw new EntityNotFoundError(Client, idClient);
    }
  }
  async tarifClient(id: number, wilayaDepartId: number): Promise<Client[]> {
    return await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.clientsTarifs', 'clientsTarifs')
      .leftJoinAndSelect('clientsTarifs.codeTarif', 'codeTarif')
      .leftJoinAndSelect('codeTarif.service', 'service')
      .leftJoinAndSelect('codeTarif.codeTarifZone', 'codeTarifZone')
      .leftJoinAndSelect('codeTarifZone.zone', 'zone')
      .leftJoinAndSelect('zone.rotations', 'rotations')
      .leftJoinAndSelect('rotations.wilayaDepart', 'wilayaDepart')
      .leftJoinAndSelect('rotations.wilayaDestination', 'wilayaDestination')
      .leftJoinAndSelect('codeTarifZone.poids', 'poids')
      .where(`client.id = '${id}'`)
      .andWhere('poids.id = 1')
      .andWhere(`wilayaDepart.id = '${wilayaDepartId}'`)
      .getMany();
  }
  findAll() {
    return `This action returns all clients`;
  }

  async findOne(id: number) {
    const clientInfo = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.communeDepart', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('client.agenceRetour', 'agenceRetour')
      .leftJoinAndSelect('agenceRetour.commune', 'communeRetour')
      .leftJoinAndSelect('communeRetour.wilaya', 'wilayaRetour')
      .where(`user.id = ${id}`)
      .getRawOne();
    if (clientInfo) {
      return clientInfo;
    } else {
      throw new EntityNotFoundError(Client, id);
    }
  }
  async findUserOfClient(idClient: number) {
    const clientInfo = await this.clientRepository.findOne({
      relations: ['user'],
      where: {
        id: idClient,
      },
    });
    if (clientInfo) {
      return clientInfo;
    } else {
      throw new EntityNotFoundError(Client, idClient);
    }
  }
  async findOneByIdClient(id: number) {
    const clientInfo = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.communeDepart', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('client.agenceRetour', 'agenceRetour')
      .leftJoinAndSelect('agenceRetour.wilayaRetour', 'wilayaRetour')
      .where(`client.id = ${id}`)
      .getRawOne();
    if (clientInfo) {
      return clientInfo;
    } else {
      throw new EntityNotFoundError(Client, id);
    }
  }
  //cree par ghiles
  async findOneClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      relations: [
        'communeDepart',
        'communeResidence',
        'communeResidence.wilaya',
        'communeDepart.wilaya',
        'agenceRetour',
        'caisseAgence',
        'user',
        'clientsTarifs',
        'clientsTarifs.codeTarif',
        'clientsTarifs.codeTarif.service',
      ],
      where: { id: id },
    });
    if (client) {
      return client;
    } else {
      throw new EntityNotFoundError(Client, id);
    }
  }
  async findClientByShipment(shipment: Shipment): Promise<Client> {
    return await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('user.status', 'status')
      .leftJoinAndSelect('status.shipment', 'shipment')
      .where(`shipment.id = '${shipment.id}'`)
      .select('client')
      .getOne();
  }
  async getClientInformationsByShipmentAndUser(
    shipmentId: number,
    userId: number,
  ) {
    const clientInfo = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('client.communeDepart', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('user.status', 'status')
      .leftJoinAndSelect('status.shipment', 'shipment')
      .where(`shipment.id = '${shipmentId}'`)
      .andWhere(`user.id = ${userId}`)
      .select(['client', 'wilaya'])
      .getRawOne();
    if (clientInfo) {
      return clientInfo;
    } else {
      throw new EntityNotFoundError(Client, {
        shipmentId,
        userId,
      });
    }
  }
  async getListClientsAttachedToMyStation(user) {
    const employeInfo = await this.employeService.findOneByUserId(user.id);
    const clients = await this.clientRepository.find({
      where: {
        agenceRetour: employeInfo.agence.id,
      },
    });
    return clients;
  }
  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
  //
  async findPaginateClient(
    options: IPaginationOptions,
    searchClientTerm: string,
  ): Promise<Pagination<Client>> {
    let clients;
    if (searchClientTerm && Number(searchClientTerm) != NaN) {
      clients = paginate<Client>(
        this.clientRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/clients/paginateClient',
        },
        {
          relations: [
            'communeDepart',
            'communeDepart.wilaya',
            'agenceRetour',
            'caisseAgence',
            'user',
          ],
          where: [
            { nomCommercial: ILike(`%${searchClientTerm}%`) },
            { prenomGerant: ILike(`%${searchClientTerm}%`) },
            { nomGerant: ILike(`%${searchClientTerm}%`) },
            { telephone: ILike(`%${searchClientTerm}%`) },
            {
              communeDepart: {
                wilaya: {
                  nomLatin: ILike(`%${searchClientTerm}%`),
                },
              },
            },
          ],
        },
      );
    } else {
      clients = paginate<Client>(
        this.clientRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/clients/paginateClient',
        },
        {
          relations: [
            'communeDepart',
            'communeDepart.wilaya',
            'agenceRetour',
            'caisseAgence',
            'user',
          ],
        },
      );
    }
    if ((await clients).items.length <= 0) {
      throw new EntityNotFoundError(Client, 'No clients');
    }
    return clients;
  }
  async updateClient(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<UpdateResult> {
    let isActif: boolean;
    let updateUserDto: UpdateUserDto;
    console.log('etsttttuus', updateClientDto.isActive);
    if (updateClientDto.isActive === 'Inactif') {
      isActif = false;
    } else if (updateClientDto.isActive === 'Actif') {
      isActif = true;
    }
    const userToUpdateId = (
      await this.clientRepository.findOne({
        relations: ['user'],
        where: { id: id },
      })
    ).user.id;
    if (updateClientDto.password) {
      updateUserDto = {
        email: updateClientDto.email,
        password: updateClientDto.password,
        isActive: isActif,
        typeUser: TypeUserEnum.client,
      };
    } else {
      updateUserDto = {
        email: updateClientDto.email,
        isActive: isActif,
        typeUser: TypeUserEnum.client,
      };
    }
    const communeResidence = await this.communeService.findOne(
      updateClientDto.communeResidenceId,
    );
    const communeDepart = await this.communeService.findOne(
      updateClientDto.communeDepartId,
    );
    const agenceRetour = await this.agenceService.findOneAgenceById(
      updateClientDto.agenceRetourId,
    );
    const caisseAgence = await this.agenceService.findOneAgenceById(
      updateClientDto.caisseAgenceId,
    );
    const updateClient = this.clientRepository.create(updateClientDto);
    await this.userService.update(userToUpdateId, updateUserDto);
    updateClient.communeDepart = communeDepart;
    updateClient.communeResidence = communeResidence;
    updateClient.agenceRetour = agenceRetour;
    updateClient.caisseAgence = caisseAgence;
    const clientToUpdate = await this.clientRepository.update(id, updateClient);

    if (updateClientDto.typeTarif) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ClientsTarif)
        .where('clientId = :id', { id: id })
        .execute();
      for (const typeTarif of updateClientDto.typeTarif) {
        const createTarifclientDto: CreateClientsTarifDto = {
          clientId: id,
          codeTarifId: typeTarif.codeTarifId,
        };
        await this.clienttTarifService.create(createTarifclientDto);
      }
    }
    return clientToUpdate;
  }
  async updateActivity(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<UpdateResult> {
    let isActif: boolean;
    let updateUserDto: UpdateUserDto;
    if (updateClientDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    updateUserDto = {
      isActive: isActif,
    };
    const userToUpdateId = (
      await this.clientRepository.findOne({
        relations: ['user'],
        where: { id: id },
      })
    ).user.id;
    return this.userService.update(userToUpdateId, updateUserDto);
  }
  async getClientToExportBySearch(term: string) {
    return await this.clientRepository
      .createQueryBuilder('client')
      .innerJoin('client.communeResidence', 'communeResidence')
      .innerJoin('communeResidence.wilaya', 'wilayaResidence')
      .innerJoin('client.communeDepart', 'communeDepart')
      .innerJoin('communeDepart.wilaya', 'wilayaDepart')
      .innerJoin('client.agenceRetour', 'agenceRetour')
      .innerJoin('client.caisseAgence', 'caisseAgence')
      .select('client.numClient', 'n°Client')
      .addSelect('client.raisonSociale', 'raison social')
      .addSelect('client.nomCommercial', 'nom commercial')
      .addSelect('client.adresse', 'adresse')
      .addSelect('client.telephone', 'n° de téléphone')
      .addSelect('client.nomGerant', 'nom de gérant')
      .addSelect('client.prenomGerant', 'prénom de gérant')
      .addSelect('communeResidence.nomLatin', 'commune de résidence')
      .addSelect('wilayaResidence.nomLatin', 'wilaya de résidence')
      .addSelect('client.nrc', 'nrc')
      .addSelect('client.nif', 'nif')
      .addSelect('client.nis', 'nis')
      .addSelect('client.nbEnvoiMin', `nombre d'envoi min`)
      .addSelect('client.nbEnvoiMax', `nombre d'envoi max`)
      .addSelect('client.nbTentative', 'nombre de tentative')
      .addSelect('client.poidsBase', 'poids de base')
      .addSelect('client.tauxCOD', 'taux COD')
      .addSelect('client.moyenPayement', 'moyen de paiement')
      .addSelect('client.jourPayement', 'jour(s) de paiement')
      .addSelect('client.tarifRetour', 'tarif de retour')
      .addSelect('client.createdAt', 'date de création')
      .addSelect('communeDepart.nomLatin', 'commune de départ')
      .addSelect('wilayaDepart.nomLatin', 'wilaya de départ')
      .addSelect('agenceRetour.nom', 'agence de retour')
      .addSelect('caisseAgence.nom', 'agence de paiement')
      .where(
        `client.nomGerant ilike' %${term}%' or
              client.prenomGerant ilike '%${term}%' or
              client.telephone ilike '%${term}%' or
              client.nomCommercial ilike '%${term}%' or
              wilayaDepart.nomLatin ilike '%${term}%'
        `,
      )
      .getRawMany();
  }

  async export(res: any, term: string) {
    const data = await this.getClientToExportBySearch(term);
    this.excelService.exportToExcel(res, term, data);
  }

 
  
  async getClientsHaveClassicShipmentInInterval(
    dateDebut,
    dateFin,
    userId,
  ): Promise<any> {
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    const agenceId = (await this.userService.findOne(userId)).employe.agence.id;

    const clients = await await getManager()
      .createQueryBuilder(Shipment, 'shipment')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.client', 'client')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `(service.nom='Classique Entreprise') and client.caisseAgenceId=${agenceId}`,
      )
      .andWhere(
        `status.libelle = '${StatusShipmentEnum.expidie}' and shipment.facture IsNull`,
      )
      .andWhere('status.createdAt >= :dateDebut', { dateDebut: `${dateDebut}` })
      .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
      .select('client')
      .distinctOn(['client.id'])
      .getRawMany();
    if (clients) {
      return clients;
    } else {
      throw new EntityNotFoundError(Client, `n'existe pas`);
    }
  }

  async getClientsHaveEcommerceShipmentInInterval(
    dateDebut,
    dateFin,
    userId,
  ): Promise<any> {
    const date = new Date(dateFin);
    date.setHours(23, 59, 59);
    dateFin = date.toISOString();
    const agenceId = (await this.userService.findOne(userId)).employe.agence.id;
    console.log(
      '🚀 ~ file: clients.service.ts ~ line 561 ~ ClientsService ~ agenceId',
      agenceId,
    );

    const clients = await await getManager()
      .createQueryBuilder(Shipment, 'shipment')
      .leftJoinAndSelect('shipment.createdBy', 'createdBy')
      .leftJoinAndSelect('createdBy.client', 'client')
      .leftJoinAndSelect('shipment.status', 'status')
      .leftJoinAndSelect('shipment.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoin('status.user', 'user')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `(service.nom='E-Commerce Express Divers' or service.nom ='E-Commerce Economy Entreprise'
        or service.nom='E-Commerce Express Entreprise'
        or service.nom='E-Commerce Economy Divers' ) and (shipment.prixVente != 0 or shipment.livraisonGratuite=false)   and client.caisseAgenceId=${agenceId}`,
      )
      .andWhere(
        `(status.libelle = '${StatusShipmentEnum.payer}' or  status.libelle = '${StatusShipmentEnum.retirer}' ) and shipment.facture IsNull`,
      )
      .andWhere(
        `shipment.lastStatus = '${StatusShipmentEnum.payer}' or shipment.lastStatus = '${StatusShipmentEnum.retourPayer}' `,
      )
      .andWhere('status.createdAt >= :dateDebut', { dateDebut: `${dateDebut}` })
      .andWhere('status.createdAt <= :dateFin', { dateFin: `${dateFin}` })
      .select('client')
      .distinctOn(['client.id'])
      .getRawMany();
    if (clients) {
      return clients;
    } else {
      throw new EntityNotFoundError(Client, `n'existe pas`);
    }
  }

  async getClientHaveCredit(userId) {
    let soldeAgence: number;
    let soldeAregulariser: number;
    let tarifs: number;
    let tarifRetour: number;
    let prixCod: number;
    let nbrColis: number;
    let totalRamasser:number;
    let listClientWithSolde = [];
    const agenceId = (await this.userService.findOne(userId)).employe.agence.id;
    const clients = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.user', 'user')
      .leftJoinAndSelect('user.shipmentsCreated', 'shipment')
      .leftJoinAndSelect('shipment.service', 'service')
      .where(
        `(service.nom='E-Commerce Express Divers' or service.nom ='E-Commerce Economy Entreprise'
    or service.nom='E-Commerce Express Entreprise'
    or service.nom='E-Commerce Economy Divers' )  and client.caisseAgenceId=${agenceId}`,
      )
      .andWhere(
        `shipment.lastStatus = '${StatusShipmentEnum.pretAPayer}' or shipment.lastStatus = '${StatusShipmentEnum.retirer}' `,
      )
      .getMany();


    if (clients) {
      for await (const client of clients) {
        nbrColis = 0;
        tarifs = 0;
        tarifRetour = 0;
        soldeAgence = 0;
        totalRamasser=0;
        for await (const shipment of client.user.shipmentsCreated) {
          nbrColis = nbrColis + 1;
          

          if (shipment.lastStatus == StatusShipmentEnum.pretAPayer) {
           
            const tarifLivraison =
              await this.shipmentService.calculTarifslivraison(
                shipment.tracking,
              );
              if (shipment.livraisonGratuite == false){
              totalRamasser=totalRamasser + shipment.prixVente + tarifLivraison
              }else{
                totalRamasser=totalRamasser+shipment.prixVente
              }
            if (shipment.prixEstimer > client.c_o_d_ApartirDe) {
              prixCod = (shipment.prixEstimer * client.tauxCOD) / 100;
            } else {
              prixCod = 0;
            }
            tarifs = tarifs + tarifLivraison + prixCod;
          } else if (shipment.lastStatus == StatusShipmentEnum.retirer) {
            tarifRetour =tarifRetour+ client.tarifRetour;
          }
          

          
          console.log(nbrColis,'tarifs',tarifs,'cod',prixCod,'retour',tarifRetour,'soldeagence',soldeAgence)
        }
        soldeAgence = tarifs + tarifRetour;
        console.log("🚀 ~ file: clients.service.ts ~ line 680 ~ ClientsService ~ forawait ~ soldeAgence", soldeAgence)

        if (soldeAgence > totalRamasser) {
          soldeAregulariser = soldeAgence - totalRamasser;
          listClientWithSolde.push({
            client,
            soldeAgence: soldeAgence,
            soldeAregulariser: soldeAregulariser,
            nbrColis: nbrColis,
            totalRamasser:totalRamasser
          });
        }
      }
      return listClientWithSolde;
    } else {
      throw new EntityNotFoundError(Client, `n'existe pas`);
    }
  }
 





  async getTarifOfclient(wilayaDepartId, codeTarifId) {
    let tarifClient = [];
    const listwilaya = await this.wilayaService.findAllWilaya();
    let i = 0;
    for await (const wilaya of listwilaya) {
      i = i + 1;

      const zone = await this.zoneService.findZoneByRotation(
        wilayaDepartId,
        wilaya.id,
      );     
      const tarif = await this.codeTarifZone.findCodeTarifZoneWithoutPoids(
        zone.zone_id,
        codeTarifId,
      );
      const tarifClientInfo = {
        destination: wilaya.nomLatin,
        zone: zone.zone_id,
        tarifLivraison: tarif.tarifDomicile,
        tarifStopDesk: tarif.tarifStopDesk,
        tarifSurpoids:tarif.tarifPoidsParKg
      };
      tarifClient.push(tarifClientInfo);
    }
    return tarifClient;
  }

  async getTarifOfclientForClassic(wilayaDepartId, codeTarifId) {
    let tarifClient = [];
    let listZone=[];
    const listwilaya = await this.wilayaService.findAllWilaya();
    let i = 0;
    for await (const wilaya of listwilaya) {
      i = i + 1;

      const zone = await this.zoneService.findZoneByRotation(
        wilayaDepartId,
        wilaya.id,
      );  
      if (!listZone.includes(zone.zone_id)) {
        const tarif = await this.codeTarifZone.findCodeTarifZoneWithoutPoids(
          zone.zone_id,
          codeTarifId,
        );
        const tarifClientInfo = {
          zone: zone.zone_id,
          tarifLivraison: tarif.tarifDomicile,
          tarifSurpoids:tarif.tarifPoidsParKg
        };
        tarifClient.push(tarifClientInfo);
        listZone.push(zone.zone_id);
      }   
    }

    return tarifClient;
  }

}
