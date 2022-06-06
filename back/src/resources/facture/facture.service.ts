import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PdfService } from 'src/core/templates/pdf.service';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { RecoltesService } from '../recoltes/recoltes.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { UsersService } from '../users/users.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { UpdateFactureDto } from './dto/update-facture.dto';
import { Facture } from './entities/facture.entity';

@Injectable()
export class FactureService {
  constructor(
    @InjectRepository(Facture)
    private factureRepository: Repository<Facture>,
    private clientService: ClientsService,
    private userService: UsersService,
    private pdfService: PdfService,
    @Inject(forwardRef(() => ShipmentsService))
    private shipmentService: ShipmentsService,
    private recolteService: RecoltesService,
  ) {}

  async generateNumFacture(id) {
    let code = id.toString();
    while (code.length < 6) code = '0' + code;
    return code.toLowerCase();
  }

  async create(createFactureDto: CreateFactureDto) {
    const facture = this.factureRepository.create(createFactureDto);
    const client = await this.clientService.findOneClientById(
      createFactureDto.clientId,
    );
    const agent = await this.userService.findInformationsEmploye(
      createFactureDto.employeId,
    );
    const agence = agent.employe.agence;
    facture.client = client;
    facture.createdBy = agent;
    facture.createdOn = agence;
    const factureSave = await this.factureRepository.save(facture);
    facture.numFacture =
      'C/Fact' +
      (await this.generateNumFacture(factureSave.id)) +
      '/' +
      factureSave.createdAt.getFullYear();
    const factureFinal = this.factureRepository.update(factureSave.id, facture);
    return factureSave;
  }

  findAll() {
    const factures = this.factureRepository.find();
    if (factures) {
      return factures;
    } else {
      throw new EntityNotFoundError(Facture, 'pas de factures');
    }
  }

  async findOne(id: number): Promise<Facture> {
    const facture = await this.factureRepository.findOne(id, {
      relations: [
        'client',
        'client.user',
        'createdBy',
        'createdBy.employe',
        'createdOn',
        'shipments',
      ],
    });
    if (facture) {
      return facture;
    } else {
      throw new EntityNotFoundError(Facture, id);
    }
  }

