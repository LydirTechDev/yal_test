import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityNotFoundError,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreatePoidDto } from './dto/create-poid.dto';
import { UpdatePoidDto } from './dto/update-poid.dto';
import { Poid } from './entities/poid.entity';
/**
 *
 */
@Injectable()
export class PoidsService {
  constructor(
    @InjectRepository(Poid)
    private poidsRepository: Repository<Poid>,
  ) {}
  create(createPoidDto: CreatePoidDto) {
    return 'This action adds a new poid';
  }
  // chekSurpoids = await this.poidsRepository.findOne({
  //   where: {
  //     min: LessThanOrEqual(poids),
  //     max: MoreThanOrEqual(poids),
  //   },
  // });
  async findPoidsPlage(poidsMin: number, poidsMax: number) {
    const palge = await this.poidsRepository.findOne({
      where: {
        min: poidsMin,
        max: poidsMax,
      },
    });
    if (!palge) {
      throw new EntityNotFoundError(
        Poid,
        `la palge  ${poidsMin}-${poidsMax} n'existe pas`,
      );
    }
    return palge;
  }

  async chekSurpoids(poids: number, volume: number) {
    if (poids > volume) {
      return await this.poidsRepository.findOne({
        where: {
          min: LessThanOrEqual(poids),
          max: MoreThanOrEqual(poids),
        },
      });
    } else {
      return await this.poidsRepository.findOne({
        where: {
          min: LessThanOrEqual(volume),
          max: MoreThanOrEqual(volume),
        },
      });
    }
    // let poidTarifier: number;
    // if ( poids === 0 && volume === 0 ) {
    //   poidTarifier = poids + 1;
    // } else if (poids > volume) {
    //   poidTarifier = poids;
    // } else if (poids < volume) {
    //   poidTarifier = volume;
    // }
    // return await this.poidsRepository.findOne({
    //   where: {
    //     min: LessThanOrEqual(poidTarifier),
    //     max: MoreThanOrEqual(poidTarifier),
    //   },
    // });
  }

  findAll() {
    return this.poidsRepository.find({
      order: { min: 'ASC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} poid`;
  }
  update(id: number, updatePoidDto: UpdatePoidDto) {
    return `This action updates a #${id} poid`;
  }
  remove(id: number) {
    return `This action removes a #${id} poid`;
  }
}
