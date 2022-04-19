import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PdfService } from 'src/core/templates/pdf.service';
import { EntityNotFoundError, ILike, Repository } from 'typeorm';
import { Agence } from '../agences/entities/agence.entity';
import { CoursierService } from '../coursier/coursier.service';
import { Coursier } from '../coursier/entities/coursier.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreatePmtCoursierDto } from './dto/create-pmt-coursier.dto';
import { UpdatePmtCoursierDto } from './dto/update-pmt-coursier.dto';
import { PmtCoursier } from './entities/pmt-coursier.entity';

@Injectable()
export class PmtCoursierService {
  constructor(
    @InjectRepository(PmtCoursier)
    private pmtCoursierRepository: Repository<PmtCoursier>,
    private coursierService: CoursierService,
    private userService: UsersService,
    private pdfService: PdfService,
  ) {}

  async create(createPmtCoursierDto: CreatePmtCoursierDto) {
    const pmtCoursier = this.pmtCoursierRepository.create(createPmtCoursierDto);
    const coursier = await this.coursierService.findOne(
      createPmtCoursierDto.coursierId,
    );
    const agent = await this.userService.findInformationsEmploye(
      createPmtCoursierDto.employeId,
    );
    const agence = agent.employe.agence;
    pmtCoursier.coursier = coursier;
    pmtCoursier.createdBy = agent;
    pmtCoursier.createdOn = agence;
    const pmtCoursierSave = await this.pmtCoursierRepository.save(pmtCoursier);

    pmtCoursier.tracking =
      'pmtc-' + (await this.generateTracking(pmtCoursierSave.id));
    await this.pmtCoursierRepository.update(pmtCoursierSave.id, pmtCoursier);
    return pmtCoursierSave;
  }

  findAll() {
    return `This action returns all pmtCoursier`;
  }

  async findOne(id: number): Promise<PmtCoursier> {
    const pmtCoursier = await this.pmtCoursierRepository.findOne(id, {
      relations: [
        'coursier',
        'coursier.user',
        'createdBy',
        'createdBy.employe',
        'createdOn',
        'shipments',
      ],
    });
    if (pmtCoursier) {
      return pmtCoursier;
    } else {
      throw new EntityNotFoundError(PmtCoursier, id);
    }
  }

  async printPmtCoursier(PmtCoursierId: number) {
    const infoPmt = await this.findOne(PmtCoursierId);
    return await this.pdfService.printPmtCoursier(infoPmt);
  }
  async getPaiementDetailsCoursier(tracking) {
    const listShipment = [];
    const pmt = await this.pmtCoursierRepository.findOne({
      relations: ['coursier', 'shipments'],
      where: { tracking: tracking },
    });
    for await (const shipment of pmt.shipments) {
      listShipment.push({
        tracking: shipment.tracking,
        nomPrenom: shipment.nom + ' ' + shipment.prenom,
        numero: shipment.telephone,
      });
    }
    return listShipment;
  }
  update(id: number, updatePmtCoursierDto: UpdatePmtCoursierDto) {
    return `This action updates a #${id} pmtCoursier`;
  }

  remove(id: number) {
    return `This action removes a #${id} pmtCoursier`;
  }

  async generateTracking(id) {
    let code = id.toString();
    while (code.length < 8) code = '0' + code;
    return code.toLowerCase();
  }

  async findPmtCoursier(
    options: IPaginationOptions,
    searchPmtcTerm: string,
  ): Promise<Pagination<PmtCoursier>> {
    let pmtc = null;
    console.log(
      '🚀 ~ file: pmt-coursier.service.ts ~ line 126 ~ PmtCoursierService ~ pmtc',
      pmtc,
    );
    if (searchPmtcTerm && Number(searchPmtcTerm) != NaN) {
      pmtc = paginate<PmtCoursier>(
        this.pmtCoursierRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/pmtCoursier/paginatePmtc',
        },
        {
          relations: [
            'coursier',
            'createdBy',
            'createdBy.employe',
            'createdOn',
            'createdOn.commune',
            'createdOn.commune.wilaya',
          ],
          where: [
            { tracking: ILike(`%${searchPmtcTerm}%`) },
            {
              coursier: { nom: ILike(`%${searchPmtcTerm}%`) },
            },
            {
              coursier: { prenom: ILike(`%${searchPmtcTerm}%`) },
            },
            {
              createdBy: {
                employe: { nom: ILike(`%${searchPmtcTerm}%`) },
              },
            },
            {
              createdBy: {
                employe: { prenom: ILike(`%${searchPmtcTerm}%`) },
              },
            },
            {
              createdOn: { nom: ILike(`%${searchPmtcTerm}%`) },
            },
            {
              createdOn: {
                commune: {
                  wilaya: { nomLatin: ILike(`%${searchPmtcTerm}%`) },
                },
              },
            },
          ],
        },
      );
    } else {
      pmtc = paginate<PmtCoursier>(
        this.pmtCoursierRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/pmtCoursier/paginatePmtc',
        },
        {
          relations: [
            'coursier',
            'createdBy',
            'createdBy.employe',
            'createdOn',
            'createdOn.commune',
            'createdOn.commune.wilaya',
          ],
        },
      );
    }

    return pmtc;
  }
  async findPaginatePmtCoursierforCoursier(
    options: IPaginationOptions,
    requestedUser: User,
    searchPmtTerm?: string,
  ) {
    let pmts;
    const findCoursier =
      await this.coursierService.findInformationOfCoursierByUserId(
        requestedUser.id,
      );

    if (searchPmtTerm && Number(searchPmtTerm) != NaN) {
      pmts = paginate<PmtCoursier>(
        this.pmtCoursierRepository,
        {
          page: options.page,
          limit: options.limit,
          route: `http://localhost:3000/pmt/find-all-paginate-pmt?searchPmtTerm=${searchPmtTerm}`,
        },
        {
          relations: ['createdOn', 'coursier'],
          where: {
            coursier: {
              id: findCoursier.id,
            },
            tracking: ILike(`%${searchPmtTerm}%`),
          },
        },
      );
    } else {
      pmts = paginate<PmtCoursier>(
        this.pmtCoursierRepository,
        {
          page: options.page,
          limit: options.limit,
          route: `http://localhost:3000/pmt/find-all-paginate-pmt-coursier`,
        },
        {
          relations: ['createdOn', 'coursier'],
          where: {
            coursier: {
              id: findCoursier.id,
            },
          },
        },
      );
    }
    return pmts;
  }
}
