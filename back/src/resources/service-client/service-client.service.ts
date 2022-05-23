import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CommunesService } from '../communes/communes.service';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { PoidsService } from '../poids/poids.service';
import { RotationsService } from '../rotations/rotations.service';
import { ServicesService } from '../services/services.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { CreateServiceClientDto } from './dto/create-service-client.dto';
import { CreateShipmentByServiceClientDto } from './dto/create-shipment-by-service-client.dto';
import { EstimateTarifDto } from './dto/estimate-tarif-service-client.dto';
import { UpdateServiceClientDto } from './dto/update-service-client.dto';

@Injectable()
export class ServiceClientService {
  logger: Logger = new Logger(ServiceClientService.name);
  constructor(
    private readonly service: ServicesService,
    private readonly userService: UsersService,
    private readonly rotationsService: RotationsService,
    private readonly wilayaService: WilayasService,
    private readonly plagePoidService: PoidsService,
    private readonly codeTarifsZonesService: CodeTarifsZonesService,
    @Inject(forwardRef(() => ShipmentsService))
    private readonly shipmentService: ShipmentsService,
    private readonly expiditeurPublicService: ExpiditeurPublicService,
    private readonly communeService: CommunesService,
  ) {}

  create(createServiceClientDto: CreateServiceClientDto) {
    return 'This action adds a new serviceClient';
  }

  findAll() {
    return `This action returns all serviceClient`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceClient`;
  }

  async getEstimateTarif(
    requestedUser: User,
    estimateTarifDto: EstimateTarifDto,
  ) {
    // calculer un tarif de livraison
    /**
     * wilaya de depart +
     * wilaya de destination +
     * code tarif a utiliser +
     * poids Reel et pois volumique
     */

    // ###################### -- Classique Divers -- ######################
    const service = await this.service.findOneByName('Classique Divers');
    console.log(
      '🚀 ~// ###################### -- Classique Divers -- ###################### ~ line 58 ~ ServiceClientService ~ service',
      service,
    );
    const codeTarifId = service.codeTarif[0].id;
    console.log(
      '🚀 ~ file: service-client.service.ts ~ line 60 ~ ServiceClientService ~ codeTarifId',
      codeTarifId,
    );

    // ###################### -- Rotation -- ######################
    const userInfo = await this.userService.findInformationsEmploye(
      requestedUser.id,
    );
    console.log(
      '🚀 ~ // ###################### -- Rotation -- ###################### ~ line 65 ~ ServiceClientService ~ userInfo',
      userInfo,
    );
    const wilayaDepartId = userInfo.employe.agence.commune.wilaya.id;
    const wilayaDestination = await this.wilayaService.findOne(
      estimateTarifDto.wilayaId,
    );

    const wilayaDestinationId = wilayaDestination.id;
    const rotation =
      await this.rotationsService.findOneRotationByDepartId_DestinationId(
        wilayaDepartId,
        wilayaDestinationId,
      );
    const zoneId = rotation.zone.id;
    console.log(
      '🚀 ~ file: service-client.service.ts ~ line 64 ~ ServiceClientService ~ zoneId',
      zoneId,
    );

    // ###################### -- Plage Poids -- ######################
    const poidReel = estimateTarifDto.poids;
    const poidVolumique =
      estimateTarifDto.largeur *
      estimateTarifDto.longueur *
      estimateTarifDto.hauteur *
      200;

    let poidTarifier = 0;

    if (poidReel > poidVolumique) {
      poidTarifier = poidReel;
    } else {
      poidTarifier = poidVolumique;
    }

    const plagePoid = await this.plagePoidService.getPlagePoids(poidTarifier);
    const plagePoidsId = plagePoid.id;
    console.log(
      '🚀 ~ file: service-client.service.ts ~ line 83 ~ ServiceClientService ~ plagePoidsId',
      plagePoidsId,
    );

    // ###################### -- Code Tarif Zone Poids -- ######################

    const tarifUnitaire = await this.codeTarifsZonesService.findCodeTarifZon_v2(
      zoneId,
      codeTarifId,
      plagePoidsId,
    );
    let tarifApayer = 0;
    if (estimateTarifDto.livraisonDomicile) {
      tarifApayer =
        tarifUnitaire[0].tarifDomicile +
        tarifUnitaire[0].tarifPoidsParKg * poidTarifier;
    } else {
      tarifApayer =
        tarifUnitaire[0].tarifStopDesk +
        tarifUnitaire[0].tarifPoidsParKg * poidTarifier;
    }
    console.log(
      '🚀 ~ file: service-client.service.ts ~ line 105 ~ ServiceClientService ~ tarifUnitaire',
      tarifUnitaire,
    );
    return tarifApayer;
  }

  async createShipment(
    requestedUser: User,
    shipment: CreateShipmentByServiceClientDto,
    nomService: string,
    res: any,
  ) {
    const userInfo = await this.userService.findInformationsEmploye(
      requestedUser.id,
    );

    // ###################### -- Classique Divers -- ######################
    const service = await this.service.findOneByName(nomService);
    const codeTarifId = service.codeTarif[0].id;

    const communeDest = await this.communeService.findOne(shipment.communeId);

    // ###################### -- create new expiditeur public if not exist search by N° pièce d'identité -- ######################
    const exp = await this.expiditeurPublicService.findOrCreate({
      nomExp: shipment.nomExp,
      prenomExp: shipment.prenomExp,
      adresseExp: shipment.adresseExp,
      numIdentite: shipment.numIdentite,
      telephoneExp: shipment.telephoneExp,
      raisonSocialeExp: shipment.raisonSocialeExp,
    });

    const tarifLivraison = await this.getEstimateTarif(requestedUser, {
      serviceId: service.id,
      poids: shipment.poids,
      longueur: shipment.longueur,
      largeur: shipment.largeur,
      hauteur: shipment.hauteur,
      livraisonDomicile: shipment.livraisonDomicile,
      livraisonStopDesck: shipment.livraisonStopDesck,
      communeId: communeDest.id,
      wilayaId: communeDest.wilaya.id,
    });
    // ###################### -- create new shipment -- ######################
    return await this.shipmentService.createFromAgence(
      {
        raisonSociale: shipment.raisonSociale,
        nom: shipment.nom,
        prenom: shipment.prenom,
        telephone: shipment.telephone,
        adresse: shipment.adresse,
        designationProduit: shipment.designationProduit,
        prixEstimer: shipment.prixEstimer,
        poids: shipment.poids,
        longueur: shipment.longueur,
        largeur: shipment.largeur,
        hauteur: shipment.hauteur,
        livraisonStopDesck: false,
        livraisonDomicile: true,
        createdBy: userInfo,
        service: service,
        commune: communeDest,
        expiditeurPublic: exp,
      },
      userInfo,
      tarifLivraison,
      res,
    );
  }

  update(id: number, updateServiceClientDto: UpdateServiceClientDto) {
    return `This action updates a #${id} serviceClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceClient`;
  }
}
