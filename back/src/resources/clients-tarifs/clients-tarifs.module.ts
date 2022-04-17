import { Module } from '@nestjs/common';
import { ClientsTarifsService } from './clients-tarifs.service';
import { ClientsTarifsController } from './clients-tarifs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsTarif } from './entities/clients-tarif.entity';
import { AgencesService } from '../agences/agences.service';
import { Agence } from '../agences/entities/agence.entity';
import { ClientsService } from '../clients/clients.service';
import { Client } from '../clients/entities/client.entity';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { CommunesService } from '../communes/communes.service';
import { Commune } from '../communes/entities/commune.entity';
import { Service } from '../services/entities/service.entity';
import { ServicesService } from '../services/services.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { WilayasService } from '../wilayas/wilayas.service';
import { Employe } from '../employes/entities/employe.entity';
import { EmployesService } from '../employes/employes.service';
import { Banque } from '../banques/entities/banque.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { BanquesService } from '../banques/banques.service';
import { DepartementsService } from '../departements/departements.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { ZonesService } from '../zones/zones.service';
import { PoidsService } from '../poids/poids.service';
import { Zone } from '../zones/entities/zone.entity';
import { Poid } from '../poids/entities/poid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientsTarif,
      CodeTarif,
      Client,
      User,
      Agence,
      Commune,
      Wilaya,
      Service,
      Employe,
      Fonction,
      Departement,
      Banque,
      CodeTarifsZone,
      Zone,
      Poid,
    ]),
  ],
  controllers: [ClientsTarifsController],
  providers: [
    ClientsTarifsService,
    CodeTarifService,
    ClientsService,
    UsersService,
    AgencesService,
    CommunesService,
    WilayasService,
    ServicesService,
    EmployesService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    PdfService,
    ExcelService,
    CodeTarifsZonesService,
    ZonesService,
    PoidsService,
  ],
})
export class ClientsTarifsModule {}