  async findOneFactureClassique(id: number): Promise<Facture[]> {
    const facture = await this.factureRepository
      .createQueryBuilder('facture')
      .leftJoinAndSelect('facture.client', 'client')
      .leftJoinAndSelect('facture.shipments', 'shipments')
      .leftJoinAndSelect('shipments.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('shipments.status', 'status')
      .where(`facture.id=${id}`)
      .andWhere(`status.libelle = '${StatusShipmentEnum.expidie}'`)
      .getRawMany();

    for await (const colis of facture) {
      if (
        colis.shipments_poids >
        colis.shipments_longueur *
          colis.shipments_largeur *
          colis.shipments_hauteur *
          200
      ) {
        colis.poids = colis.shipments_poids;
      } else {
        colis.poids =
          colis.shipments_longueur *
          colis.shipments_largeur *
          colis.shipments_hauteur *
          200;
      }
      const tarifs = await this.shipmentService.calculTarifslivraison(
        colis.shipments_tracking,
      );

      colis.tarif = tarifs;
    }
    if (facture) {
      return facture;
    } else {
      throw new EntityNotFoundError(Facture, id);
    }
  }

  async findOneFactureEcommerce(id: number): Promise<Facture[]> {
    let montantTotalColis = 0;
    let tarifLivraison = 0;
    let tarifRetour = 0;
    let prixCod = 0;
    const facture = await this.factureRepository
      .createQueryBuilder('facture')
      .leftJoinAndSelect('facture.client', 'client')
      .leftJoinAndSelect('facture.shipments', 'shipments')
      .leftJoinAndSelect('shipments.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .leftJoinAndSelect('shipments.status', 'status')
      .where(`facture.id=${id}`)
      .andWhere(
        `(status.libelle = '${StatusShipmentEnum.livre}' or  status.libelle = '${StatusShipmentEnum.retirer}' )`,
      )
      .getRawMany();

    for await (const shipment of facture) {
      if (
        shipment.shipments_poids >
        shipment.shipments_longueur *
          shipment.shipments_largeur *
          shipment.shipments_hauteur *
          200
      ) {
        shipment.poids = shipment.shipments_poids;
      } else {
        shipment.poids =
          shipment.shipments_longueur *
          shipment.shipments_largeur *
          shipment.shipments_hauteur *
          200;
      }
      if (shipment.status_libelle == StatusShipmentEnum.livre) {
        const tarifs = await this.shipmentService.calculTarifslivraison(
          shipment.shipments_tracking,
        );
        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');

        tarifLivraison = tarifs;
        shipment.tarifLivraison = tarifLivraison;
        tarifRetour = 0;
        shipment.tarifRetour = tarifRetour;
        prixCod =
          (shipment.shipments_prixEstimer * shipment.client_tauxCOD) / 100;
        montantTotalColis = prixCod + tarifLivraison + tarifRetour;
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
    }
    if (facture) {
      return facture;
    } else {
      throw new EntityNotFoundError(Facture, id);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} facture`;
  }

  async findPaginateFacture(
    options: IPaginationOptions,
    searchFactureTerm: string,
    payer: boolean,
    type: string,
  ): Promise<Pagination<Facture>> {
    console.log(
      '🚀 ~ file: facture.service.ts ~ line 207 ~ FactureService ~ type',
      type,
    );
    let facture;
    if (searchFactureTerm && Number(searchFactureTerm) != NaN) {
      facture = this.factureRepository
        .createQueryBuilder('facture')
        .leftJoinAndSelect('facture.client', 'client').where(`
        facture.payer= ${payer} and facture.typeFacture='${type}' and (
        facture.numFacture ilike  '%${searchFactureTerm}%' or
        client.raisonSociale ilike '%${searchFactureTerm}%' or
        client.nomGerant ilike '%${searchFactureTerm}%' or
        client.prenomGerant ilike '%${searchFactureTerm}%' or
        client.nomCommercial ilike '%${searchFactureTerm}%') 
        `);
    } else {
      facture = this.factureRepository
        .createQueryBuilder('facture')
        .leftJoinAndSelect('facture.client', 'client')
        .where(`facture.payer= ${payer} and facture.typeFacture='${type}'`);
    }
    return await paginate<any>(facture, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/facture/paginateFacture',
    });
  }

  async payerFacture(id: number, paiementInfo: any) {
    const datePaiement = new Date();

    const facture = await this.findOne(id);
    if (facture) {
      const factureToUpdate = this.factureRepository.create();
      factureToUpdate.payer = true;
      factureToUpdate.modePaiement = paiementInfo.moyenPayement;
      factureToUpdate.datePaiement = datePaiement;
      if (paiementInfo.numeroCheque != null) {
        factureToUpdate.numCheque = paiementInfo.numeroCheque;
      }
      const factureUpdated = await this.factureRepository.update(
        id,
        factureToUpdate,
      );

      return facture;
    }

    throw new EntityNotFoundError(Facture, 'cette facture existe pas');
  }

  async prinFactureClassique(factureId: number) {
    const infoFacture = await this.findOneFactureClassique(factureId);
    return await this.pdfService.printFactureClassique(infoFacture);
  }

  async prinFactureEcommerceDetail(factureId: number) {
    const infoFacture = await this.findOneFactureEcommerce(factureId);
    return await this.pdfService.printFactureEcommerceDetail(infoFacture);
  }

  async prinFactureEcommerceSimplifie(factureId: number) {
    const infoFacture = await this.findOneFactureEcommerce(factureId);
    return await this.pdfService.printFactureEcommerceSimplifie(infoFacture);
  }
  logger = new Logger(FactureService.name);
  async getStatistique() {
    const sommeTotal = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`SUM(facture.montantTotal)`, 'sommeTotal')
      .getRawOne();
    const sommeTotalClassique = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`SUM(facture.montantTotal)`, 'sommeTotalClassique')
      .where(`facture.typeFacture='classique'`)
      .getRawOne();
    const sommeTotalClassiquePayer = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`SUM(facture.montantTotal)`, 'sommeTotalClassiquePayer')
      .where(`facture.typeFacture='classique' and facture.payer=true`)
      .getRawOne();
    const sommeTotalClassiqueNonPayer = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`SUM(facture.montantTotal)`, 'sommeTotalClassiqueNonPayer')
      .where(`facture.typeFacture='classique' and facture.payer=false`)
      .getRawOne();
    const sommeTotalEcommerce = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`SUM(facture.montantTotal)`, 'sommeTotalEcommerce')
      .where(`facture.typeFacture='ecommerce'`)
      .getRawOne();

    const nombreTotal = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`COUNT(facture.id)`, 'nombreTotal')
      .getRawOne();
    const nombreTotalClassique = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`COUNT(facture.id)`, 'nombreTotalClassique')
      .where(`facture.typeFacture='classique'`)
      .getRawOne();
    const nombreTotalClassiquePayer = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`COUNT(facture.id)`, 'nombreTotalClassiquePayer')
      .where(`facture.typeFacture='classique' and facture.payer=true`)
      .getRawOne();
    const nombreTotalClassiqueNonPayer = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`COUNT(facture.id)`, 'nombreTotalClassiqueNonPayer')
      .where(`facture.typeFacture='classique' and facture.payer=false`)
      .getRawOne();
    const nombreTotalEcommerce = await this.factureRepository
      .createQueryBuilder('facture')
      .select(`COUNT(facture.id)`, 'nombreTotalEcommerce')
      .where(`facture.typeFacture='ecommerce'`)
      .getRawOne();

      this.logger.log(sommeTotal)
    return [
      {
        sommeTotal: sommeTotal,
        sommeTotalClassique: sommeTotalClassique,
        sommeTotalClassiquePayer: sommeTotalClassiquePayer,
        sommeTotalClassiqueNonPayer: sommeTotalClassiqueNonPayer,
        sommeTotalEcommerce: sommeTotalEcommerce,

        nombreTotal: nombreTotal,
        nombreTotalClassique: nombreTotalClassique,
        nombreTotalClassiquePayer: nombreTotalClassiquePayer,
        nombreTotalClassiqueNonPayer: nombreTotalClassiqueNonPayer,
        nombreTotalEcommerce: nombreTotalEcommerce,
      },
    ];
  }

  async getFactureEspeceNonRecolter(userId): Promise<any> {
    console.log(
      '🚀 ~ file: facture.service.ts ~ line 373 ~ FactureService ~ getFactureEspeceNonRecolter ~ userId',
      userId,
    );
    let montantTotal = 0;
    const factures = await this.factureRepository.find({
      where: { espece: true, recolte: null, createdBy: { id: userId } },
      relations: ['client'],
    });
    if (factures) {
      for await (const facture of factures) {
        if (facture.typeFacture == 'ecommerce') {
          montantTotal =
            montantTotal + facture.montantTva + facture.montantTimbre;
        } else if (facture.typeFacture == 'classique') {
          montantTotal = montantTotal + facture.montantTotal;
        }
      }
      return [factures, { montantTotal: montantTotal }];
    }
    throw new EntityNotFoundError(Facture, 'pas de facture à récolter');
  }

  async recolterFacture(userId) {
    const factures = await this.getFactureEspeceNonRecolter(userId);
    const montantTotal = factures[1].montantTotal;
    const listFacture = factures[0];
    if (listFacture.length > 0) {
      return await this.recolteService.createRecolteFacture(
        userId,
        montantTotal,
        listFacture,
      );
    } else {
      throw new EntityNotFoundError(Facture, 'pas de facture à récolter');
    }
  }
}
