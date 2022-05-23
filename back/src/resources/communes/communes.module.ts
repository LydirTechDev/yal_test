import { Module } from '@nestjs/common';
import { CommunesService } from './communes.service';
import { CommunesController } from './communes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commune } from './entities/commune.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { Employe } from '../employes/entities/employe.entity';
import { EmployesService } from '../employes/employes.service';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { DepartementsService } from '../departements/departements.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { UsersService } from '../users/users.service';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { Departement } from '../departements/entities/departement.entity';
import { User } from '../users/entities/user.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commune,
      Wilaya,
      Employe,
      User,
      Fonction,
      Departement,
      Agence,
      Banque,
    ]),
  ],
  controllers: [CommunesController],
  providers: [
    CommunesService,
    WilayasService,
    EmployesService,
    UsersService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    ExcelService
  ],
})
export class CommunesModule {}
