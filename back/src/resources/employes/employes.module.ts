import { Module } from '@nestjs/common';
import { EmployesService } from './employes.service';
import { EmployesController } from './employes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employe } from './entities/employe.entity';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { User } from '../users/entities/user.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { CommunesService } from '../communes/communes.service';
import { DepartementsService } from '../departements/departements.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employe,
      User,
      Fonction,
      Departement,
      Agence,
      Commune,
      Wilaya,
      Banque,
    ]),
  ],
  controllers: [EmployesController],
  providers: [
    EmployesService,
    UsersService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    CommunesService,
    WilayasService,
  ],
  exports: [
    EmployesService,
    UsersService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    CommunesService,
    WilayasService,
  ],
})
export class EmployesModule {}
