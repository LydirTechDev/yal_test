import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
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
    pmtCoursier.tracking = await this.generatePmtYal();
    return await this.pmtCoursierRepository.save(pmtCoursier);
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

  update(id: number, updatePmtCoursierDto: UpdatePmtCoursierDto) {
    return `This action updates a #${id} pmtCoursier`;
  }

  remove(id: number) {
    return `This action removes a #${id} pmtCoursier`;
  }

  async generatePmtYal() {
    const x1 = 'pmtc-';
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
    console.log(
      '🚀 ~ file: pmt-coursier.service.ts ~ line 90 ~ PmtCoursierService ~ generatePmtYal ~ x1+x2+x3',
      x1 + x2 + x3,
    );

    return x1 + x2 + x3;
  }
  async findPmtCoursier(
    options: IPaginationOptions,
    searchPmtcTerm: string,
  ): Promise<Pagination<PmtCoursier>> {
    let pmtc = null;
    console.log("🚀 ~ file: pmt-coursier.service.ts ~ line 126 ~ PmtCoursierService ~ pmtc", pmtc)
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
}
