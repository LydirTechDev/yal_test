import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { TypeUserEnum } from 'src/enums/TypeUserEnum';
import { UsersService } from 'src/resources/users/users.service';
import { EntityNotFoundError, ILike, Repository, UpdateResult } from 'typeorm';
import { AgencesService } from '../agences/agences.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateCoursierDto } from './dto/create-coursier.dto';
import { UpdateCoursierDto } from './dto/update-coursier.dto';
import { Coursier } from './entities/coursier.entity';

@Injectable()
export class CoursierService {
  constructor(
    @InjectRepository(Coursier)
    private coursierRepository: Repository<Coursier>,
    private userService: UsersService,
    private agenceService: AgencesService,

  ) {}
  //creation de coursier
  async create(createCoursierDto: CreateCoursierDto) {
    let isActif: boolean;
    if (createCoursierDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    const currentDate = new Date();
    if (createCoursierDto.dateNaissance > currentDate) {
      throw new UnprocessableEntityException(
        'la date de naissance est supérieure à la date actuelle',
      );
    } else if (createCoursierDto.dateRecrutement > currentDate) {
      throw new UnprocessableEntityException(
        'la date de recrutement est supérieure à la date actuelle',
      );
    } else if (
      createCoursierDto.dateNaissance > createCoursierDto.dateRecrutement
    ) {
      throw new UnprocessableEntityException(
        'la date de recrutement est inférieure à la date de naissance',
      );
    } else {
      const createUserdto: CreateUserDto = {
        email: createCoursierDto.email,
        password: createCoursierDto.password,
        isActive: isActif,
        typeUser: TypeUserEnum.coursier,
      };

      const agence = await this.agenceService.findOneAgenceById(
        createCoursierDto.agenceId,
      );
      const userSave = await this.userService.create(createUserdto);
      const user = await this.userService.findOne(userSave.id);
      const createCoursier = this.coursierRepository.create(createCoursierDto);
      createCoursier.agence = agence;
      createCoursier.user = user;
      return await this.coursierRepository.save(createCoursier);
    }
  }

  async findPaginateCoursier(
    options: IPaginationOptions,
    searchCoursierTerm: string,
  ): Promise<Pagination<Coursier>> {
    let coursiers;
    if (searchCoursierTerm && Number(searchCoursierTerm) != NaN) {
      coursiers = paginate<Coursier>(
        this.coursierRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/coursiers/paginateCoursier',
        },
        {
          relations: [
            'agence',
            'agence.commune',
            'agence.commune.wilaya',
            'user',
          ],
          where: [
            { nom: ILike(`%${searchCoursierTerm}%`) },
            { prenom: ILike(`%${searchCoursierTerm}%`) },
            { numTelephone: ILike(`%${searchCoursierTerm}%`) },
            { typeContrat: ILike(`%${searchCoursierTerm}%`) },
            {
              agence: {
                commune: {
                  wilaya: {
                    nomLatin: ILike(`%${searchCoursierTerm}%`),
                  },
                },
              },
            },
          ],
        },
      );
    } else {
      coursiers = paginate<Coursier>(
        this.coursierRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/coursiers/paginateCoursier',
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
    if ((await coursiers).items.length <= 0) {
      throw new EntityNotFoundError(Coursier, 'No coursiers');
    }
    return coursiers;
  }

  findAll() {
    return `This action returns all coursiers`;
  }

  async findOne(id: number) {
    const coursier = await this.coursierRepository.findOne({
      relations: ['agence', 'user'],
      where: {
        id: id,
      },
    });
    if (!coursier) {
      throw new EntityNotFoundError(Coursier, id);
    } else {
      return coursier;
    }
  }
  // chercher tous les coursiers apartient a la station de l'employe
  async findAllByStation(userId): Promise<Coursier[]> {
    const user = await this.userService.findInformationsEmploye(userId);
    const coursiersList = await this.coursierRepository.find({
      relations: ['agence'],
      where: {
        agence: user.employe.agence.id,
      },
    });
    if (!coursiersList) {
      throw new EntityNotFoundError(Coursier, userId);
    } else {
      return coursiersList;
    }
  }
  async findInformationOfCoursierByUserId(id: number) {
    const coursierInfo = await this.coursierRepository.findOne({
      relations: ['user', 'agence', 'agence.commune', 'agence.commune.wilaya'],
      where: {
        user: {
          id: id,
        },
      },
    });
    if (!coursierInfo) {
      throw new EntityNotFoundError(Coursier, id);
    } else {
      return coursierInfo;
    }
  }

  async getOneCoursierById(cousierId: number): Promise<Coursier> {
    const coursierInfo = await this.coursierRepository.findOne({
      relations: ['user'],
      where: {
        id: cousierId,
      },
    });
    if (!coursierInfo) {
      throw new EntityNotFoundError(Coursier, cousierId);
    } else {
      return coursierInfo;
    }
  }
  async updateCoursier(
    updateCoursierDto: UpdateCoursierDto,
    id: number,
  ): Promise<UpdateResult> {
    let isActif: boolean;
    let updateUserDto: UpdateUserDto;
    if (updateCoursierDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    const currentDate = new Date();
    if (updateCoursierDto.dateNaissance > currentDate) {
      throw new UnprocessableEntityException(
        'la date de naissance est supérieure à la date actuelle',
      );
    } else if (updateCoursierDto.dateRecrutement > currentDate) {
      throw new UnprocessableEntityException(
        'la date de recrutement est supérieure à la date actuelle',
      );
    } else if (
      updateCoursierDto.dateNaissance > updateCoursierDto.dateRecrutement
    ) {
      throw new UnprocessableEntityException(
        'la date de recrutement est inférieure à la date de naissance',
      );
    } else {
      const userToUpdateId = (
        await this.coursierRepository.findOne({
          relations: ['user'],
          where: { id: id },
        })
      ).user.id;
      if (updateCoursierDto.password) {
        updateUserDto = {
          email: updateCoursierDto.email,
          password: updateCoursierDto.password,
          isActive: isActif,
          typeUser: TypeUserEnum.coursier,
        };
      } else {
        updateUserDto = {
          email: updateCoursierDto.email,
          isActive: isActif,
          typeUser: TypeUserEnum.coursier,
        };
      }
      await this.userService.update(userToUpdateId, updateUserDto);
      const agence = await this.agenceService.findOneAgenceById(
        updateCoursierDto.agenceId,
      );
      const updateCoursier = this.coursierRepository.create(updateCoursierDto);
      updateCoursier.agence = agence;
      return await this.coursierRepository.update(id, updateCoursier);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} coursier`;
  }

  async updateActivity(
    id: number,
    updateCoursierDto: UpdateCoursierDto,
  ): Promise<UpdateResult> {
    let isActif: boolean;
    let updateUserDto: UpdateUserDto;
    if (updateCoursierDto.isActive === 'true') {
      isActif = true;
    } else {
      isActif = false;
    }
    updateUserDto = {
      isActive: isActif,
    };
    const userToUpdateId = (
      await this.coursierRepository.findOne({
        relations: ['user'],
        where: { id: id },
      })
    ).user.id;
    return this.userService.update(userToUpdateId, updateUserDto)
  }
}
