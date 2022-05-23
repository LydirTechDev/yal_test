import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateRecolteFactureDto } from './dto/create-recolte-facture.dto';
import { UpdateRecolteFactureDto } from './dto/update-recolte-facture.dto';
import { RecolteFacture } from './entities/recolte-facture.entity';

@Injectable()

export class RecolteFactureService {
  constructor(
    @InjectRepository(RecolteFacture)
    private recolteFactureRepository: Repository<RecolteFacture>,
    private userService: UsersService,
  ) { }


 async create(createRecolteFactureDto: CreateRecolteFactureDto) {
    const recolte = this.recolteFactureRepository.create();
    const agentOfCreation = await this.userService.findInformationsEmploye(
      createRecolteFactureDto.createdBy,
    );
    const agenceOfCreation = agentOfCreation.employe.agence;
    recolte.createdBy=agentOfCreation;
   

  }

  findAll() {
    return `This action returns all recolteFacture`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recolteFacture`;
  }

  update(id: number, updateRecolteFactureDto: UpdateRecolteFactureDto) {
    return `This action updates a #${id} recolteFacture`;
  }

  remove(id: number) {
    return `This action removes a #${id} recolteFacture`;
  }
}
