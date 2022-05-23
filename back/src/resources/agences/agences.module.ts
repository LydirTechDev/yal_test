import { Module } from '@nestjs/common';
import { AgencesService } from './agences.service';
import { AgencesController } from './agences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agence } from './entities/agence.entity';
import { Commune } from '../communes/entities/commune.entity';
import { CommunesService } from '../communes/communes.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { Banque } from '../banques/entities/banque.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { User } from '../users/entities/user.entity';
import { BanquesService } from '../banques/banques.service';
import { DepartementsService } from '../departements/departements.service';
import { EmployesService } from '../employes/employes.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { UsersService } from '../users/users.service';
import { ExcelService } from 'src/core/templates/excel/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agence,
      Commune,
      Wilaya,
      User,
      Fonction,
      Departement,
      Banque,
      Employe,
    ]),
  ],
  controllers: [AgencesController],
  providers: [
    AgencesService,
    CommunesService,
    WilayasService,
    EmployesService,
    UsersService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    ExcelService
  ],
})
export class AgencesModule {}
