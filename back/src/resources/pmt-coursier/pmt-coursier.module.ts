import { Module } from '@nestjs/common';
import { PmtCoursierService } from './pmt-coursier.service';
import { PmtCoursierController } from './pmt-coursier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PmtCoursier } from './entities/pmt-coursier.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { AgencesService } from '../agences/agences.service';
import { BanquesService } from '../banques/banques.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { ClientsService } from '../clients/clients.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CommunesService } from '../communes/communes.service';
import { CoursierService } from '../coursier/coursier.service';
import { DepartementsService } from '../departements/departements.service';
import { EmployesService } from '../employes/employes.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { PoidsService } from '../poids/poids.service';
import { ServicesService } from '../services/services.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { ZonesService } from '../zones/zones.service';
import { Agence } from '../agences/entities/agence.entity';
import { Banque } from '../banques/entities/banque.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { Client } from '../clients/entities/client.entity';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Coursier } from '../coursier/entities/coursier.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Poid } from '../poids/entities/poid.entity';
import { Service } from '../services/entities/service.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { Status } from '../status/entities/status.entity';
import { User } from '../users/entities/user.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { Zone } from '../zones/entities/zone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PmtCoursier, 
      Shipment,
      Wilaya,
      Commune,
      User,
      Service,
      Status,
      Client,
      ClientsTarif,
      CodeTarifsZone,
      Poid,
      Zone,
      CodeTarifsZone,
      Employe,
      Fonction,
      Departement,
      Agence,
      Banque,
      Coursier,
      CodeTarif,
    ]),
  ],
  controllers: [PmtCoursierController],
  providers: [PmtCoursierService,
    ShipmentsService,
    WilayasService,
    CommunesService,
    UsersService,
    ServicesService,
    StatusService,
    ClientsService,
    ClientsTarifsService,
    CodeTarifsZonesService,
    PoidsService,
    ZonesService,
    PdfService,
    EmployesService,
    FonctionsService,
    DepartementsService,
    BanquesService,
    AgencesService,
    CoursierService,
    CodeTarifService,
    ExcelService,]
})
export class PmtCoursierModule {}
