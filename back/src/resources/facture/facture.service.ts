import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PdfService } from 'src/core/templates/pdf.service';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
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
  ) {}

  async generateNumFacture(id) {
    let code = id.toString();
    while (code.length < 6) code = '0' + code;
    return code.toLowerCase();
  }

  async create(createFactureDto: CreateFactureDto) {
    console.log(
      '🚀 ~ file: facture.service.ts ~ line 22 ~ FactureService ~ create ~ createFactureDto',
      createFactureDto,
    );

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

  remove(id: number) {
    return `This action removes a #${id} facture`;
  }

  async findPaginateFacture(
    options: IPaginationOptions,
    searchFactureTerm: string,
    payer: boolean,
  ): Promise<Pagination<Facture>> {
    let facture;
    if (searchFactureTerm && Number(searchFactureTerm) != NaN) {
      facture = this.factureRepository
        .createQueryBuilder('facture')
        .leftJoinAndSelect('facture.client', 'client')
        .leftJoinAndSelect('facture.shipments', 'shipments').where(`
        facture.payer= ${payer} and (
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
        .leftJoinAndSelect('facture.shipments', 'shipments')
        .where(`facture.payer= ${payer}`);
    }
    return await paginate<any>(facture, {
      page: options.page,
      limit: options.limit,
      route: 'http://localhost:3000/facture/paginateFacture',
    });
  }

  async payerFacture(id: number, paiementInfo: any) {
    console.log(
      '🚀 ~ file: facture.service.ts ~ line 120 ~ FactureService ~ payerFacture ~ id',
      id,
    );
    console.log(
      '🚀 ~ file: facture.service.ts ~ line 120 ~ FactureService ~ payerFacture ~ paiementInfo',
      paiementInfo,
    );
    const datePaiement = new Date();
    console.log(
      '🚀 ~ file: facture.service.ts ~ line 123 ~ FactureService ~ payerFacture ~ datePaiement',
      datePaiement,
    );
    const facture = await this.findOne(id);
    if (facture) {
      const factureToUpdate = this.factureRepository.create();
      factureToUpdate.payer = false;
      factureToUpdate.modePaiement = paiementInfo.moyenPayement;
      factureToUpdate.datePaiement = datePaiement;
      if (paiementInfo.numeroCheque != null) {
        factureToUpdate.numCheque = paiementInfo.numeroCheque;
      }
      const factureUpdated = await this.factureRepository.update(
        id,
        factureToUpdate,
      );
      console.log(
        '🚀 ~ file: facture.service.ts ~ line 138 ~ FactureService ~ payerFacture ~ factureUpdated',
        factureUpdated,
      );
      return this.prinFactureClassique(id);
    }

    throw new EntityNotFoundError(Facture, 'cette facture existe pas');
  }

  async prinFactureClassique(factureId: number) {
    const infoFacture = await this.findOne(factureId);
    return await this.pdfService.printFactureClassique(infoFacture);
  }
}
