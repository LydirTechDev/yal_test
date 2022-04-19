import { Module } from '@nestjs/common';
import { SacShipmentsService } from './sac-shipments.service';
import { SacShipmentsController } from './sac-shipments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SacShipment } from './entities/sac-shipment.entity';
import { SacService } from '../sac/sac.service';
import { PdfService } from 'src/core/templates/pdf.service';
import { AgencesService } from '../agences/agences.service';
import { ClientsTarifsService } from '../clients-tarifs/clients-tarifs.service';
import { ClientsService } from '../clients/clients.service';
import { CodeTarifsZonesService } from '../code-tarifs-zones/code-tarifs-zones.service';
import { CommunesService } from '../communes/communes.service';
import { EmployesService } from '../employes/employes.service';
import { PoidsService } from '../poids/poids.service';
import { ServicesService } from '../services/services.service';
import { ShipmentsService } from '../shipments/shipments.service';
import { StatusService } from '../status/status.service';
import { UsersService } from '../users/users.service';
import { WilayasService } from '../wilayas/wilayas.service';
import { ZonesService } from '../zones/zones.service';
import { Agence } from '../agences/entities/agence.entity';
import { ClientsTarif } from '../clients-tarifs/entities/clients-tarif.entity';
import { Client } from '../clients/entities/client.entity';
import { CodeTarifsZone } from '../code-tarifs-zones/entities/code-tarifs-zone.entity';
import { Commune } from '../communes/entities/commune.entity';
import { Employe } from '../employes/entities/employe.entity';
import { Poid } from '../poids/entities/poid.entity';
import { Sac } from '../sac/entities/sac.entity';
import { Service } from '../services/entities/service.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { Status } from '../status/entities/status.entity';
import { User } from '../users/entities/user.entity';
import { Wilaya } from '../wilayas/entities/wilaya.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Fonction } from '../fonctions/entities/fonction.entity';
import { Departement } from '../departements/entities/departement.entity';
import { Banque } from '../banques/entities/banque.entity';
import { BanquesService } from '../banques/banques.service';
import { DepartementsService } from '../departements/departements.service';
import { FonctionsService } from '../fonctions/fonctions.service';
import { Coursier } from 'src/resources/coursier/entities/coursier.entity';
import { CoursierService } from 'src/resources/coursier/coursier.service';
import { CodeTarifService } from '../code-tarif/code-tarif.service';
import { CodeTarif } from '../code-tarif/entities/code-tarif.entity';
import { ExcelService } from 'src/core/templates/excel/excel.service';
import { PmtCoursierService } from '../pmt-coursier/pmt-coursier.service';
import { PmtCoursier } from '../pmt-coursier/entities/pmt-coursier.entity';
import { ExpiditeurPublic } from '../expiditeur-public/entities/expiditeur-public.entity';
import { ExpiditeurPublicService } from '../expiditeur-public/expiditeur-public.service';
import { ServiceClientService } from '../service-client/service-client.service';
import { RotationsService } from '../rotations/rotations.service';
import { Rotation } from '../rotations/entities/rotation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SacShipment,
      Sac,
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
      Agence,
      Fonction,
      Departement,
      Banque,
      Coursier,
      CodeTarif,
      PmtCoursier,
      ExpiditeurPublic,
      Rotation
    ]),
  ],
  controllers: [SacShipmentsController],
  providers: [
    SacShipmentsService,
    ShipmentsService,
    SacService,
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
    ExcelService,
    PmtCoursierService,
    ExpiditeurPublicService,
    RotationsService,
    ServiceClientService
  ],
})
export class SacShipmentsModule {}
