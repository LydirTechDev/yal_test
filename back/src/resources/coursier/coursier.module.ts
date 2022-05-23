import { Module } from '@nestjs/common';
import { CoursierService } from './coursier.service';
import { CoursierController } from './coursier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agence } from 'src/resources/agences/entities/agence.entity';
import { Commune } from 'src/resources/communes/entities/commune.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Wilaya } from 'src/resources/wilayas/entities/wilaya.entity';
import { Coursier } from './entities/coursier.entity';
import { AgencesService } from 'src/resources/agences/agences.service';
import { CommunesService } from 'src/resources/communes/communes.service';
import { UsersService } from 'src/resources/users/users.service';
import { WilayasService } from 'src/resources/wilayas/wilayas.service';
import { BanquesService } from 'src/resources/banques/banques.service';
import { DepartementsService } from 'src/resources/departements/departements.service';
import { EmployesService } from 'src/resources/employes/employes.service';
import { FonctionsService } from 'src/resources/fonctions/fonctions.service';
import { Banque } from 'src/resources/banques/entities/banque.entity';
import { Departement } from 'src/resources/departements/entities/departement.entity';
import { Employe } from 'src/resources/employes/entities/employe.entity';
import { Fonction } from 'src/resources/fonctions/entities/fonction.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coursier,
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
  controllers: [CoursierController],
  providers: [
    AgencesService,
    CommunesService,
    WilayasService,
    UsersService,
    CoursierService,
    EmployesService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    ExcelService
  ],
})
export class CoursierModule {}
