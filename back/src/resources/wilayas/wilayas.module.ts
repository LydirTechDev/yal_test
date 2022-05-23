import { Module } from '@nestjs/common';
import { WilayasService } from './wilayas.service';
import { WilayasController } from './wilayas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilaya } from './entities/wilaya.entity';
import { Employe } from '../employes/entities/employe.entity';
import { EmployesService } from '../employes/employes.service';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { User } from '../users/entities/user.entity';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { CommunesService } from '../communes/communes.service';
import { DepartementsService } from '../departements/departements.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { UsersService } from '../users/users.service';
import { ExcelService } from 'src/core/templates/excel/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Fonction,
      Departement,
      Agence,
      Commune,
      Wilaya,
      Banque,
      Employe,
    ]),
  ],
  controllers: [WilayasController],
  providers: [
    WilayasService,
    EmployesService,
    UsersService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    CommunesService,
    ExcelService
  ],
  exports: [WilayasService],
})
export class WilayasModule {}
