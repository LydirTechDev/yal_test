import { Module } from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { Zone } from '../zones/entities/zone.entity';
import { ZonesService } from '../zones/zones.service';
import { Rotation } from './entities/rotation.entity';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { CommunesService } from '../communes/communes.service';
import { DepartementsService } from '../departements/departements.service';
import { EmployesService } from '../employes/employes.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { UsersService } from '../users/users.service';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { User } from '../users/entities/user.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rotation,
      Wilaya,
      Zone,
      User,
      Fonction,
      Departement,
      Agence,
      Commune,
      Banque,
      Employe,
    ]),
  ],
  controllers: [RotationsController],
  providers: [
    RotationsService,
    WilayasService,
    ZonesService,
    EmployesService,
    UsersService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    CommunesService,
    ExcelService,
  ],
})
export class RotationsModule {}
