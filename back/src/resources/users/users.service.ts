import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { EntityNotFoundError, ILike, Not, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserResponse } from './interfaces/IUserResponse';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const checkEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (checkEmail) {
      throw new UnprocessableEntityException('Email éxiste déja!');
    } else {
      const createUser = this.userRepository.create(createUserDto);
      const saveUser = await this.userRepository.save(createUser);
      return saveUser;
    }
  }

  async findAll() {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.status', 'status')
      .leftJoinAndSelect('status.shipment', 'shipment')
      .getRawMany();
    return user;
  }

  /**
   * find All Users
   * @returns
   */
  async findAllV2(
    options: IPaginationOptions,
    searchUserTerm?: string,
  ): Promise<Pagination<User>> {
    this.logger.debug(this.findAllV2.name);
    let users;
    if (searchUserTerm && Number(searchUserTerm) != NaN) {
      this.logger.verbose(searchUserTerm);
      users = paginate<User>(
        this.userRepository,
        {
          page: options.page,
          limit: options.limit,
          route: 'http://localhost:3000/users',
        },
        {
          where: [{ email: ILike(`%${searchUserTerm}%`) }],
        },
      );
    } else {
      users = paginate<User>(this.userRepository, {
        page: options.page,
        limit: options.limit,
        route: 'http://localhost:3000/users',
      });
    }
    if ((await users).items.length <= 0) {
      throw new EntityNotFoundError(User, 'No Users');
    }
    return users;
  }

  async findOne(id: number) {
    const response = await this.userRepository.findOne(id, {
      relations: ['employe', 'employe.agence'],

    });
    if (response) {
      return response;
    } else {
      throw new EntityNotFoundError(User, id);
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const response = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: ['id', 'email', 'password', 'isActive', 'typeUser'],
    });
    if (response) {
      return response;
    } else {
      throw new UnauthorizedException(User, email);
    }
  }

  /**
   * find User by email for login
   * @param email
   * @returns
   */
  async findOneByemailV2(email: string): Promise<IUserResponse> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['typeUser'],
      select: ['id', 'email', 'password', 'isActive', 'typeUser'],
    });
  }
  /**
   * find informations employe by user id
   * @param email
   * @returns
   */
  async findInformationsEmploye(id: number) {
    const user = await this.userRepository.findOne({
      relations: [
        'employe',
        'employe.agence',
        'employe.agence.commune',
        'employe.agence.commune.wilaya',
      ],
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new EntityNotFoundError(User, id);
    } else {
      delete user.password;
      return user;
    }
  }

  async findInformationUserOfCoursier(id: number) {
    const user = await this.userRepository.findOne({
      relations: ['coursier'],
      where: {
  //      coursier: {
          id: id,
  //      },
      },
    });
    if (!user) {
      throw new EntityNotFoundError(User, id);
    } else {
      delete user.password;
      return user;
    }
  }
  /**
   * update User
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const checkEmail = await this.userRepository.findOne({
      where: {
        email: updateUserDto.email,
        id: Not(id),
      },
    });
    if (checkEmail) {
      throw new UnprocessableEntityException('Email éxiste déja!');
    } else {
      await this.findOne(id);
      const updateUser = this.userRepository.create(updateUserDto);
      const updatedUser = await this.userRepository.update(id, updateUser);
      return updatedUser;
    }
  }

  async countUsers(): Promise<number> {
    const count = await this.userRepository.count();
    return count;
  }
}
