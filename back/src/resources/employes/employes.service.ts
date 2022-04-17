import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { remove } from 'jszip';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { create } from 'qrcode';
import { async } from 'rxjs';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import { EntityNotFoundError, ILike, Repository, UpdateResult } from 'typeorm';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { CreateEmployeDto } from './dto/create-employe.dto';
import { UpdateEmployeDto } from './dto/update-employe.dto';
import { Employe } from './entities/employe.entity';

@Injectable()
export class EmployesService {
  constructor(
    @InjectRepository(Employe)
    private employeRepository: Repository<Employe>,
    private banqueService: BanquesService,
    private userService: UsersService,
    private fonctionService: FonctionsService,
    @Inject(forwardRef(() => AgencesService))
    private agenceService: AgencesService,
  ) {}

  async create(createEmployeDto: CreateEmployeDto) {
    let isActif: boolean;
    if (createEmployeDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    const currentDate = new Date();
    if (createEmployeDto.dateNaissance > currentDate) {
      throw new UnprocessableEntityException(
        'la date de naissance est supérieure à la date actuelle',
      );
    } else if (createEmployeDto.dateRecrutement > currentDate) {
      throw new UnprocessableEntityException(
        'la date de recrutement est supérieure à la date actuelle',
      );
    } else if (
      createEmployeDto.dateNaissance > createEmployeDto.dateRecrutement
    ) {
      throw new UnprocessableEntityException(
        'la date de recrutement est inférieure à la date de naissance',
      );
    } else {
      const createUserdto: CreateUserDto = {
        email: createEmployeDto.email,
        password: createEmployeDto.password,
        isActive: isActif,
        typeUser: createEmployeDto.typeUser,
      };
      const agence = await this.agenceService.findOneAgenceById(
        createEmployeDto.agenceId,
      );
      const banque = await this.banqueService.findOne(
        createEmployeDto.banqueId,
      );
      const fonction = await this.fonctionService.findOne(
        createEmployeDto.fonctionId,
      );
      const userSave = await this.userService.create(createUserdto);
      const user = await this.userService.findOne(userSave.id);
      const createEmploye = this.employeRepository.create(createEmployeDto);
      createEmploye.user = user;
      createEmploye.agence = agence;
      createEmploye.banque = banque;
      createEmploye.fonction = fonction;
      createEmploye.codeEmploye = 'yal-' + createEmployeDto.nom.substring(0, 3);
      return await this.employeRepository.save(createEmploye);
    }
  }
  async findPaginateEmploye(
    options: IPaginationOptions,
    searchEmployeTerm: string,
  ): Promise<Pagination<Employe>> {
    let employe;
    if (searchEmployeTerm && Number(searchEmployeTerm) != NaN) {
      employe = paginate<Employe>(
        this.employeRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/employes/paginateEmploye',
        },
        {
          relations: [
            'agence',
            'agence.commune',
            'agence.commune.wilaya',
            'user',
          ],
          where: [
            { nom: ILike(`%${searchEmployeTerm}%`) },
            { prenom: ILike(`%${searchEmployeTerm}%`) },
            { numTelephone: ILike(`%${searchEmployeTerm}%`) },
            { typeContrat: ILike(`%${searchEmployeTerm}%`) },
            { agence: { nom: ILike(`%${searchEmployeTerm}%`) } },
            {
              agence: {
                commune: {
                  wilaya: {
                    nomLatin: ILike(`%${searchEmployeTerm}%`),
                  },
                },
              },
            },
          ],
        },
      );
    } else {
      employe = paginate<Employe>(
        this.employeRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/employes/paginateEmploye',
        },
        {
          relations: [
            'agence',
            'agence.commune',
            'agence.commune.wilaya',
            'user',
          ],
        },
      );
    }
    if ((await employe).items.length <= 0) {
      throw new EntityNotFoundError(Employe, 'No employes');
    }
    return employe;
  }
  async findEmployesByAgence(agenceId: number) {
    const employes = await this.employeRepository.find({
      relations: ['agence'],
      where: {
        agence: {
          id: agenceId,
        },
      },
    });
    return employes;
  }

  async findAll(): Promise<Employe[]> {
    const employes = await this.employeRepository.find();
    return employes;
  }

  findOne(id: number): Promise<Employe> {
    const employe = this.employeRepository.findOne(id, {
      relations: [
        'banque',
        'fonction',
        'fonction.departement',
        'user',
        'agence',
        'agence.commune',
        'agence.commune.wilaya',
      ],
    });
    if (!employe) {
      throw new EntityNotFoundError(
        Employe,
        `employe with id ${id} not found.`,
      );
    }
    return employe;
  }
  async findOneByUserId(user: number) {
    console.log(
      '🚀 ~ file: employes.service.ts ~ line 25 ~ EmployesService ~ findOneByUserId ~ user',
      user,
    );
    const employe = await this.employeRepository.findOne({
      relations: ['agence', 'agence.commune', 'agence.commune.wilaya'],
      where: {
        user: user,
      },
    });
    return employe;
  }

  async getwilayaByUserId(user: any) {
    const employe = await this.employeRepository
      .createQueryBuilder('employe')
      .leftJoinAndSelect('employe.agence', 'agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .where(`employe.userId = ${user}`)
      .getRawOne();

    if (!employe) {
      throw new EntityNotFoundError(Employe, user.id);
    } else {
      return employe;
    }
  }

  async getEmployeStationByUserId(userId: number) {
    const user = await this.employeRepository
      .createQueryBuilder('employe')
      .leftJoinAndSelect('employe.user', 'user')
      .leftJoinAndSelect('employe.agence', 'agence')
      .leftJoinAndSelect('agence.commune', 'commune')
      .leftJoinAndSelect('commune.wilaya', 'wilaya')
      .select(['agence', 'wilaya'])
      .where(`user.id = ${userId}`)
      .getRawOne();
    if (!user) {
      throw new EntityNotFoundError(Employe, userId);
    } else {
      return user;
    }
  }
  // async update(id: number, updateEmployeDto: UpdateEmployeDto) {
  // }

  async findByNomPrenom(nom, prenom) {
    const employe = await this.employeRepository.findOne({
      relations: ['agence', 'agence.commune'],
      where: {
        nom: nom,
        prenom: prenom,
      },
    });
    if (!employe) {
      throw new EntityNotFoundError(Employe, nom);
    } else {
      return employe;
    }
  }
  remove(id: number) {
    return `This action removes a #${id} employe`;
  }
  async updateEmploye(
    updateEmployeDto: UpdateEmployeDto,
    id: number,
  ): Promise<UpdateResult> {
    let isActif: boolean;
    let updateUserDto: UpdateUserDto;
    if (updateEmployeDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    const currentDate = new Date();
    if (updateEmployeDto.dateNaissance > currentDate) {
      throw new UnprocessableEntityException(
        'la date de naissance est supérieure à la date actuelle',
      );
    } else if (updateEmployeDto.dateRecrutement > currentDate) {
      throw new UnprocessableEntityException(
        'la date de recrutement est supérieure à la date actuelle',
      );
    } else if (
      updateEmployeDto.dateNaissance > updateEmployeDto.dateRecrutement
    ) {
      throw new UnprocessableEntityException(
        'la date de recrutement est inférieure à la date de naissance',
      );
    } else {
      const userToUpdateId = (
        await this.employeRepository.findOne({
          relations: ['user'],
          where: { id: id },
        })
      ).user.id;
      if (updateEmployeDto.password) {
        updateUserDto = {
          email: updateEmployeDto.email,
          password: updateEmployeDto.password,
          isActive: isActif,
          typeUser: updateEmployeDto.typeUser,
        };
      } else {
        updateUserDto = {
          email: updateEmployeDto.email,
          isActive: isActif,
          typeUser: updateEmployeDto.typeUser,
        };
      }
      await this.userService.update(userToUpdateId, updateUserDto);
      const agence = await this.agenceService.findOneAgenceById(
        updateEmployeDto.agenceId,
      );
      const banque = await this.banqueService.findOne(
        updateEmployeDto.banqueId,
      );
      const fonction = await this.fonctionService.findOne(
        updateEmployeDto.fonctionId,
      );
      const updateEmploye = this.employeRepository.create(updateEmployeDto);
      updateEmploye.agence = agence;
      updateEmploye.banque = banque;
      updateEmploye.fonction = fonction;
      return await this.employeRepository.update(id, updateEmploye);
    }
  }

  async updateActivity(id: number, updateEmployeDto: UpdateEmployeDto): Promise<UpdateResult> {
    let isActif: boolean;
    let updateUserDto: UpdateUserDto;
    if (updateEmployeDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    updateUserDto = {
      isActive: isActif,
    };
    const userToUpdateId = (
      await this.employeRepository.findOne({
        relations: ['user'],
        where: { id: id },
      })
    ).user.id;
    return this.userService.update(userToUpdateId, updateUserDto)
  }
}
