import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PdfService } from 'src/core/templates/pdf.service';
import { StatusShipmentEnum } from 'src/enums/status.shipment.enum';
import { ILike, Repository } from 'typeorm';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/entities/client.entity';
import { EmployesService } from '../employes/employes.service';
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
  ) {}

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
      ],
      where: { tracking: tracking },
    });
  }
  update(id: number, updatePmtDto: UpdatePmtDto) {
    return `This action updates a #${id} pmt`;
  }

  remove(id: number) {
    return `This action removes a #${id} pmt`;
  }

  async payerClient(requestedUser: User, clientId: any, res: any) {
    const infoPayment = await this.shipmentService.getSoldeClient(
      requestedUser,
      clientId,
    );
    console.log(
      '🚀 ~ file: pmt.service.ts ~ line 66 hakil~ PmtService ~ payerClient ~ infoPayment',
      infoPayment.shipments,
    );
    const trakingPmt = await this.generatePmtYal();

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
          tarifs += `\v ${ite.zone.rotations[0].wilayaDestination.nomLatin.toUpperCase()} \n \v Tarif Domicile: ${
            ite.tarifDomicile
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
      tracking: trakingPmt,
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
      shipments: infoPayment.shipments,
    });

    infoPayment.shipments.forEach(async (shipment) => {
      await this.statusService.create({
        user: requestedUser,
        shipment: await this.shipmentService.findOne(shipment.id),
        libelle: StatusShipmentEnum.payer,
        createdOn: infoPayment.userStation.employe.agence.id,
        // userAffect: shipment.yal-523uia
      });
    });

    const pmt = await this.findOnePmt(savePmt.tracking);

    const buffer = await this.printPmt(infoPayment.clientInfo, pmt, res);
  }

  async printPmt(client: Client, pmt: Pmt, res) {
    const buffer = await this.pdfService.printPmt(client, pmt);
    const buf = Buffer.from(buffer);
    res.send(buf);
    return res;
  }

  async generatePmtYal() {
    const x1 = 'pmt-';
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
    const response = await this.pmtRepository.findOne({
      where: {
        tracking: tracking,
      },
    });
    while (response) {
      await this.generatePmtYal();
    }
    return tracking.toLowerCase();
  }
  async printPmtById(pmtTraking: string, userRequesed: User, res) {
    const pmt = await this.findOnePmt(pmtTraking);
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
