import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PdfService } from 'src/core/templates/pdf.service';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { ILike, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/entities/client.entity';
import { EmployesService } from '../employes/employes.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePmtDto } from './dto/create-pmt.dto';
import { UpdatePmtDto } from './dto/update-pmt.dto';
import { Pmt } from './entities/pmt.entity';

@Injectable()
export class PmtService {
  constructor(
    @InjectRepository(Pmt)
    private readonly pmtRepository: Repository<Pmt>,
    private readonly shipmentService: ShipmentsService,
    private readonly clientsService: ClientsService,
    private readonly statusService: StatusService,
    private readonly emmplyeService: EmployesService,
    private readonly pdfService: PdfService,
  ) { }

  create(createPmtDto: CreatePmtDto) {
    return 'This action adds a new pmt';
  }

  findAll() {
    return `This action returns all pmt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pmt`;
  }

  async findOnePmt(tracking: string): Promise<Pmt> {
    return await this.pmtRepository.findOne({
      relations: [
        'createdBy',
        'createdBy.employe',
        'createdOn',
        'wilayaDeparPmt',
        'client',
        'validatedOn',
        'shipments',
      ],
      where: { tracking: tracking },
    });
  }
  async getPaiementDetails(tracking) {
    console.log(
      '🚀 ~ file: pmt.service.ts ~ line 57 ~ PmtService ~ getPaiementDetails ~ tracking',
      tracking,
    );
    // console.log('jhzbefhzebfb')
    const listShipment = [];
    const pmt = await this.pmtRepository.findOne({
      relations: ['client', 'shipments', 'shipments.status'],
      where: { tracking: tracking },
    });

    for await (const shipment of pmt.shipments) {
      listShipment.push({
        tracking: shipment.tracking,
        prixProduit: shipment.prixVente,
        nomPrenom: shipment.nom + ' ' + shipment.prenom,
        prixLivraison: await this.shipmentService.calculTarifslivraison(
          shipment.tracking,
        ),
        status: shipment.status.some(
          (ship) => ship.libelle === StatusShipmentEnum.livre,
        )
          ? 'Livré'
          : 'Retour',
        cod:
          shipment.prixEstimer > pmt.client.c_o_d_ApartirDe
            ? (pmt.client.tauxCOD / 100) * shipment.prixEstimer
            : 0,
      });
    }

    console.log(
      '🚀 ~ file: pmt.service.ts ~ line 59 ~ PmtService ~ getPaiementDetails ~ pmt',
      listShipment,
    );
    return listShipment;
  }
  async printPmtCLientById(pmtTraking: string, userRequesed: User, res) {
    const findClientUser = await this.clientsService.findOne(userRequesed.id);
    const pmt = await this.pmtRepository.findOne({
      relations: [
        'createdBy',
        'createdBy.employe',
        'createdOn',
        'wilayaDeparPmt',
        'client',
        'validatedOn',
      ],
      where: {
        tracking: pmtTraking,
        client: findClientUser.client_id,
      },
    });
    // console.log("🚀 ~ file: pmt.service.ts ~ line 65 ~ PmtService ~ printPmtCLientById ~ pmt", pmt)
    const buffer = await this.pdfService.printPmt(pmt.client, pmt);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }
  async findAllPaginatePmtClient(
    options: IPaginationOptions,
    requestedUser: User,
    searchPmtTerm?: string,
  ) {
    delete requestedUser.email;
    let pmts;
    const findClientUser = await this.clientsService.findOne(requestedUser.id);

    if (searchPmtTerm && Number(searchPmtTerm) != NaN) {
      pmts = paginate<Pmt>(
        this.pmtRepository,
        {
          page: options.page,
          limit: options.limit,
          route: `http://localhost:3000/pmt/find-all-paginate-pmt?searchPmtTerm=${searchPmtTerm}`,
        },
        {
          relations: [
            // 'createdBy',
            // 'createdBy.employe',
            'createdOn',
            'wilayaDeparPmt',
            'client',
            'validatedOn',
          ],
          where: {
            client: {
              id: findClientUser.client_id,
            },
            tracking: ILike(`%${searchPmtTerm}%`),
          },
        },
      );
    } else {
      pmts = paginate<Pmt>(
        this.pmtRepository,
        {
          page: options.page,
          limit: options.limit,
          route: `http://localhost:3000/pmt/find-all-paginate-pmt`,
        },
        {
          relations: [
            // 'createdBy',
            // 'createdBy.employe',
            'createdOn',
            'wilayaDeparPmt',
            'client',
            'validatedOn',
          ],
          where: {
            client: {
              id: findClientUser.client_id,
            },
          },
        },
      );
    }

    return pmts;
  }
  update(id: number, updatePmtDto: UpdatePmtDto) {
    return `This action updates a #${id} pmt`;
  }

  remove(id: number) {
    return `This action removes a #${id} pmt`;
  }

  async payerClient(requestedUser: User, clientId: any, res: any, reg?: string) {

    const infoPayment = await this.shipmentService.getSoldeClient(
      requestedUser,
      clientId,
    );


    let tarifs = '';

    const tarifClient = await this.clientsService.tarifClient(
      infoPayment.clientInfo.id,
      infoPayment.clientInfo.communeDepart.wilaya.id,
    );

    for await (const tarif of tarifClient) {
      for await (const iterator of tarif.clientsTarifs) {
        console.log(iterator.codeTarif.service.nom);
        tarifs += `Service: ${iterator.codeTarif.service.nom} \n`;
        for await (const ite of iterator.codeTarif.codeTarifZone) {
          tarifs += `\v ${ite.zone.rotations[0].wilayaDestination.nomLatin.toUpperCase()} \n \v Tarif Domicile: ${ite.tarifDomicile
            } --- Tarif StopDesk: ${ite.tarifStopDesk} \n \n`;
          console.log(ite.zone.rotations[0].wilayaDestination.nomLatin);
          console.log(ite.tarifDomicile);
          console.log(ite.tarifStopDesk);
          console.log('-------------------------------------------------');
        }
        tarifs += '\n \n';
      }
    }

    const savePmt = await this.pmtRepository.save({
      client: infoPayment.clientInfo,
      createdBy: requestedUser,
      createdOn: infoPayment.userStation.employe.agence,
      tauxC_O_D: infoPayment.clientInfo.tauxCOD,
      tarifRetour: infoPayment.clientInfo.tarifRetour,
      wilayaDeparPmt: infoPayment.clientInfo.communeDepart.wilaya,
      montantRamasser: infoPayment.recolter,
      FraisD_envois:
        infoPayment.totalTarifLivraisonDomicile +
        infoPayment.totalTarifLivraisonStopDesk,
      montantC_O_D: infoPayment.totalFraiCOD,
      FraisRetour: infoPayment.fraiRetoure,
      netClient: infoPayment.netPayerClient,
      nbShipmentLivrer:
        infoPayment.nbShipmentDomicile + infoPayment.nbShipmentStopDesk,
      nbShipmentRetour:
        infoPayment.fraiRetoure / infoPayment.clientInfo.tarifRetour,
      tarifs: tarifs,
      shipments: infoPayment.shipments.concat(infoPayment.retoureShipments),
    });
    const tracking = 'pmt-' + (await this.generateTracking(savePmt.id));
    await this.pmtRepository.update(savePmt.id, { tracking: tracking })
    infoPayment.shipments.forEach(async (shipment) => {
      await this.statusService.create({
        user: requestedUser,
        shipment: await this.shipmentService.findOne(shipment.id),
        libelle: StatusShipmentEnum.payer,
        createdOn: infoPayment.userStation.employe.agence.id,
        // userAffect: shipment.yal-523uia
      });
    });

    infoPayment.retoureShipments.forEach(async (shipment) => {
      await this.statusService.create({
        user: requestedUser,
        shipment: await this.shipmentService.findOne(shipment.id),
        libelle: StatusShipmentEnum.retourPayer,
        createdOn: infoPayment.userStation.employe.agence.id,
        // userAffect: shipment.yal-523uia
      });
    });
    const pmt = await this.findOnePmt(tracking);

    const buffer = await this.printPmt(infoPayment.clientInfo, pmt, res);
  }

  async printPmt(client: Client, pmt: Pmt, res) {
    console.log('ghghgh');
    const buffer = await this.pdfService.printPmt(client, pmt);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  async generateTracking(id) {
    let code = id.toString();
    while (code.length < 8) code = '0' + code;
    return code.toLowerCase();
  } 
  async printPmtById(pmtTraking: string, userRequesed: User, res) {
    console.log(
      '🚀 ~ file: pmt.service.ts ~ line 319 ~ PmtService ~ printPmtById ~ pmtTraking',
      pmtTraking,
    );
    console.log('ghghghghghgh');
    const pmt = await this.findOnePmt(pmtTraking);
    console.log(
      '🚀 ~ file: pmt.service.ts ~ line 321 ~ PmtService ~ printPmtById ~ pmt',
      pmt,
    );
    const buffer = await this.pdfService.printPmt(pmt.client, pmt);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  async findAllPaginatePmt(
    options: IPaginationOptions,
    requestedUser: User,
    searchPmtTerm?: string,
  ) {
    delete requestedUser.email;
    let pmts;
    const employeInfo = await this.emmplyeService.findOneByUserId(
      requestedUser.id,
    );
    if (searchPmtTerm && Number(searchPmtTerm) != NaN) {
      pmts = paginate<Pmt>(
        this.pmtRepository,
        {
          page: options.page,
          limit: options.limit,
          route: `http://localhost:3000/pmt/find-all-paginate-pmt?searchPmtTerm=${searchPmtTerm}`,
        },
        {
          relations: [
            'createdBy',
            'createdBy.employe',
            'createdOn',
            'wilayaDeparPmt',
            'client',
            'validatedOn',
          ],
          where: {
            createdOn: {
              id: employeInfo.agence.id,
            },
            tracking: ILike(`%${searchPmtTerm}%`),
          },
        },
      );
    } else {
      pmts = paginate<Pmt>(
        this.pmtRepository,
        {
          page: options.page,
          limit: options.limit,
          route: `http://localhost:3000/pmt/find-all-paginate-pmt`,
        },
        {
          relations: [
            'createdBy',
            'createdBy.employe',
            'createdOn',
            'wilayaDeparPmt',
            'client',
            'validatedOn',
          ],
          where: {
            createdOn: {
              id: employeInfo.agence.id,
            },
          },
        },
      );
    }

    return pmts;
  }
}
