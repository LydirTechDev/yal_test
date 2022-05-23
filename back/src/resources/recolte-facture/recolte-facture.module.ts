import { Module } from '@nestjs/common';
import { RecolteFactureService } from './recolte-facture.service';
import { RecolteFactureController } from './recolte-facture.controller';
import { RecolteFacture } from './entities/recolte-facture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from '../facture/entities/facture.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecolteFacture,Facture,User])],
  controllers: [RecolteFactureController],
  providers: [RecolteFactureService,UsersService],
})
export class RecolteFactureModule {}
